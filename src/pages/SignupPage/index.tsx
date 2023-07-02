import { FormEvent, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { API_HEADER } from '../../api/usersApi'
import Modal from 'antd/es/modal/Modal'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const SignupPage = (): JSX.Element => {
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
  // function uploadImage(e: ChangeEvent<HTMLInputElement>): void {
  //   const files = e.target.files as FileList
  //   for (const file of Array.from(files)) {
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.addEventListener('load', e => {
  //       setProfileImg((e.target as FileReader).result as string)
  //     })
  //   }
  // }

  // 이미지 클 경우
  function uploadImage(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files as FileList
    const file = files[0]
    const maxSize = 1024 * 1024 // 1MB

    if (file.size > maxSize) {
      // alert('img 용량이 큼')
      setImgModalVisible(true)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', e => {
      setProfileImg(e.target?.result as string)
    })
  }

  // 이메일, 비밀번호 형식 체크
  const [passwordLength, setPasswordLength] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  //이메일 체크
  function handleEmailCheck(e: ChangeEvent<HTMLInputElement>): void {
    const newEmail = e.target.value
    setEmail(newEmail)

    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setEmailError(` 올바른 이메일 형식을 입력해 주세요.`)
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
  // 모달 관리 이미지 크기
  const [imgModalVisible, setImgModalVisible] = useState(false)

  // 모달 확인 버튼 클릭 시
  const handleModalOk = () => {
    setSuccessModalVisible(false)
    setImgModalVisible(false)
  }

  return (
    <section>
      <div className="contentWrap">
        <div className="page_title">회원가입</div>
        <form onSubmit={signUp}>
          <div className="signup-inputBox">
            <div className="input-title">이메일</div>
            <input
              className="signup-input"
              value={email}
              onChange={handleEmailCheck}
              placeholder="(필수) 이메일을 입력해주세요."
            />
            {emailError && (
              <div className="valid_desc">
                <InfoCircleOutlined className="valid__icon" />
                {emailError}
              </div>
            )}

            <div className="input-title">비밀번호</div>
            <input
              className="signup-input"
              value={password}
              onChange={handlePasswordLength}
              placeholder="(필수) 비밀번호를 입력해 주세요."
              type="password"
            />
            {passwordLength && (
              <div className="valid_desc">
                <InfoCircleOutlined className="valid__icon" />
                {passwordLength}
              </div>
            )}

            <div className="input-title">닉네임</div>
            <input
              className="signup-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="(필수) 닉네임을 입력해 주세요."
            />
            <div className="input-title">프로필 이미지</div>
            <input
              className="imginput"
              type="file"
              onChange={uploadImage}
            />
          </div>
          <div className="sign-btn">
            <Button
              type="primary"
              htmlType='submit'>
              회원가입
            </Button>
          </div>
        </form>

        {email.length <= 0 ||
        password.length <= 0 ||
        displayName.length <= 0 ? (
          <Modal
            open={successModalVisible}
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
            open={successModalVisible}
            closable={false}
            onOk={handleModalOk}
            okText="확인"
            cancelButtonProps={{ style: { display: 'none' } }}>
            <p>이미 가입된 이메일입니다.</p>
          </Modal>
        )}
      </div>

      <Modal
        open={imgModalVisible}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>
          프로필 이미지 크기는 1MB 이하여야 합니다.
          <br />
          이미지를 변경해주세요.
        </p>
      </Modal>
    </section>
  )
}

export default SignupPage
