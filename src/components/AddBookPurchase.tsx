import React, { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const AddBookPurchase = props => {
  const { selectSingleBook } = useCartStore()
  const navigate = useNavigate()

  const handleOneClickOrder = (book) => {
    selectSingleBook(book);
    navigate('/Checkout');
  };

  return (
    <Button onClick={() => {
      handleOneClickOrder(props.book)
    }}> 즉시 구매 </Button>
  )
}

export default AddBookPurchase
