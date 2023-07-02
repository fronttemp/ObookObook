import { NavLink, Outlet } from 'react-router-dom'

const Admin_index = (): JSX.Element => {
  return (
    <section>
      <div className="admin-page">
        <div className="left-sidebar">
          <div className='page_title'>관리자 계정</div> 
          <NavLink to="/Admin/UserList" style={({ isActive }) => ({ color: isActive ? '#5e90f2' : '#141414' })}>유저 리스트</NavLink>
          <NavLink to="/Admin/TotalSalesList" style={({ isActive }) => ({ color: isActive ? '#5e90f2' : '#141414' })}>전체 거래내역</NavLink>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default Admin_index;
