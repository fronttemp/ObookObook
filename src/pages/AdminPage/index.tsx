import { NavLink, Outlet } from 'react-router-dom'

const Admin_index = (): JSX.Element => {
  return (
    <section>
      <div className="admin-page">
        <div className="left-sidebar">
          <h2>관리자 계정</h2> 
          <NavLink to="/Admin/UserList" style={({ isActive }) => ({ color: isActive ? '#5e90f2' : '#141414' })}>유저 리스트</NavLink>
          <NavLink to="/Admin/TotalSalesList" style={({ isActive }) => ({ color: isActive ? '#5e90f2' : '#141414' })}>전체 거래내역</NavLink>
          <NavLink to="/Admin/AdminTemp" style={({ isActive }) => ({ color: isActive ? '#5e90f2' : '#141414' })}>어드민 임시</NavLink>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default Admin_index;
