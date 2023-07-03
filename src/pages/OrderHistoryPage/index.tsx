import { useState, useEffect } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { ItemAllBuymAPI } from '../../api/productApi'
import { API_HEADER } from '../../api/usersApi'
import { Modal, Button } from 'antd'
import './OrderHistoryPage.css'

interface Order {
  detailId: string
  product: {
    title: string
    priceSales: number
    description: string
  }
  timePaid: string
}

interface BankInfo {
  accountNumber: string
  bankCode: string
  bankName: string
  price: number
  genre: string
  time: string
}

interface Book {
  cover: string
  title: string
  priceSales: number
  description: string
}

const OrderHistoryPage: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<Order[] | null>(null)
  const { loginToken } = useAccountTokenStore()

  const [detailId, setDetailId] = useState<string | null>(null)

  console.log(detailId)

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (loginToken) {
        try {
          const response = await ItemAllBuymAPI(loginToken)
          setOrderHistory(response)

          if (response && response.length > 0) {
            const firstOrder = response[0]
            const detailId = firstOrder.detailId
            setDetailId(detailId)
          }
          console.log(response)
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetchOrderHistory()
  }, [loginToken, setDetailId])

  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString)
    return dateTime.toLocaleString()
  }

  async function ItemBuyDetailmAPI(detailId: string) {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/detail',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          detailId: detailId
        })
      }
    )
    if (res.status === 200) {
      setDetailMoadl(true)
      const json = await res.json().then()
      const accountNumber = json.account.accountNumber
      const bankCode = json.account.bankCode
      const bankName = json.account.bankName
      const price = json.product.price
      const genre = json.product.description
      const time = json.timePaid

      setBankInfo({
        accountNumber,
        bankCode,
        bankName,
        price,
        genre,
        time
      })
      console.log(json)
      setDetailId(detailId)
    }
  }

  const [detailModal, setDetailMoadl] = useState<boolean>(false)
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)

  async function ItemConfirmAPI(detailId: string) {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/ok',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          detailId: detailId
        })
      }
    )
    if (res.status === 200) {
      const confirmContent = await res.json()
      console.log(res)
      return confirmContent
    }
  }

  const [confirmContent, setConfirmContent] = useState<string>('')
  const [confirmModal, setConfirmModal] = useState<boolean>(false)

  const handleConfirmModal = async (detailId: string) => {
    const result = await ItemConfirmAPI(detailId)
    if (result) {
      setConfirmContent('주문이 완료되었습니다.')
      setConfirmModal(true)
    } else {
      setConfirmContent('이미 구매가 확정되었거나, 취소된 상품입니다.')
      setConfirmModal(true)
    }
  }

  async function ItemCancelAPI(detailId: string) {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/cancel',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          detailId: detailId
        })
      }
    )
    if (res.ok) {
      const cancelContent = await res.json()
      return cancelContent
    }
  }

  const [cancelContent, setCancelContent] = useState<string>('')
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const handleCancelClick = async (detailId: string) => {
    const result = await ItemCancelAPI(detailId)
    if (result) {
      setCancelContent('주문 취소가 완료되었습니다.')
      setCancelModal(true)
    } else {
      setCancelContent(
        '이미 주문 취소가 완료되었거나, 구매가 확정된 상품입니다.'
      )
      setCancelModal(true)
    }
  }

  const handleModalOk = () => {
    setDetailMoadl(false)
    setCancelModal(false)
    setConfirmModal(false)
  }

  return (
    <div className="order-history-page">
      <h1>주문내역 페이지</h1>

      {orderHistory &&
      Array.isArray(orderHistory) &&
      orderHistory.length > 0 ? (
        orderHistory.map((order, index) => {
          const parsedTitle = JSON.parse(order.product.title)

          return (
            <div
              className="history-wrap"
              key={order.detailId}>
              <h2>주문번호: {index + 1}</h2>

              {parsedTitle.map((book: Book, index : number) => (
                <div key={index}>
                  <img
                    src={book.cover}
                    alt={book.title}
                  />
                  <h3>제목: {book.title}</h3>
                  <h4>가격: {book.priceSales}</h4>
                  <h4>줄거리: {book.description}</h4>
                </div>
              ))}
              <div className="btnWrap">
                <Button onClick={() => ItemBuyDetailmAPI(order.detailId)}>
                  상세 내역
                </Button>
                <Button onClick={() => handleConfirmModal(order.detailId)}>
                  주문 확정
                </Button>
                <Button onClick={() => handleCancelClick(order.detailId)}>
                  주문 취소
                </Button>
              </div>
              <hr />
            </div>
          )
        })
      ) : (
        <h2>거래 내역이 존재하지 않습니다.</h2>
      )}

      <Modal
        open={detailModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p className="modal-title">결제 정보</p>
        <p>거래 은행: {bankInfo?.bankName}</p>
        <p>계좌 정보: {bankInfo?.accountNumber}</p>
        <p>주문 금액: {bankInfo?.price}</p>
        <p>카테고리: {bankInfo?.genre}</p>
        <p>주문 일시: {bankInfo?.time ? formatDateTime(bankInfo.time) : ""}</p>
      </Modal>

      <Modal
        open={cancelModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{cancelContent}</p>
      </Modal>

      <Modal
        open={confirmModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{confirmContent}</p>
      </Modal>
    </div>
  )
}

export default OrderHistoryPage
