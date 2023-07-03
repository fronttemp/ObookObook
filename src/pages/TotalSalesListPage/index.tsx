import { useEffect, useState } from 'react'
import { ItemAllSellCheckAPI, ItemSellCheckAPI } from '../../api/productApi'
import { Button, Table, Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface User {
  email: string
  displayName: string
}

interface Account {
  bankName: string
  accountNumber: string
}

interface Product {
  description: string
  title: string
  price: number
}

interface ItemSell {
  detailId: string
  product: Product
  account: Account
  orderStatus: string
  user: User
  timePaid: string
  done: boolean
  isCanceled: boolean
}

const TotalSalesListPage = () => {
  const [itemSellList, setItemSellList] = useState<ItemSell[]>([])
  const [confirmContent, setConfirmContent] = useState<string>('')
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [cancelContent, setCancelContent] = useState<string>('')
  const [cancelModal, setCancelModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 50 }}
      spin
    />
  )

  useEffect(() => {
    const fetchItemSellList = async () => {
      try {
        setLoading(true)
        const response = await ItemAllSellCheckAPI()

        // 정렬 코드 추가
        response.sort((a: ItemSell, b: ItemSell) => {
          const dateA = new Date(a.timePaid)
          const dateB = new Date(b.timePaid)

          // 최신거래를 먼저 보여주기 위해 b - a 순서로 비교
          return dateB.getTime() - dateA.getTime()
        })

        setItemSellList(response)
        setLoading(false)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchItemSellList()
  }, [])

  const handleSellConfirm = async (detailId: string) => {
    try {
      const response = await ItemSellCheckAPI(detailId, false, true)
      if (response) {
        setConfirmContent('판매가 확정되었습니다.')
        setConfirmModal(true)
      } else {
        setConfirmContent('이미 판매가 확정되었거나, 취소된 상품입니다.')
        setConfirmModal(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSellCancel = async (detailId: string) => {
    try {
      const response = await ItemSellCheckAPI(detailId, true, false)
      if (response) {
        setCancelContent('판매 취소가 완료되었습니다.')
        setCancelModal(true)
      } else {
        setCancelContent(
          '이미 주문 취소가 완료되었거나, 구매가 확정된 상품입니다.'
        )
        setCancelModal(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleModalOk = () => {
    setCancelModal(false)
    setConfirmModal(false)
  }

  const priceKr = (price: number) => {
    return <span>{`${price.toLocaleString('ko-KR')} 원`}</span>
  }

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n) + '...' : str
  }

  const formatProductTitle = (title: string) => {
    const books = JSON.parse(title)

    // Here we are using the truncate function
    const truncatedTitle = truncate(books[0].title, 35)

    if (books.length === 1) return truncatedTitle

    return `${truncatedTitle} 등 총 ${books.length}권`
  }
  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString)

    // 년, 월, 일, 시간, 분을 각각 추출
    const year = dateTime.getFullYear().toString().slice(-2)
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0')
    const date = dateTime.getDate().toString().padStart(2, '0')
    const hour = dateTime.getHours()
    const min = dateTime.getMinutes().toString().padStart(2, '0')

    // 12시간 형식으로 변경
    const hour12 = hour % 12 || 12
    const ampm = hour < 12 ? '오전' : '오후'

    return `${year}.${month}.${date}<br/>${ampm} ${hour12}:${min}`
  }

  const itemDataSource = itemSellList.map((order, index) => ({
    key: (
      <div>
        <p className="listNumber">{index + 1}</p>
      </div>
    ),
    timePaid: formatDateTime(order.timePaid),
    itemName: formatProductTitle(order.product.title),
    price: priceKr(order.product.price),
    sellerInfo: (
      <div>
        <div>{order.user.email}</div>
        <div>{order.user.displayName}</div>
        <div>{order.account.bankName}</div>
        <div>{order.account.accountNumber}</div>
      </div>
    ),
    action: (
      <div className="sellListFeat">
        <Button
          size={'small'}
          onClick={() => handleSellCancel(order.detailId)}>
          판매 취소
        </Button>
        <Button
          size={'small'}
          onClick={() => handleSellConfirm(order.detailId)}>
          판매 확정
        </Button>
        <div className={order.done === true ? 'done' : 'disable'}>
          확정되었습니다.
        </div>
        <div className={order.isCanceled === true ? 'isCanceled' : 'disable'}>
          취소되었습니다.
        </div>
      </div>
    )
  }))

  const itemColumns = [
    {
      title: '번호',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '거래일시',
      dataIndex: 'timePaid',
      key: 'timePaid',
      width: '100px',
      align: 'center' as const,
      render: (timePaid: string) => (
        <div dangerouslySetInnerHTML={{ __html: timePaid }} />
      )
    },
    {
      title: '판매상품',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'center' as const
    },
    {
      title: '결제금액',
      dataIndex: 'price',
      key: 'price',
      width: '100px',
      align: 'center' as const
    },
    {
      title: '판매자 정보',
      dataIndex: 'sellerInfo',
      key: 'sellerInfo',
      align: 'center' as const
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const
    }
  ]

  return (
    <div>
      <div id="sell-list">
        <div className="page_title">판매 내역</div>
        {loading ? (
          <div className="loadingAnimation">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <Table
            dataSource={itemDataSource}
            columns={itemColumns}
            pagination={false}
          />
        )}
      </div>
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

export default TotalSalesListPage
