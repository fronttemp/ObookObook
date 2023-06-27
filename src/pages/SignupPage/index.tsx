// 회원가입 페이지
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import useNickNameStore from '../../store/useNickNameStore'
import { API_HEADER } from '../../api/usersApi'
import useUserImgStore from '../../store/useUserImgStore'

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [profileImg, setprofileImg] = useState('')

  const navigate = useNavigate()

  // 토큰 관리
  const setLoginToken = useAccountTokenStore(state => state.setLoginToken)
  const setNickNameToken = useNickNameStore(state => state.setNickNameToken)
  const setUserImgToken = useUserImgStore(state => state.setUserImgToken)

  // signUpAPI
  async function signUp(e: FormEvent) {
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
  function uploadImage(e) {
    const files = (e.target as HTMLInputElement).files as FileList
    for (const file of files) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', e => {
        setprofileImg((e.target as FileReader).result as string)
      })
    }
  }

  // 비밀번호 길이 제한 메세지
  const [passwordLengh, setPasswordLengh] = useState('')

  function handlePasswordLenth(e) {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (newPassword.length < 8) {
      setPasswordLengh('비밀번호는 최소 8자 이상이어야 합니다.')
    } else {
      setPasswordLengh('')
    }
  }

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <form onSubmit={signUp}>
        <div>이메일</div>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <div>비밀번호</div>
        <input
          value={password}
          onChange={handlePasswordLenth}
          placeholder="비밀번호"
          type="password"
        />
        {passwordLengh && <div style={{ color: 'red' }}>{passwordLengh}</div>}
        <div>닉네임</div>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="닉네임"
        />
        <div>프로필 이미지</div>
        <input
          type="file"
          onChange={uploadImage}
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default SignUpPage
