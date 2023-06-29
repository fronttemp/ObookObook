import React, { useEffect, useState } from 'react'
import { usersCheckAPI } from '../../api/usersApi'
import { Navigate} from 'react-router-dom'

const AdminPage = () => {
  const [userList, setUserList] = useState([])
  const [nickNameToken, setNickNameToken] = useState(undefined);

  useEffect(() => {
    const accountToken = JSON.parse(localStorage.getItem('accountToken'));
    setNickNameToken(accountToken.state.nickNameToken);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const data = await usersCheckAPI()
      setUserList(data)
    }
    getUsers()
  }, [])

  if (nickNameToken === undefined) {
    return null;
  }
  
  if (nickNameToken !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1>AdminPage</h1>
      <div className="admin-page">
        <div className="user-list">
          <h3>유저 리스트</h3>
          {userList.map((user, index) => (
            <div key={index}>
              <p>{index + 1}</p>
              <p>{user.email}</p>
              <p>{user.displayName}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminPage
