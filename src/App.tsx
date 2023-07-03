import {
  Outlet,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom'
import './App.scss'
import MainPage from './pages/MainPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import BestsellerPage from './pages/BestsellerPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import DetailPage from './pages/DetailPage'
import SignInPage from './pages/SigninPage'
import SignUpPage from './pages/SignupPage'
import SearchPage from './pages/SearchPage/index'
import TheHeader from './components/TheHeader'
import TheFooter from './components/TheFooter'
import NewBookPage from './pages/NewBookPage'

import OrderHistoryPage from './pages/OrderHistoryPage'
import EditUserInfoPage from './pages/EditUserInfoPage'
import EditBankInfoPage from './pages/EditBankInfoPage'
import useAccountTokenStore from './store/useAccountTokenStore'
import { API_HEADER } from './api/usersApi'
import { useEffect } from 'react'
import UserListPage from './pages/UserListPage'
import TotalSalesListPage from './pages/TotalSalesListPage'

const Layout = () => {
  return (
    <div>
      <TheHeader />
      {/*검색창, 로그인(페이지), 회원가입(페이지), 로고, 베스트셀러 */}
      <Outlet /> {/* 나머지 페이지를 감싸주는 기능?... */}
      <TheFooter />
    </div>
  )
}

function App() {
  // 로그인 인증
  const location = useLocation()
  const navigate = useNavigate()

  const { loginToken, nickNameToken } = useAccountTokenStore(state => ({
    loginToken: state.loginToken,
    nickNameToken: state.nickNameToken
  }))

  const masterUser = {
    ...API_HEADER,
    Authorization: `Bearer ${loginToken}`,
    materKey: 'true'
  }

  // /admin =>
  async function loginState() {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me',
      {
        method: 'POST',
        headers: { ...API_HEADER, Authorization: `Bearer ${loginToken}` }
      }
    )
    if (res.ok) {
      console.log(nickNameToken)
      return
    } else {
      console.log('로그인 인증 요청에 실패 하였습니다.')
    }

    if (nickNameToken === 'admin') {
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me',
        {
          method: 'POST',
          headers: masterUser
        }
      )
      if (res.ok) {
        console.log(nickNameToken)
        return
      } else {
        console.log('로그인 인증 요청에 실패 하였습니다.')
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    loginState()
  }, [loginToken, location])

  useEffect(() => {
    if (
      nickNameToken === 'admin' &&
      location.pathname === '/Account/EditUserInfo'
    ) {
      navigate('/admin/UserList')
    } else if (nickNameToken !== 'admin' && location.pathname === '/admin') {
      navigate('/')
    }
  }, [loginToken, navigate, location.pathname])

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Layout />}>
          <Route
            index
            element={<MainPage />}
          />

          <Route
            path="/Account/"
            element={<AccountPage />}>
            <Route
              path="OrderHistory"
              element={<OrderHistoryPage />}
            />
            <Route
              path="EditUserInfo"
              element={<EditUserInfoPage />}
            />
            <Route
              path="EditBankInfo"
              element={<EditBankInfoPage />}
            />
          </Route>

          <Route
            path="/Admin"
            element={<AdminPage />}>
            <Route
              path="UserList"
              element={<UserListPage />}
            />
            <Route
              path="TotalSalesList"
              element={<TotalSalesListPage />}
            />
          </Route>

          <Route
            path="/Bestseller"
            element={<BestsellerPage />}
          />
          <Route
            path="/Cart"
            element={<CartPage />}
          />
          <Route
            path="/Checkout"
            element={<CheckoutPage />}
          />
          <Route
            path="/Detail"
            element={<DetailPage />}
          />
          <Route
            path="/SignInPage"
            element={<SignInPage />}
          />
          <Route
            path="/SignUpPage"
            element={<SignUpPage />}
          />
          <Route
            path="/NewBook"
            element={<NewBookPage />}
          />
          <Route
            path="/Search"
            element={<SearchPage />}
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
