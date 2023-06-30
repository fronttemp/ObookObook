import { useEffect, useState } from 'react'
import { Button, Card, Radio, Grid } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'
import { accountCheckAPI } from '../../api/accountApi'
import './CheckoutPage.css'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import ConfirmModal from '../../components/ConfirmModal'
import { ItemAddAPI, ItemBuyAPI } from '../../api/productApi'

const { useBreakpoint } = Grid

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState(0)
  const [bankAccounts, setBankAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const { selectedItems } = useCartStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()
  const screen = useBreakpoint()
  const { loginToken } = useAccountTokenStore()

  const priceKr = price => {
    return `${price.toLocaleString('ko-KR')}원`
  }

  const handleTotalPrice = () => {
    const totalPrice = selectedItems.reduce((acc, book) => {
      const price = book.priceStandard
      return acc + price
    }, 0)
    setTotalPrice(totalPrice)
  }

  const fetchBankAccounts = async () => {
    try {
      const data = await accountCheckAPI(loginToken)
      if (data && data.accounts) {
        setBankAccounts(data.accounts)
      }
    } catch (error) {
      console.error('Fetching bank accounts failed:', error)
    }
  }

  const handleBankAccountSelect = accountId => {
    // Handle selection of bank account
    setSelectedAccountId(accountId)
  }
  console.log('Selected bank account:', selectedAccountId)
  useEffect(() => {
    handleTotalPrice()
    fetchBankAccounts()
  }, [selectedItems])

  const handlePayment = () => {
    setIsModalVisible(true)
  }

  const onConfirm = async confirm => {
    setIsModalVisible(false)
    if (confirm) {
      // 실제 결제 로직을 여기에 추가해주세요.
      console.log('Payment initiated')

      // 결제 정보를 하나의 string으로 변환하기
      const title = JSON.stringify(selectedItems);

      console.log(selectedItems)

      try {
        const description = "ebook"
        const price = totalPrice 
        // 제품 추가 (구매 신청 전 먼저 등록 필요)
        const responseAddProduct = await ItemAddAPI(
          title,
          price,
          description
        )
        
        const productId =responseAddProduct.id

        //제품 구매 신청
        const response = await ItemBuyAPI(
          loginToken,
          productId,
          selectedAccountId
        )
        if (response === true) {
          console.log('Payment successful')
          navigate('/Account/OrderHistory') // 결제가 성공하면 내 계정-주문내역 페이지로 이동
        } else {
          console.log('Payment failed:', response)
        }
      } catch (error) {
        console.error('Payment failed:', error)
      }
    }
  }
  return (
    <div className="checkout-page">
      <div className="left-section">
        <h1>주문/결제</h1>
        <Card
          className="left-section__items"
          title={`주문상품 총 ${selectedItems.length} 개`}>
          <div className="checkout-content">
            {selectedItems.map((book, index) => (
              <div
                key={index}
                className={`book-item ${
                  screen.xs ? 'book-item-xs' : 'book-item-sm'
                }`}>
                <img
                  src={book.cover}
                  alt={book.title}
                  style={{ width: '100px' }}
                />
                <p
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '2',
                    overflow: 'hidden'
                  }}>
                  {book.title}
                </p>
                <p>{priceKr(book.priceStandard)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card
          className="left-section__payment"
          title="결제 수단">
          <div className="payment-selection">
            <p>오북페이</p>
          </div>
          <div className="bank-account-list">
            {bankAccounts.length > 0 ? (
              <Radio.Group
                onChange={e => handleBankAccountSelect(e.target.value)}>
                {bankAccounts.map(account => (
                  <Radio
                    key={account.id}
                    value={account.id}>
                    <div>
                      <p>{`${account.bankName} ${account.accountNumber}`}</p>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            ) : (
              <p>사용 가능한 은행 계좌가 없습니다. 계좌를 연결해주세요.</p>
            )}
          </div>
        </Card>
      </div>
      <div className="checkout-sidebar">
        <div className="sidebar-content">
          <div className="total-price-container">
            <h2>최종 결제 금액</h2>
            <h2>{priceKr(totalPrice)}</h2>
          </div>
          <Button
            type="primary"
            size="large"
            style={{ width: '80%' }}
            onClick={handlePayment}>
            결제하기
          </Button>
          <ConfirmModal
            content={
              <>
                총 {selectedItems.length}개의 상품, {priceKr(totalPrice)}를
                <br />
                결제하시겠습니까?
              </>
            }
            onConfirm={onConfirm}
            open={isModalVisible}
            setConfirmVisible={setIsModalVisible}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
