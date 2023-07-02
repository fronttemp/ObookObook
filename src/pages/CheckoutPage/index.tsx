import { useEffect, useState, ReactNode } from 'react'
import { Button, Card, Radio, Row, Col, Grid } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'
import { accountCheckAPI } from '../../api/accountApi'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import ConfirmModal from '../../components/ConfirmModal'
import { ItemAddAPI, ItemBuyAPI } from '../../api/productApi'

const { useBreakpoint } = Grid

type BankAccount = {
  id: string
  bankName: string
  bankCode: string
  accountNumber: string
  balance: number
}

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState(0)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const { selectedItems, removeSelectedBooks } = useCartStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPaymentSuccessModalVisible, setIsPaymentSuccessModalVisible] =
    useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | undefined>()
  const navigate = useNavigate()
  const screen = useBreakpoint()
  const { loginToken } = useAccountTokenStore()

  const priceKr = (price: number) => {
    return `${price.toLocaleString('ko-KR')} 원`
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
        setSelectedAccountId(data.accounts[0].id)
      }
    } catch (error) {
      console.error('Fetching bank accounts failed:', error)
    }
  }

  const handleBankAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId)
  }
  console.log('Selected bank account:', selectedAccountId)

  useEffect(() => {
    handleTotalPrice()
    fetchBankAccounts()
  }, [selectedItems])

  const handlePayment = () => {
    if (selectedAccountId === '') {
      setModalContent('결제수단을 선택해주세요')
      setIsModalVisible(true)
    } else {
      // 실제 결제 로직을 여기에 추가해주세요.
      console.log('Payment initiated')
      setModalContent(
        <>
          총 {selectedItems.length}개의 상품, {priceKr(totalPrice)}을
          <br />
          결제하시겠습니까?
        </>
      )
      setIsModalVisible(true)
    }
  }

  const handleBankAccounts = async () => {
    navigate('/Account/EditBankInfo')
  }

  const onConfirm = async (confirm: boolean) => {
    setIsModalVisible(false)
    if (confirm) {
      const title = JSON.stringify(selectedItems)
      console.log(selectedItems)
      try {
        const description = 'ebook'
        const price = totalPrice

        const responseAddProduct = await ItemAddAPI(title, price, description)
        const productId = responseAddProduct.id

        const response = await ItemBuyAPI(
          loginToken,
          productId,
          selectedAccountId
        )
        if (response === true) {
          console.log('Payment successful')

          const selectedIds = selectedItems.map(item => item.id)
          removeSelectedBooks(selectedIds)

          setModalContent(
            <>
              결제가 정상 처리 되었습니다.
              <br /> 주문내역 페이지로 이동합니다.
            </>
          )
          setIsPaymentSuccessModalVisible(true)
        } else {
          console.log('Payment failed1:', response)
        }
      } catch (error) {
        console.error('Payment failed2:', error)
      }
    }
  }

  const onPaymentSuccessConfirm = (confirm: boolean) => {
    setIsPaymentSuccessModalVisible(false)
    if (confirm) {
      navigate('/Account/OrderHistory')
    }
  }

  return (
    <section className="checkout-page">
      <div className="left-section">
        <div className="page_title">결제</div>
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
                <div className="item-decs">
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{ height: '120px', width: '80px' }}
                  />
                  <div className="item-title">
                    {book.title.length > 7
                      ? book.title.slice(0, 6) + '...'
                      : book.title}
                  </div>
                  <div>{priceKr(book.priceStandard)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card
          className="left-section__payment"
          title="결제 수단">
          <div className="bank-account-list">
            <div className="payment-selection">
              <p>오북페이</p>
              <Button
                type="primary"
                size="small"
                onClick={handleBankAccounts}>
                계좌설정
              </Button>
            </div>
            {bankAccounts.length > 0 ? (
              <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                {bankAccounts.map(account => (
                  <Col
                    key={account.id}
                    span={12}>
                    <Radio
                      value={account.id}
                      checked={selectedAccountId === account.id}
                      onChange={e => handleBankAccountSelect(e.target.value)}>
                      <div>
                        <p>{`${account.bankName} ${account.accountNumber}`}</p>
                      </div>
                    </Radio>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className='noResult'>
                사용 가능한 은행 계좌가 없습니다. 계좌설정에서 계좌를
                연결해주세요.
              </div>
            )}
          </div>
        </Card>
      </div>
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="total-price-container">
            <div className="total-price-title">최종 결제 금액</div>
            <div className="total-price">{priceKr(totalPrice)}</div>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}>
            결제하기
          </Button>
          <ConfirmModal
            content={modalContent}
            onConfirm={onConfirm}
            open={isModalVisible}
            setConfirmVisible={setIsModalVisible}
          />
          <ConfirmModal
            content={modalContent}
            onConfirm={onConfirm}
            open={isModalVisible}
            setConfirmVisible={setIsModalVisible}
          />
          <ConfirmModal
            content={modalContent}
            onConfirm={onPaymentSuccessConfirm}
            open={isPaymentSuccessModalVisible}
            setConfirmVisible={setIsPaymentSuccessModalVisible}
            showCancelButton={false}
          />
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage
