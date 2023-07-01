import { useEffect, useState } from 'react';
import { usersCheckAPI } from '../../api/usersApi';
import { ItemAllSellCheckAPI, ItemSellCheckAPI } from '../../api/productApi';
import { Button, Table } from 'antd';
import { Navigate } from 'react-router-dom';
import './Admin.scss';

interface User {
  email: string;
  displayName: string;
}

interface Account {
  bankName: string;
  accountNumber: string;
}

interface Book {
  title: string;
  priceSales: number;
}

interface Product {
  description: string;
  title: string;
  price: number;
}

interface ItemSell {
  detailId: string;
  product: Product;
  account: Account;
  orderStatus: string;
}

const AdminPage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [nickNameToken, setNickNameToken] = useState<string | undefined>(undefined);
  const [itemSellList, setItemSellList] = useState<ItemSell[]>([]);

  useEffect(() => {
    const accountToken = JSON.parse(localStorage.getItem('accountToken') || '');
    setNickNameToken(accountToken.state.nickNameToken);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const data = await usersCheckAPI();
      setUserList(data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const fetchItemSellList = async () => {
      try {
        const response = await ItemAllSellCheckAPI();
        setItemSellList(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemSellList();
  }, []);

  const handleSellCancel = async (detailId: string) => {
    try {
      await ItemSellCheckAPI(detailId, true, false);
      updateOrderStatus(detailId, 'canceled');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSellConfirm = async (detailId: string) => {
    try {
      await ItemSellCheckAPI(detailId, false, true);
      updateOrderStatus(detailId, 'confirmed');
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderStatus = (detailId: string, status: string) => {
    setItemSellList((prevList) =>
      prevList.map((order) => {
        if (order.detailId === detailId) {
          return {
            ...order,
            orderStatus: status,
          };
        }
        return order;
      })
    );
  };

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  const priceKr = (price: number) => {
    return <span>{`${price.toLocaleString('ko-KR')} 원`}</span>
  }

  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString)
    return dateTime.toLocaleString()
  }


  if (nickNameToken === undefined) {
    return null;
  }

  if (nickNameToken !== 'admin') {
    return <Navigate to="/" replace />;
  }



  const userDataSource = userList.map((user, index) => ({
    key: (<p className = 'listNumber'>{index + 1}</p>),
    email: (<p className = 'userEmail'>{user.email}</p>),
    nickName : (<p className = 'userNickName'>{user.displayName}</p>)
  }))

  const userColumns = [
    {
      title: '번호',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '사용자 이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '닉네임',
      dataIndex: 'nickName',
      key: 'nickName',
    }
  ]


  const itemDataSource = itemSellList.map((order, index) => ({
    key : (<div>
            <p className = 'listNumber'>{index + 1}</p>
          </div>),
    itemName: (<div className="userSellListItems">
          {JSON.parse(order.product.title).map((book, index) => (
            <div key={index} className = 'sellListItem'>
              <h3>{book.title ? truncate(book.title, 15) + '' : null}</h3>
              {priceKr(book.priceSales)}
            </div>
          ))}
          </div>),
    price: priceKr(order.product.price),
    userName: order.user.email,
    userBank: (<div className = 'userBank'>
                <div>{order.account.bankName}</div>
                <div>{order.account.accountNumber}</div>
                <a className = 'sellTime'>{formatDateTime(order.timePaid)}</a>
              </div>),
    action: (
      <div className="sellListFeat">
        <Button onClick={() => handleSellConfirm(order.detailId)}>확인</Button>
        <Button onClick={() => handleSellCancel(order.detailId)}>취소</Button>
        <div>
          {order.orderStatus === 'canceled' && <span>판매가 취소되었습니다</span>}
          {order.orderStatus === 'confirmed' && <span>판매가 확정되었습니다</span>}
        </div> 
      </div>
    )
  }))

  const itemColumns = [
    {
      title: '번호',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '구매품',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '총 구매',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '구매자',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '계좌번호',
      dataIndex: 'userBank',
      key: 'userBank', 
    },
    {
      title: '취소, 확정 여부',
      dataIndex: 'action',
      key: 'action',
    },
  ]




  return (
    <section>
      <div id="user-list">
        <h1>유저 리스트</h1>
        <Table
          dataSource={userDataSource}
          columns={userColumns}
          pagination = {false}
          />
      </div>
      <div id="sell-list">
        <h1>판매 내역</h1>
        <Table 
        dataSource={itemDataSource}
        columns={itemColumns}
        pagination = {false}
        />
      </div>
    </section>
  );
};

export default AdminPage;