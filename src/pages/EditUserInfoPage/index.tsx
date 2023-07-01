import { useState, FormEvent, ChangeEvent } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { API_HEADER } from '../../api/usersApi'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Modal } from 'antd'

interface UserData {
  oldPassword: string
  newPassword: string
  profileImage: string
  nickname: string
}

const EditUserInfoPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { loginToken, setIsLoggedOut } = useAccountTokenStore(state => ({
    loginToken: state.loginToken,
    setIsLoggedOut: state.setIsLoggedOut
  }))

  const [error, setError] = useState<string>('')
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)

  const handleModifyUserInfo = async (values: UserData) => {
    try {
      const { oldPassword, newPassword, profileImage, nickname } = values
      if (newPassword !== values.confirmPassword) {
        setError('변경할 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
        return
      }

      const userData: UserData = {
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
        setSuccessModalVisible(true)
        setError('')

        setTimeout(() => {
          setIsLoggedOut()
        }, 2000)
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

  // 프로필 이미지, 닉네임 컴포넌트 아래로 복사
  const { nickNameToken, userImgToken, setNickNameToken, setUserImgToken } =
    useAccountTokenStore(state => state)

  // 닉네임 변경
  const [newNickName, setNewNickName] = useState<string>('')

  async function modifyUserName(e: FormEvent) {
    e.preventDefault()

    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
      {
        method: 'PUT',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          displayName: newNickName
        })
      }
    )
    if (res.ok) {
      setNickNameToken(newNickName)
    }
  }

  function handleNickNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNewNickName(e.target.value)
  }

  // 프로필 변경
  const [newUserImg, setNewUserImg] = useState<string>('')

  async function modifyUserImg(e: FormEvent) {
    e.preventDefault()

    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
      {
        method: 'PUT',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          profileImgBase64: newUserImg
        })
      }
    )
    if (res.ok) {
      if (newUserImg === '') {
        setUserImgToken('/user.png')
      } else {
        setUserImgToken(newUserImg)
      }
    }
  }

  // 프로필 이미지 업로드
  function uploadImage(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files as FileList
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', e => {
        setNewUserImg(e.target?.result as string)
      })
    }
  }

  return (
    <div className="modifyUserInfo">
      <h2>회원 정보 수정</h2>

      <section className="myProfile">
        {/* 프로필 사진 변경 */}
        <form onSubmit={modifyUserImg}>
          <img
            className="userImg"
            src={userImgToken || newUserImg} // false면 userImgToken(현재), true면 newUserImg(변경할 이미지)
            alt="User Profile"
          />
          <div className="current-userName">{nickNameToken}</div>
          <div className="imgInputWrap">
            <input
              className="userImg-input"
              type="file"
              onChange={uploadImage}
            />
            <button
              className="userImg-btn"
              type="submit">
              프로필 사진 변경
            </button>
          </div>
        </form>
        {/* 닉네임 변경 */}
        <form
          className="userNameWrap"
          onSubmit={modifyUserName}>
          <input
            type="text"
            value={newNickName}
            onChange={handleNickNameChange}
            placeholder="새로운 닉네임을 입력하세요"
          />
          <button type="submit">닉네임 변경</button>
        </form>
      </section>

      <br />
      <hr />
      <br />

      <section className="myProfile-img-name">
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
            visible={successModalVisible}
            closable={false}
            onOk={handleModalOk}
            okText="확인"
            cancelButtonProps={{ style: { display: 'none' } }}>
            <p>비밀번호가 성공적으로 변경되었습니다.</p>
          </Modal>
        </Form>
      </section>
    </div>
  )
}

export default EditUserInfoPage
