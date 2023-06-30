import { isValidElement, useEffect, useState } from 'react'
import { usersCheckAPI } from '../../api/usersApi'
import {ItemAllSellCheckAPI, ItemSellCheckAPI} from '../../api/productApi'
import {Button} from 'antd'
import { Navigate} from 'react-router-dom'
import './Admin.scss'

const AdminPage = () => {
  const [userList, setUserList] = useState([])
  const [nickNameToken, setNickNameToken] = useState(undefined);
  const [itemSellList, setItemSellList] = useState([])
  const [isCanceled, setIsCanceled] = useState(false)


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

  useEffect(() => {
    const fetchItemSellList = async () => {
      try {
        const response = await ItemAllSellCheckAPI();
        console.log("response : ", response)
        // const res = response.map((item) => item.product.title)
        // const nesRes = JSON.parse(res)
        // const newData = res.map((item) => item.replace(/[\[\]\\]/g, ''))
        setItemSellList(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemSellList();
  }, []);

  const handleSellCancel = async (detailId: string) => {
    try {
      const response = await ItemSellCheckAPI(detailId, true, false);
      setIsCanceled(response);
      console.log(response);
      console.log(detailId)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSellConfirm = async(detailId: string) => {
    try {
      const response = await ItemSellCheckAPI(detailId, false, true);
      setIsCanceled(response);
      console.log(response);
      console.log(detailId)
    } catch(error) {
      console.log(error)
    }
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substring(0, n) + "..." : str;
  }

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
        <div>
        <h2>판매 내역</h2>
          {itemSellList && itemSellList.map((order, index) => {
            const parsedTitle = JSON.parse(order.product.title)
              return (
                <div key={order.detailId} className = 'sellList'>
                  <p>{index+1}</p>
                  <p>Description: {order.product.description}</p>
                  {/* 추가적으로 더 많은 정보를 출력하고 싶다면 여기에 코드를 추가하세요 */}
                  <div className='sellListItem'>
                    {parsedTitle.map((book, index) => (
                        <div key={index}>
                          <img src={book.cover} alt={book.title} />
                          <h3>{book.title ? truncate(book.title, 10)+'...' : null}</h3>
                          <p>Price: {book.priceSales}</p>
                        </div>
                    ))}
                  </div>
                  <Button onClick = {() => handleSellCancel(order.detailId)}>판매 취소</Button>
                  <Button onClick = {() => handleSellConfirm(order.detailId)}>판매 확정</Button>
                  <span>
                    {order.isCanceled ? 'null' : 'null'}
                  </span>
                </div>
              );
          })}
        </div>
      </div>
    </>
  )
}

export default AdminPage
