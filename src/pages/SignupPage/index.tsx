import { FormEvent, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import useNickNameStore from '../../store/useNickNameStore'
import { API_HEADER } from '../../api/usersApi'
import useUserImgStore from '../../store/useUserImgStore'
import './Signup.css'

const SignUpPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [profileImg, setProfileImg] = useState<string>('')

  const navigate = useNavigate()

  // 토큰 관리
  const setLoginToken = useAccountTokenStore(state => state.setLoginToken)
  const setNickNameToken = useNickNameStore(state => state.setNickNameToken)
  const setUserImgToken = useUserImgStore(state => state.setUserImgToken)

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
    setLoginToken(json.accessToken)
    setNickNameToken(json.user.displayName)
    setUserImgToken(json.user.profileImg)
    navigate('/SigninPage')
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

  // 비밀번호 길이 제한 메세지
  const [passwordLength, setPasswordLength] = useState<string>('')

  function handlePasswordLength(e: ChangeEvent<HTMLInputElement>): void {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (newPassword.length < 8) {
      setPasswordLength('비밀번호는 최소 8자 이상이어야 합니다.')
    } else {
      setPasswordLength('')
    }
  }

  return (
    <div className="signPage">
      <h1>회원가입 페이지</h1>

      <form onSubmit={signUp}>
        <div className="inputWrap">
          <div className="input-id">이메일</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일"
          />
          <div className="input-pw">비밀번호</div>
          <input
            value={password}
            onChange={handlePasswordLength}
            placeholder="비밀번호"
            type="password"
          />
          {passwordLength && (
            <div style={{ color: 'red' }}>{passwordLength}</div>
          )}
          <div className="input-name">닉네임</div>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="닉네임"
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
    </div>
  )
}

export default SignUpPage
