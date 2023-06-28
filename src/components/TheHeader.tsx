import React, { useEffect, useState } from 'react'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Badge } from 'antd'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import useAccountTokenStore from '../store/useAccountTokenStore'
import { API_HEADER } from '../api/usersApi'
import { useListApi } from '../store/useItemApi'
import Dropdown from './Dropdown'
import TagSearchMenu from './TagSearchMenu'

const TheHeader = () => {
  const navigate = useNavigate()
  const { fetch, books } = useListApi()
  const { bookCart } = useCartStore()

  //드롭다운 메뉴 스테이트 관리
  const [dropdownVisibility, setDropdownVisibility] = useState(false)

  //antd input 설정값 !!수정불가능!!
  const { Search } = Input

  //input값으로 navigate
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

  // 로그인 상태시 해당 페이지 접근 금지
  const location = useLocation()

  useEffect(() => {
    if (
      loginToken &&
      (location.pathname === '/SigninPage' ||
        location.pathname === '/SignupPage')
    ) {
      navigate('/')
    }
  }, [loginToken, navigate, location.pathname])

  return (
    <header>
      {loginToken ? (
        <div className="login-nav">
          <span>{nickNameToken}님 환영합니다.</span>
          <img
            style={{
              width: '20px',
              height: '20px'
            }}
            src={userImgToken}
            alt="프로필"
          />
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
              src="../logo.png"
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
              {/* <span 
              className={dropdownVisibility ? 'nav-list__active' : 'nav-list__link'}
              onClick={e => setDropdownVisibility(!dropdownVisibility)}
              >분야찾기</span> */}
            </li>
          </ul>
        </div>
        <div className="nav-extra">
          <div className="search">
            <Search
              placeholder="제목을 입력하세요"
              onSearch={onSearch} //antd 기능 : 엔터 혹은 버튼 클릭시 input value값 전달
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
              to="/Account"
              className="icons-list">
              <UserOutlined />
            </NavLink>
          </div>
        </div>
      </nav>

      {/* <Dropdown visibility={dropdownVisibility}>
        <TagSearchMenu onTagClick = {onTagSearch}/>
      </Dropdown> */}
    </header>
  )
}

export default TheHeader
