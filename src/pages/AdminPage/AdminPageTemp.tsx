import { useEffect, useState } from 'react';
import { usersCheckAPI } from '../../api/usersApi';
import { ItemAllSellCheckAPI, ItemSellCheckAPI } from '../../api/productApi';
import { Button, Table, Modal } from 'antd';
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
  user: User
  timePaid: string;
}

const AdminPageTemp = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [nickNameToken, setNickNameToken] = useState<string | undefined>(undefined);
  const [itemSellList, setItemSellList] = useState<ItemSell[]>([]);
  const [confirmContent, setConfirmContent] = useState<string>('')
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [cancelContent, setCancelContent] = useState<string>('')
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  useEffect(() => {
    const accountToken = JSON.parse(localStorage.getItem('accountToken') || '');
    setNickNameToken(accountToken?.state?.nickNameToken);
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
      const response = await ItemSellCheckAPI(detailId, true, false);
      if (response) {
        setCancelContent('판매 취소가 완료되었습니다.')
        setCancelModal(true)
      } else {
        setCancelContent(
          '이미 주문 취소가 완료되었거나, 구매가 확정된 상품입니다.'
        )
        setCancelModal(true)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSellConfirm = async (detailId: string) => {
    try {
      const response = await ItemSellCheckAPI(detailId, false, true);
      if (response) {
        setConfirmContent('판매가 확정되었습니다.')
        setConfirmModal(true)
      } else {
        setConfirmContent('이미 판매가 확정되었거나, 취소된 상품입니다.')
        setConfirmModal(true)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalOk = () => {
    setCancelModal(false)
    setConfirmModal(false)
  }

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
    key: (<p className='listNumber'>{index + 1}</p>),
    email: (<p className='userEmail'>{user.email}</p>),
    nickName: (<p className='userNickName'>{user.displayName}</p>)
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
    key: (<div>
      <p className='listNumber'>{index + 1}</p>
    </div>),
    itemName: (<div className="userSellListItems">
      {JSON.parse(order.product.title).map((book: Book, index: number) => (
        <div key={index} className='sellListItem'>
          <h3>{book.title ? truncate(book.title, 15) + '' : null}</h3>
          {priceKr(book.priceSales)}
        </div>
      ))}
    </div>),
    price: (<div className='totalPrice'>
      <span>{priceKr(order.product.price)}</span>
    </div>),
    userName: order.user.email,
    userBank: (<div className='userBank'>
      <div>{order.account.bankName}</div>
      <div>{order.account.accountNumber}</div>
      <a className='sellTime'>{formatDateTime(order.timePaid)}</a>
    </div>),
    action: (
      <>
        <div className="sellListFeat">
          <Button onClick={() => handleSellCancel(order.detailId)}>판매 취소</Button>
          <Button onClick={() => handleSellConfirm(order.detailId)}>판매 확정</Button>
        </div>
      </>
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
      title: '',
      dataIndex: 'action',
      key: 'action',
    },
  ]




  return (
    <>
      <div id="user-list">
        <h1>유저 리스트</h1>
        <Table
          dataSource={userDataSource}
          columns={userColumns}
          pagination={false}
        />
      </div>
      <div id="sell-list">
        <h1>판매 내역</h1>
        <Table
          dataSource={itemDataSource}
          columns={itemColumns}
          pagination={false}
        />
      </div>
      <Modal
        open={cancelModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{cancelContent}</p>
      </Modal>

      <Modal
        open={confirmModal}
        closable={false}
        onOk={handleModalOk}
        okText="확인"
        cancelButtonProps={{ style: { display: 'none' } }}>
        <p>{confirmContent}</p>
      </Modal>
    </>
  );
};

export default AdminPageTemp;