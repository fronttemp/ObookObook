import React from 'react'
import { Outlet, Routes, Route } from 'react-router-dom'
import './App.scss'
import MainPage from './pages/MainPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import BestsellerPage from './pages/BestsellerPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import DetailPage from './pages/DetailPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SearchPage from './pages/SearchPage/index'
import TheHeader from './components/TheHeader'
import TheFooter from './components/TheFooter'
import NewBookPage from './pages/NewBookPage'

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
            path="/Account"
            element={<AccountPage />}
          />
          <Route
            path="/Admin"
            element={<AdminPage />}
          />
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
            path="/:BookId"
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
