import React, { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from './ConfirmModal'
import { logCheckAPI } from '../api/usersApi'

const AddBookPurchase = props => {
  const { selectSingleBook } = useCartStore()
  const navigate = useNavigate()

  const [isSignInRedirectModalVisible, setIsSignInRedirectModalVisible] = useState(false)

  const handleOneClickOrder = async (book) => {
    const loginToken = JSON.parse(localStorage.getItem('accountToken')).state.loginToken;

    if (!loginToken) {
      setIsSignInRedirectModalVisible(true)
      return
    }

    try {
      const userInfo = await logCheckAPI(loginToken)
      if (userInfo.error) {
        setIsSignInRedirectModalVisible(true)
        return
      }

      selectSingleBook(book)
      navigate('/checkout')
    } catch (error) {
      console.error(error)
      setIsSignInRedirectModalVisible(true)
    }
  }

  return (
    <>
      <Button 
      type="primary"
      onClick={() => handleOneClickOrder(props.book)}>즉시 구매</Button>
      <ConfirmModal
        content="로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        onConfirm={() => navigate('/signInPage')}
        open={isSignInRedirectModalVisible}
        setConfirmVisible={setIsSignInRedirectModalVisible}
      />
    </>
  )
}

export default AddBookPurchase
