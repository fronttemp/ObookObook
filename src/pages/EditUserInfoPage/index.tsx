import { useState } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { API_HEADER } from '../../api/usersApi'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Modal } from 'antd'

const EditUserInfoPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { loginToken } = useAccountTokenStore(state => ({
    loginToken: state.loginToken
  }))
  const setIsLoggedOut = useAccountTokenStore(state => state.setIsLoggedOut)

  const [error, setError] = useState('')
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const handleModifyUserInfo = async values => {
    try {
      const { oldPassword, newPassword, profileImage, nickname } = values

      if (newPassword !== values.confirmPassword) {
        setError('새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
        return
      }

      const userData = {
        oldPassword,
        newPassword,
        profileImage,
        nickname
      }

      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
        {
          method: 'PUT',
          headers: {
            ...API_HEADER,
            Authorization: `Bearer ${loginToken}`
          },
          body: JSON.stringify(userData)
        }
      )

      if (res.ok) {
        form.resetFields()
        setError('')
        setSuccessModalVisible(true)
        setIsLoggedOut()
      } else {
        const { message } = await res.json()
        setError(message)
      }
    } catch (error) {
      setError('오류가 발생했습니다.')
    }
  }

  // 모달 관리
  const handleModalOk = () => {
    setSuccessModalVisible(false)
    navigate('/')
  }

  return (
    <div className="modifyUserInfo">
      <h2>회원 정보 수정</h2>

      <Form
        form={form}
        onFinish={handleModifyUserInfo}
        className="input">
        <Form.Item
          name="oldPassword"
          label="현재 비밀번호"
          rules={[
            { required: true, message: '현재 비밀번호를 입력해주세요.' }
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="변경할 비밀번호"
          rules={[
            { required: true, message: '변경할 비밀번호를 입력해주세요.' }
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="확인 비밀번호"
          rules={[
            { required: true, message: '확인 비밀번호를 입력해주세요.' }
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit">
            비밀번호 변경
          </Button>
        </Form.Item>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <Modal
          title="비밀번호 변경 성공"
          open={successModalVisible}
          closable={false}
          onOk={handleModalOk}
          okText="확인"
          cancelButtonProps={{ style: { display: 'none' } }}>
          <p>비밀번호가 성공적으로 변경되었습니다.</p>
        </Modal>
      </Form>
    </div>
  )
}

export default EditUserInfoPage
