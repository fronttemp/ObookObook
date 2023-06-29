import React, { useEffect, useState } from 'react'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Badge, Modal } from 'antd'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import useAccountTokenStore from '../store/useAccountTokenStore'
import { API_HEADER } from '../api/usersApi'
import { useListApi } from '../store/useItemApi'

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
    if (!loginToken && location.pathname === '/Account') {
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
          <span>{nickNameToken}님 환영합니다.</span>
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
              className="icons-list"
              onClick={handleModalOk}>
              {loginToken ? (
                <img
                  style={{
                    width: '20px',
                    height: '20px'
                  }}
                  src={userImgToken !== (null || '') ? userImgToken : '/user.png'}
                  alt="프로필"
                />
              ) : (
                <UserOutlined />
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* <Dropdown visibility={dropdownVisibility}>
        <TagSearchMenu onTagClick = {onTagSearch}/>
      </Dropdown> */}

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

export default TheHeader
