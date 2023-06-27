import { useEffect, useState } from 'react'
import { Button, Card, Radio, Grid } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'
import './CheckoutPage.css'

const { useBreakpoint } = Grid

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState(0)
  const { selectedItems } = useCartStore()
  const navigate = useNavigate()
  const screen = useBreakpoint()

  const priceKr = price => {
    return <span>{`${price.toLocaleString('ko-KR')}원`}</span>
  }

  const handleTotalPrice = () => {
    const totalPrice = selectedItems.reduce((acc, book) => {
      const price = book.priceStandard
      return acc + price
    }, 0)
    setTotalPrice(totalPrice)
  }

  useEffect(() => {
    handleTotalPrice()
  }, [selectedItems])

  console.log('cart-selectedItems: ', selectedItems)

  return (
    <div className="checkout-page">
      <div className="left-section">
        <h1>{`주문/결제`}</h1>
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
            <Radio.Group>
              <Radio value={1}>오북페이</Radio>
              <Radio value={2}>일반결제</Radio>
            </Radio.Group>
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
            style={{ width: '80%' }}>
            결제하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
