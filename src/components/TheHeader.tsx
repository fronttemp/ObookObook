import { useEffect, useState } from 'react'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Badge, Modal } from 'antd'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import useAccountTokenStore from '../store/useAccountTokenStore'
import { API_HEADER } from '../api/usersApi'



const TheHeader = (): JSX.Element => {
  const navigate = useNavigate()
  const { bookCart } = useCartStore()
  const { Search } = Input

  const onSearch = (value: string) => {
    if (value.trim() !== '') {
      navigate(`/search?q=${value.trim()}`)
    } else {
      navigate(`/`)
    }
  }

  // 로그인 상태에 따라 헤더 변경 및 로그아웃 시 로컬스토리지 정보제거
  const {
    loginToken,
    setIsLoggedOut,
    removeNickNameToken,
    removeUserImgToken,
    nickNameToken,
    userImgToken
  } = useAccountTokenStore(state => ({
    loginToken: state.loginToken,
    setIsLoggedOut: state.setIsLoggedOut,
    removeNickNameToken: state.removeNickNameToken,
    removeUserImgToken: state.removeUserImgToken,
    nickNameToken: state.nickNameToken,
    userImgToken: state.userImgToken
  }))

  // signOutAPI
  const handleLogout = async () => {
    await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout',
      {
        method: 'POST',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        }
      }
    )
    setIsLoggedOut()
    removeNickNameToken()
    removeUserImgToken()
    navigate('/')
  }

  // 로그인 상태에 따른 페이지 접근기능
  const location = useLocation()

  useEffect(() => {
    if (
      loginToken &&
      (location.pathname === '/SigninPage' ||
        location.pathname === '/SignupPage')
    ) {
      navigate('/')
    }
    if (!loginToken && location.pathname === '/Account/EditUserInfo') {
      navigate('/SigninPage')
    }
  }, [loginToken, navigate, location.pathname])

  // 비회원 Account페이지 진입시 모달 처리
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const handleModalOk = () => {
    loginToken ? setSuccessModalVisible(false) : setSuccessModalVisible(true)
  }

  const handleModalClose = () => {
    setSuccessModalVisible(false)
  }

  return (
    <header>
      {loginToken ? (
        <div className="login-nav">
          <span>{nickNameToken}님, 환영합니다!</span>
          <button
            style={{
              cursor: 'pointer'
            }}
            onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <div className="login-nav">
          <NavLink to="/SigninPage">로그인</NavLink>
          <NavLink to="/SignupPage">회원가입</NavLink>
        </div>
      )}

      <nav>
        <div className="nav-menu">
          <NavLink
            to="/"
            className="logo">
            <img
              src="/logo.png"
              alt="logo"
            />
          </NavLink>
          <ul className="nav-list">
            <li className="nav-list__item">
              <NavLink
                to="/Bestseller"
                className="nav-list__link">
                베스트셀러
              </NavLink>
            </li>
            <li className="nav-list__item">
              <NavLink
                to="/NewBook"
                className="nav-list__link">
                새로나온책
              </NavLink>
            </li>

            <li className="nav-list__item">
            </li>
          </ul>
        </div>
        <div className="nav-extra">
          <div className="search">
            <Search
              placeholder="제목, 작가를 입력하세요"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
          </div>
          <div className="icons">
            <NavLink
              to="/Cart"
              className="icons-list">
              <Badge
                count={bookCart.length}
                size="small">
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </Badge>
            </NavLink>

            <NavLink
              to="/Account/EditUserInfo"
              className="icons-list"
              onClick={handleModalOk}>
              {loginToken ? (
                <div 
                  className='tokenimg'
                  style={{backgroundImage: `url(${userImgToken !== null ? userImgToken : '/user.png'})`}}
                />
              ) : (
                <UserOutlined />
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      <Modal
        visible={successModalVisible}
        closable={false}
        onOk={handleModalClose}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>
          로그인이 필요한 서비스입니다.
          <br />
          로그인 페이지로 이동합니다.
        </p>
      </Modal>
    </header>
  )
}

export default TheHeader;
