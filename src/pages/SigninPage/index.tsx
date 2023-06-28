
import { API_HEADER } from '../../api/usersApi'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import useNickNameStore from '../../store/useNickNameStore'
import useUserImgStore from '../../store/useUserImgStore'

const SignInPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()


  // Token 관리
  const setLoginToken = useAccountTokenStore(state => state.setLoginToken)
  const setNickNameToken = useNickNameStore(state => state.setNickNameToken)
  const setUserImgToken = useUserImgStore(state => state.setUserImgToken)

  // 이메일, 비밀번호 입력 형식 체크 상태 (errorMessage)
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  // 형식 체크: 이메일 (@혹은.이 들어가있지 않으면 false)
  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    const regex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    if (regex.test(e.target.value)) {
      setEmailValid(true)
    } else setEmailValid(false)
  }
  // 형식 체크: 비밀번호 (8자 이하면 false)
  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    const regex =
      /^(?=.*[a-zA-Z])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\()\-=+])[a-zA-Z0-9$`~!@$!%*#^?&\\()\-=+]{8,}$/

    if (regex.test(e.target.value)) {
      setPasswordValid(true)
    } else setPasswordValid(false)
  }

  // SignInAPI
  const signIn = async e => {
    e.preventDefault()
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${localStorage.getItem('accountToken')}`
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )
    const json = await res.json()
    if (res.ok) {
      setLoginToken(json.accessToken)
      setNickNameToken(json.user.displayName)
      setUserImgToken(json.user.profileImg)
      console.log("json:", json)
      console.log('res:', res)
      navigate('/')
    } else {
      console.log(res.ok)
    }
  }

  useEffect(() => {
    if (emailValid && passwordValid) {
      setNowAllow(false)
    } else setNowAllow(true)
  }, [emailValid, passwordValid])

  // 로그인 인풋 확인 후 로그인 버튼 활성화 상태
  const [notAllow, setNowAllow] = useState(true)

  return (
    <section>
      {/* title  */}
      <h1>로그인 페이지</h1>
      <div className="titleWrap">
        아이디와 비밀번호를
        <br />
        입력해주세요.
      </div>

      {/* content */}
      <div className="contentWrap">
        <div>이메일 주소</div>
        <form onSubmit={signIn}>
          {/* 이메일 */}
          <div className="input-id">
            <input
              type="text"
              className="input"
              placeholder="아이디"
              value={email}
              onChange={checkEmail}
            />
            {!emailValid && email.length > 0 && (
              <div>올바른 이메일 형식을 입력해주세요 </div>
            )}
          </div>

          {/* 패스워드 */}
          <div>비밀번호</div>
          <div className="input-pw">

            <input
              className="input"
              placeholder="비밀번호"
              defaultValue={password}
              type="password"
              onChange={checkPassword}
            />
          </div>
          {/* 버튼 */}
          <div className="btn">
            <button
              className="login__btn"
              type="submit"
              disabled={notAllow}>
              로그인
            </button>
          </div>
          <hr />
          <div className="btn__toJoin">
            <Link to="/SignupPage">회원가입</Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SignInPage

