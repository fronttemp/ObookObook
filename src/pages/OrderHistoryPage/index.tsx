import React, { useState, useEffect } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { ItemAllBuymAPI } from '../../api/productApi'
import { API_HEADER } from '../../api/usersApi'
import { Modal, Button } from 'antd'

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

const OrderHistoryPage: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<Order[] | null>(null)
  const { loginToken } = useAccountTokenStore()

  // detailId 상태
  const [detailId, setDetailId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await ItemAllBuymAPI(loginToken)
        setOrderHistory(response)

        // 응답에서 detailId를 가져와 상태에 저장
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
  }, [loginToken, setDetailId])

  /////// 구매시간 변경 ///////
  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString)
    return dateTime.toLocaleString()
  }

  /////// 거래 상세 정보 ///////
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

  // bankInfo
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)

  /////// 주문 확정 ///////
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

  /////// 주문 취소 ///////
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

  /////// Modal 닫기 ///////
  const handleModalOk = () => {
    setDetailMoadl(false)
    setCancelModal(false)
    setConfirmModal(false)
  }

  return (
    <>
      <h1>주문내역 페이지</h1>
      {/* orderHistory는 response값 */}
      {orderHistory &&
      Array.isArray(orderHistory) &&
      orderHistory.length > 0 ? (
        orderHistory.map((order, index) => {
          const parsedTitle = JSON.parse(order.product.title)

          return (
            // historyWrap
            <div className="historyWrap">
              <div key={order.detailId}>
                {/* 구매수 삭제 ? */}
                <h3>주문번호: {index + 1}</h3>

                {parsedTitle.map((book, index) => (
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
                {/* 건당 구매시간으로 나누기 위해 빼둠 */}
                {/* <h4>구매 시간: {formatDateTime(order.timePaid)}</h4> */}
                <Button onClick={() => ItemBuyDetailmAPI(order.detailId)}>
                  상세 내역
                </Button>
                <Button onClick={() => handleConfirmModal(order.detailId)}>
                  주문 확정
                </Button>
                <Button onClick={() => handleCancelClick(order.detailId)}>
                  주문 취소
                </Button>
                <hr />
                <br />
              </div>
            </div>
            // historyWrap
          )
        })
      ) : (
        <h2>거래 내역이 존재하지 않습니다.</h2>
      )}

      {/* detail */}
      <Modal
        visible={detailModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p
          style={{
            fontSize: '30px',
            fontWeight: '500'
          }}>
          결제 정보
        </p>

        <p>거래 은행: {bankInfo?.bankName}</p>
        <p>계좌 정보: {bankInfo?.accountNumber}</p>
        <p>주문 금액: {bankInfo?.price}</p>
        <p>카테고리: {bankInfo?.genre}</p>
        <p>주문 일시: {formatDateTime(bankInfo?.time)}</p>
      </Modal>

      {/* cancel */}
      <Modal
        visible={cancelModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{cancelContent}</p>
      </Modal>

      {/* confirm */}
      <Modal
        visible={confirmModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{confirmContent}</p>
      </Modal>
    </>
  )
}

export default OrderHistoryPage
