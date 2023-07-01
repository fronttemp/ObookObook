import React, { useState, useEffect } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { ItemAllBuymAPI } from '../../api/productApi' 

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([])
  const { loginToken } = useAccountTokenStore()

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await ItemAllBuymAPI(loginToken)
        console.log("response!!! : ", response)
        setOrderHistory(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrderHistory()
  }, [loginToken])  // loginToken 값이 변경될 때마다 이 useEffect는 다시 실행됩니다.

  const formatDateTime = dateTimeString => {
    const dateTime = new Date(dateTimeString)
    return dateTime.toLocaleString()
  }

  return (
    <>
      <h2>주문내역</h2>
      {orderHistory && orderHistory.map((order, index) => {
        const parsedTitle = JSON.parse(order.product.title);
        return (
          <div key={order.detailId}>
            <p>{formatDateTime(order.timePaid)}</p>
            <p>Price: {order.product.price}</p>
            <p>Description: {order.product.description}</p>
            {/* 추가적으로 더 많은 정보를 출력하고 싶다면 여기에 코드를 추가하세요 */}
            {parsedTitle.map((book, index) => (
              <div key={index}>
                <img src={book.cover} alt={book.title} />
                <h3>{book.title}</h3>
                <p>결제금액 : {book.priceSales}</p>
              </div>
            ))}
          </div>
        );
      })}
    </>
  )
}

export default OrderHistoryPage
