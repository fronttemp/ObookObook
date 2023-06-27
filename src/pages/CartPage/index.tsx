import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Space, Checkbox } from 'antd'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'

const CartPage = () => {
  const [selectAll, setSelectAll] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const { bookCart, removeBook, saveSelectedItems } = useCartStore()
  const navigate = useNavigate()

  const priceKr = price => {
    return <span>{`${price.toLocaleString('ko-KR')}원`}</span>
  }

  const handleSelect = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
      setSelectAll(false);
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
    const totalPrice = selectedItems.reduce((acc, id) => {
      const book = bookCart.find(book => book.id === id)
      const price = book.priceStandard
      return acc + price
    }, 0)
    setTotalPrice(totalPrice)
  }

  const handleRemoveBook = book => {
    removeBook(book)
  }
  
  const handleOrder = () => {
    saveSelectedItems(selectedItems)
      navigate('/Checkout')
  }

  useEffect(() => {
    setSelectedItems(bookCart.map(book => book.id));
  }, []);

  useEffect(() => {
    setSelectedItems(prevSelectedItems => {
      const updatedSelectedItems = prevSelectedItems.filter(id => bookCart.some(book => book.id === id));
      if (updatedSelectedItems.length !== prevSelectedItems.length) {
        setSelectAll(false);
      }
      return updatedSelectedItems;
    });
  }, [bookCart]);

  useEffect(() => {
    handleTotalPrice();
    if (selectedItems.length !== bookCart.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  }, [selectedItems]);

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
      width: '12%',
      align: 'right'
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
        <h1>{`장바구니(${selectedItems.length})`}</h1>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
      <div className="cart-sidebar">
        <div className="sidebar-content">
          <div className="total-price-container">
            <h2>결제 예정 금액</h2>
            <h2>{priceKr(totalPrice)}</h2>
          </div>
          <Button
            type="primary"
            size="large"
            style={{ width: '80%' }}
            onClick={handleOrder}>
            {`주문하기(${selectedItems.length})`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
