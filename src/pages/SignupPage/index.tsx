import { FormEvent, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { API_HEADER } from '../../api/usersApi'
import './Signup.css'
import Modal from 'antd/es/modal/Modal'

const SignUpPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [profileImg, setProfileImg] = useState<string>('')

  const navigate = useNavigate()

  // 토큰 관리
  const { setLoginToken, setNickNameToken, setUserImgToken } =
    useAccountTokenStore(state => ({
      setLoginToken: state.setLoginToken,
      setNickNameToken: state.setNickNameToken,
      setUserImgToken: state.setUserImgToken
    }))

  // signUpAPI
  async function signUp(e: FormEvent): Promise<void> {
    e.preventDefault()
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup',
      {
        method: 'POST',
        headers: API_HEADER,
        body: JSON.stringify({
          email,
          password,
          displayName,
          profileImgBase64: profileImg // 회원가입 이미지
        })
      }
    )
    const json = await res.json()
    if (res.ok) {
      setLoginToken(json.accessToken)
      setNickNameToken(json.user.displayName)
      setUserImgToken(json.user.profileImg)
      navigate('/SigninPage')
    } else {
      setSuccessModalVisible(true)
    }
  }

  // 회원가입 이미지 전송
  function uploadImage(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files as FileList
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', e => {
        setProfileImg((e.target as FileReader).result as string)
      })
    }
  }

  // 이메일, 비밀번호 형식 체크
  const [passwordLength, setPasswordLength] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  //이메일 체크
  function handleEmailCheck(e: ChangeEvent<HTMLInputElement>): void {
    const newEmail = e.target.value
    setEmail(newEmail)

    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setEmailError('이메일 형식을 확인해주세요.')
    } else {
      setEmailError('')
    }
  }

  // 비밀번호 체크
  function handlePasswordLength(e: ChangeEvent<HTMLInputElement>): void {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (newPassword.length < 8) {
      setPasswordLength('비밀번호는 최소 8자 이상이어야 합니다.')
    } else {
      setPasswordLength('')
    }
  }

  // 모달 관리 이메일
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  // 모달 확인 버튼 클릭 시
  const handleModalOk = () => {
    setSuccessModalVisible(false)
  }

  return (
    <div className="signPage">
      <h1>회원가입 페이지</h1>

      <form onSubmit={signUp}>
        <div className="inputWrap">
          <div className="input-id">이메일</div>
          <input
            value={email}
            onChange={handleEmailCheck}
            placeholder="[필수] 이메일"
          />
          {emailError && (
            <div style={{ color: 'red' }}>{emailError}</div>
          )}

          <div className="input-pw">비밀번호</div>
          <input
            value={password}
            onChange={handlePasswordLength}
            placeholder="[필수] 비밀번호"
            type="password"
          />
          {passwordLength && (
            <div style={{ color: 'red' }}>{passwordLength}</div>
          )}

          <div className="input-name">닉네임</div>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="[필수] 닉네임"
          />
          <div className="input-img">프로필 이미지</div>
          <input
            type="file"
            onChange={uploadImage}
          />
          <button
            type="submit"
            style={{
              cursor: 'pointer'
            }}>
            회원가입
          </button>
        </div>
      </form>

      {email.length <= 0 || password.length <= 0 || displayName.length <= 0 ? (
        <Modal
          visible={successModalVisible}
          closable={false}
          onOk={handleModalOk}
          okText="확인"
          cancelButtonProps={{ style: { display: 'none' } }}>
          <p
            style={{
              color: 'red'
            }}>
            필수 입력정보를 확인해주세요.
          </p>
        </Modal>
      ) : (
        <Modal
          visible={successModalVisible}
          closable={false}
          onOk={handleModalOk}
          okText="확인"
          cancelButtonProps={{ style: { display: 'none' } }}>
          <p>이미 가입된 이메일입니다.</p>
        </Modal>
      )}
    </div>
  )
}

export default SignUpPage
