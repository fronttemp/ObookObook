import React, { useState, useEffect } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { ItemAllBuymAPI } from '../../api/productApi'
import { API_HEADER } from '../../api/usersApi'
import { Body } from 'node-fetch'
import Modal from 'antd/es/modal/Modal'

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState(null)
  const { loginToken } = useAccountTokenStore()

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await ItemAllBuymAPI(loginToken)
        setOrderHistory(response)

        // 응답에서 detailId를 가져와 상태에 저장합니다
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

    fetchOrderHistory()
  }, [loginToken]) // loginToken 값이 변경될 때마다 이 useEffect는 다시 실행됩니다.

  // 태욱

  // 구매시간 변경 함수
  const formatDateTime = dateTimeString => {
    const dateTime = new Date(dateTimeString)
    return dateTime.toLocaleString()
  }

  // 상세 보기시 모달 상태
  const [detailModal, setDetailMoadl] = useState(null)

  // 모달 확인 버튼 클릭 시
  const handleModalOk = () => {
    setDetailMoadl(false)
  }

  // detailId 상태
  const [detailId, setDetailId] = useState(null)

  // 상세 정보 보기 함수
  async function ItemBuyDetailmAPI() {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/detail',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          detailId: setDetailId()
        })
      }
    )
    if (res.ok) {
      setDetailMoadl(true)
      const json = await res.json().then()
      const accountNumber = json.account.accountNumber
      const bankCode = json.account.bankCode
      const bankName = json.account.bankName

      setBankInfo({
        accountNumber,
        bankCode,
        bankName
      })

      setDetailId(detailId)
    }
  }

  // bankInfo
  const [bankInfo, setBankInfo] = useState(false)

  // 거래 확정
  async function ItemConfirmAPI() {
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
    const data = await res.json()
    return data
  }

  return (
    <>
      <h1>주문내역 페이지</h1>
      {/* orderHistory는 response값 */}
      {orderHistory &&
        orderHistory.map((order, index) => {
          const parsedTitle = JSON.parse(order.product.title)

          return (
            // historyWrap
            <div className="historyWrap">
              <div key={order.detailId}>
                {/* 구매수 삭제 ? */}
                <h3>구매 정보: {index + 1}</h3>

                {parsedTitle.map((book, index) => (
                  <div key={index}>
                    <img
                      src={book.cover}
                      alt={book.title}
                    />
                    <h3>책 제목: {book.title}</h3>
                    <h4>책 가격: {book.priceSales}</h4>
                    <h5>내용: {book.description}</h5>
                  </div>
                ))}
                {/* 건당 구매시간으로 나누기 위해 빼둠 */}
                <h4>구매 시간: {formatDateTime(order.timePaid)}</h4>
                <button onClick={ItemBuyDetailmAPI}>구매 상세 정보</button>
                <button onClick={ItemConfirmAPI}>거래 확정</button>
                <hr />
                <br />
              </div>
            </div>
            // historyWrap
          )
        })}

      <Modal
        visible={detailModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>계좌번호: {bankInfo.accountNumber}</p>
        <p>은행코드: {bankInfo.bankCode}</p>
        <p>은행명: {bankInfo.bankName}</p>
      </Modal>
    </>
  )
}

export default OrderHistoryPage
