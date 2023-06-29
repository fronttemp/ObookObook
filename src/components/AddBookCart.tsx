import React, { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from './ConfirmModal'

const AddBookCart = props => {
  const { bookCart, addBookCart } = useCartStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [showCancel, setShowCancel] = useState(true)
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (
      bookCart.some(
        b => b.title === props.book.title && b.isbn === props.book.isbn
      )
    ) {
      setModalContent('이미 장바구니에 등록된 상품입니다.')
      setShowCancel(false)
      setIsModalVisible(true)
    } else {
      await addBookCart(props.book)
      setModalContent(
        '상품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?'
      )
      setShowCancel(true)
      setIsModalVisible(true)
    }
  }

  const onConfirm = confirm => {
    setIsModalVisible(false)
    if (confirm && modalContent !== '이미 장바구니에 등록된 상품입니다.') {
      navigate('/Cart')
    }
  }

  return (
    <div>
      <Button onClick={handleAddToCart}>장바구니 추가</Button>
      <ConfirmModal
        content={modalContent}
        onConfirm={onConfirm}
        open={isModalVisible}
        setConfirmVisible={setIsModalVisible}
        showCancelButton={showCancel}
      />
    </div>
  )
}

export default AddBookCart
