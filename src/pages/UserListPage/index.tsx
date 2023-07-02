import { useEffect, useState } from 'react';
import { usersCheckAPI } from '../../api/usersApi';
import { Table } from 'antd';
import '../AdminPage/Admin.scss';


interface User {
  email: string;
  displayName: string;
}

const UserListPage = () => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await usersCheckAPI();
      setUserList(data);
    };
    getUsers();
  }, []);

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
      align: 'center'
    },
    {
      title: '사용자 이메일',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: '닉네임',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center'
      
    }
  ]

  return (
      <div id="user-list">
        <div className="page_title">유저 리스트</div>
        <Table
          dataSource={userDataSource}
          columns={userColumns}
          pagination={false}
        />
      </div>
  );
};

export default UserListPage;
