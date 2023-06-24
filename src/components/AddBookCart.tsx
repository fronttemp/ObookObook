import React, { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

const AddBookCart = props => {
  const { bookCart, addBookCart } = useCartStore()
  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (
      bookCart.some(
        b => b.title === props.book.title && b.isbn === props.book.isbn
      )
    ) {
      setVisible(true)
    } else {
      await addBookCart(props.book)
      setConfirmVisible(true)
      console.log(props.book)
    }
  }

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setConfirmVisible(false)
  }

  const handleConfirm = () => {
    navigate('/Cart')
  }

  return (
    <div>
      <Button onClick={handleAddToCart}>장바구니 추가</Button>
      <Modal
        open={visible}
        onOk={handleOk}
        onCancel={handleOk}
        closable={false}
        centered
        bodyStyle={{ textAlign: 'center' }}
        width={350}
        footer={[
          <Button
            key="ok"
            type="primary"
            style={{ margin: '0 auto' }}
            onClick={handleOk}>
            확인
          </Button>
        ]}>
        <p>
          <b>이미 장바구니에 등록된 상품입니다.</b>
        </p>
      </Modal>
      <Modal
        open={confirmVisible}
        centered
        bodyStyle={{ textAlign: 'center' }}
        onOk={handleConfirm}
        onCancel={handleCancel}
        closable={false}
        width={280}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              key="cancel"
              onClick={handleCancel}
              style={{ marginRight: '0.5em' }}>
              취소
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleConfirm}
              style={{ marginLeft: '0.5em' }}>
              확인
            </Button>
          </div>
        }>
        <p>
          <b>
            상품이 장바구니에 담겼습니다.
            <br />
            장바구니로 이동하시겠습니까?
          </b>
        </p>
      </Modal>
    </div>
  )
}

export default AddBookCart
