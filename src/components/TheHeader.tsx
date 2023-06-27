import { useState } from 'react';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import Dropdown from './Dropdown';
import { useNavigate, NavLink } from 'react-router-dom';
import TagSearchMenu from './TagSearchMenu';
import { useListApi } from '../store/useItemApi'

const TheHeader = () => {
  const navigate = useNavigate()
  const {fetch, books} = useListApi()

  //드롭다운 메뉴 스테이트 관리
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  //antd input 설정값 !!수정불가능!!
  const { Search } = Input;

  //input값으로 navigate
  const onSearch = (value: string) => {
    if(value.trim() !== ''){
    navigate(`/search?q=${value.trim()}`)
    } else {
      navigate(`/`)
    }
  }

  const onTagSearch = () => {
    fetch()
    console.log(books.tag)
  }

  
  return (
    <header>
      <div className="login-nav">
        <NavLink to='/SigninPage'>로그인</NavLink>
        <NavLink to='/SignupPage'>회원가입</NavLink>
      </div>
      
      <nav>
        <div className="nav-menu">
          <NavLink to='/' className='logo'><img src="../logo.png" alt="logo" /></NavLink>
          <ul className='nav-list'>
            <li className='nav-list__item'>
              <NavLink to='/Bestseller' className='nav-list__link'>베스트셀러</NavLink>
            </li>
            <li className='nav-list__item'>
              <NavLink to='/NewBook' className='nav-list__link'>새로나온책</NavLink>
            </li>
            <li className='nav-list__item'>
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
          <NavLink to='/Cart' className='icons-list'><ShoppingCartOutlined /></NavLink>
          <NavLink to='/Account' className='icons-list'><UserOutlined /></NavLink>
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
