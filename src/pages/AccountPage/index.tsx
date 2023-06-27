
import { Link, Outlet } from 'react-router-dom'
import './AccountPage.css'

const AccountPage = () => {
  return (
    <>
      <h1>내 계정</h1>
      <div className="account-page">
        <div className="left-sidebar">
          <Link to="OrderHistory">주문내역</Link>
          <Link to="EditUserInfo">개인정보 수정</Link>
          <Link to="EditBankInfo">계좌관리</Link>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </>
  )
}
export default AccountPage
