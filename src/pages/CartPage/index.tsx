import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Space, Checkbox } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import "./CartPage.css"

const CartPage = () => {
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const { bookCart, removeBook } = useCartStore()

  const handleSelect = (itemKey, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemKey])
    } else {
      setSelectedItems(prev => prev.filter(key => key !== itemKey))
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(bookCart.map((_, index) => index))
    }
    setSelectAll(!selectAll)
  }

  const dataSource = bookCart.map((book, index) => ({
    key: index,
    name: book.title,
    cover: (
      <img
        src={book.cover}
        alt={book.title}
        style={{ width: '50px' }}
      />
    ),
    price: book.priceStandard,
    action: <Button onClick={() => removeBook(book)}>삭제</Button>,
    select: (
      <Checkbox
        checked={selectedItems.includes(index)}
        onChange={e => handleSelect(index, e.target.checked)}
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
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action'
    }
  ]

  return (
    <div className="cart-page">
      <div className="cart-content">
        <h1>장바구니</h1>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
      <div className="cart-sidebar">
        <div className="sidebar-content">
          <h2>결제 금액</h2>
          <p>{/* TODO: 결제 금액 계산 */}</p>
          <Button
            type="primary"
            size="large"
            style={{ width: '80%' }}>
            주문하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
