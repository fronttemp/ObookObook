import { useEffect, useState } from 'react'
import { Table, Button, Checkbox } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../../components/ConfirmModal'
import { logCheckAPI } from '../../api/usersApi'
import useAccountTokenStore from '../../store/useAccountTokenStore'

interface Book {
  // 책의 세부 정보에 대한 타입을 정의
  id: string
  isbn: string
  title: string
  cover: string
  priceStandard: number
}

const CartPage: React.FC = () => {
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isRemoveSelectedModalVisible, setIsRemoveSelectedModalVisible] =
    useState<boolean>(false)
  const [isNoItemSelectedModalVisible, setIsNoItemSelectedModalVisible] =
    useState<boolean>(false)
  const [isSignInRedirectModalVisible, setIsSignInRedirectModalVisible] =
    useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false)
  const { bookCart, removeBook, saveSelectedItems, removeSelectedBooks } =
    useCartStore()
    const { loginToken, nickNameToken } = useAccountTokenStore((state) => ({ 
      loginToken: state.loginToken,
      nickNameToken: state.nickNameToken
    }))

  const navigate = useNavigate()

  const priceKr = (price: number) => {
    return <span>{`${price.toLocaleString('ko-KR')} 원`}</span>
  }

  const handleSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
      setSelectAll(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(bookCart.map(book => book.id))
    }
    setSelectAll(!selectAll)
  }

  const handleTotalPrice = () => {
    const totalPrice = selectedItems.reduce((acc: number, id) => {
      const book = bookCart.find(book => book.id === id)
      if (book) {
        const price = book.priceStandard
        return acc + price
      }
      return acc
    }, 0)
    setTotalPrice(totalPrice)
  }

  const handleRemoveBook = (book: Book) => {
    removeBook(book)
  }

  const handleRemoveSelected = () => {
    setIsRemoveSelectedModalVisible(true)
  }

  const onRemoveSelectedConfirm = (confirm: boolean) => {
    if (confirm) {
      removeSelectedBooks(selectedItems)
      setSelectedItems([])
    }
    setIsRemoveSelectedModalVisible(false)
  }

  const handleOrder = async () => {
    if (selectedItems.length === 0) {
      setIsNoItemSelectedModalVisible(true)
      return
    }

    const accountToken = localStorage.getItem('accountToken') || '{}';
    const loginToken = JSON.parse(accountToken).state.loginToken
    
    if (!loginToken) {
      setIsSignInRedirectModalVisible(true)
      return
    }

    try {
      const userInfo = await logCheckAPI(loginToken)
      if (userInfo.error) {
        setIsSignInRedirectModalVisible(true)
        return
      }

      if (isAdmin) {
        // 관리자인 경우 오류 모달 띄우기
        setIsErrorModalVisible(true)
        return
      }

      setIsModalVisible(true)
    } catch (error) {
      console.error(error)
      setIsSignInRedirectModalVisible(true)
    }
  }

  const onConfirm = (confirm: boolean) => {
    if (confirm) {
      saveSelectedItems(selectedItems)
      navigate('/Checkout')
    }
    setIsModalVisible(false)
  }

  useEffect(() => {
    setSelectedItems(bookCart.map(book => book.id))
  }, [])

  useEffect(() => {
    setSelectedItems(prevSelectedItems => {
      const updatedSelectedItems = prevSelectedItems.filter(id =>
        bookCart.some(book => book.id === id)
      )
      if (updatedSelectedItems.length !== prevSelectedItems.length) {
        setSelectAll(false)
      }
      return updatedSelectedItems
    })
  }, [bookCart])

  useEffect(() => {
    handleTotalPrice()
    if (selectedItems.length !== bookCart.length) {
      setSelectAll(false)
    } else {
      setSelectAll(true)
    }
  }, [selectedItems])

  // 관리자 여부 확인하는 useEffect 추가
  useEffect(() => {
    if (nickNameToken === 'admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [loginToken, nickNameToken])

  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state: { value } })
  }

  const dataSource = bookCart.map((book, index) => ({
    key: index,
    name: (
      <div
        onClick={() => moveDetailPage(book.isbn)}
        style={{ cursor: 'pointer' }}>
        {book.title.length > 20 ? book.title.slice(0, 19) + '...' : book.title}
      </div>
    ),
    cover: (
      <img
        src={book.cover}
        alt={book.title}
        style={{ width: '50px', cursor: 'pointer' }}
        onClick={() => {
          moveDetailPage(book.isbn)
        }}
      />
    ),
    isbn: book.isbn,
    price: priceKr(book.priceStandard),
    action: (
      <Button
        onClick={() => {
          handleRemoveBook(book)
        }}>
        삭제
      </Button>
    ),
    select: (
      <Checkbox
        checked={selectedItems.includes(book.id)}
        onChange={e => handleSelect(book.id, e.target.checked)}
      />
    )
  }))

  const columns = [
    {
      title: (
        <Checkbox
          onChange={handleSelectAll}
          checked={selectAll}
        />
      ),
      dataIndex: 'select',
      key: 'select'
    },
    {
      title: '책 커버',
      dataIndex: 'cover',
      key: 'cover'
    },
    {
      title: '제목',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: <div style={{ textAlign: 'center' }}>가격</div>,
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const
    },
    {
      title: <Button onClick={handleRemoveSelected}>선택삭제</Button>,
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const
    }
  ]

  return (
    <section className="cart-page">
      <div className="cart-content">
        <div className="page_title">{`장바구니 (${selectedItems.length})`}</div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="total-price-container">
            <div className="total-price-title">결제 예정 금액</div>
            <div className="total-price">{priceKr(totalPrice)}</div>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={handleOrder}>
            {`주문하기 (${selectedItems.length})`}
          </Button>
          <ConfirmModal
            content={`${selectedItems.length} 개의 상품을 주문하시겠습니까?`}
            onConfirm={onConfirm}
            open={isModalVisible}
            setConfirmVisible={setIsModalVisible}
          />
          <ConfirmModal
            content={`선택된 ${selectedItems.length} 개의 상품을 삭제하시겠습니까?`}
            onConfirm={onRemoveSelectedConfirm}
            open={isRemoveSelectedModalVisible}
            setConfirmVisible={setIsRemoveSelectedModalVisible}
          />
          <ConfirmModal
            content="주문할 상품을 선택해주세요"
            onConfirm={() => setIsNoItemSelectedModalVisible(false)}
            open={isNoItemSelectedModalVisible}
            setConfirmVisible={setIsNoItemSelectedModalVisible}
            showCancelButton={false}
          />
          <ConfirmModal
            content="로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
            onConfirm={() => navigate('/signInPage')}
            open={isSignInRedirectModalVisible}
            setConfirmVisible={setIsSignInRedirectModalVisible}
          />
          <ConfirmModal
            content="관리자는 상품 주문이 불가능합니다."
            onConfirm={() => setIsErrorModalVisible(false)}
            open={isErrorModalVisible}
            setConfirmVisible={setIsErrorModalVisible}
            showCancelButton={false}
          />
        </div>
      </div>
    </section>
  )
}

export default CartPage
