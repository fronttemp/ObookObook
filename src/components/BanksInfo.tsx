import { useEffect, useState } from 'react'
import {
  bankChoiceAPI,
  accountCheckAPI,
  accountConnectAPI,
  accountDeleteAPI
} 
from '../api/accountApi'
import { Button, Input, Checkbox, Select, Form, Card, Table } from 'antd'
import './BanksInfo.css'
import useAccountTokenStore from '../store/useAccountTokenStore'
import ConfirmModal from './ConfirmModal'

type Bank = {
  code: string;
  name: string;
  digits: number[];
};

type Account = {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  bankCode: string;
};

type AccountWithKey = Account & { key: string };


const BanksInfo = () => {
  const [banks, setBanks] = useState<Bank[]>([])
  const [accounts, setAccounts] = useState<AccountWithKey[]>([])
  const [selectedBankCode, setSelectedBankCode] = useState<string>('')
  const [selectedBankDigits, setSelectedBankDigits] = useState<number[]>([])
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [toDeleteAccountId, setToDeleteAccountId] = useState<string>('')
  const { loginToken } = useAccountTokenStore()
  const { Option } = Select
  const [form] = Form.useForm<{ bankCode: string; accountNumber: string; phoneNumber: string; agreement: boolean }>();


  const fetchBanks = async () => {
    if (loginToken) {  // check if loginToken is not null
      try {
        const data = await bankChoiceAPI(loginToken)
        if (data) setBanks(data)
      } catch (error) {
        console.error('Fetching banks failed:', error)
      }
    }
  }

  console.log(selectedBankCode)

  const fetchAccounts = async () => {
    if (loginToken) {  // check if loginToken is not null
      try {
        const data = await accountCheckAPI(loginToken)
        if (data && data.accounts) {
          const accountsWithKey = data.accounts.map((account: Account) => ({ ...account, key: account.id })) // provide type for account
          setAccounts(accountsWithKey)
        }
      } catch (error) {
        console.error('Fetching accounts failed:', error)
      }
    }
  }

  useEffect(() => {
    fetchBanks()
    fetchAccounts()
  }, [])

  const handleAccountDelete = async () => {
    if (loginToken) {  // check if loginToken is not null
      try {
        await accountDeleteAPI(loginToken, toDeleteAccountId)
        fetchBanks() // 은행 목록 다시 가져오기
        fetchAccounts() // 계좌 삭제 후 다시 계좌 정보를 가져옴
      } catch (error) {
        console.error('Account deletion failed:', error)
      }
    }
  }

  const handleBankSelect = (bankCode : string) => {
    setSelectedBankCode(bankCode)
    const selectedBank = banks.find(bank => bank.code === bankCode)
    if (selectedBank) {
      setSelectedBankDigits(selectedBank.digits)
    }
  }

  const handleAccountConnect = async (values: {
    bankCode: string;
    accountNumber: string;
    phoneNumber: string;
    agreement: boolean;
  }) => {
    const { bankCode, accountNumber, phoneNumber, agreement } = values
    if (agreement) {
      await accountConnectAPI(
        loginToken,
        bankCode,
        accountNumber,
        phoneNumber,
        agreement
      )
      fetchBanks() // 은행 목록 다시 가져오기
      fetchAccounts() // 계좌 연결 후 다시 계좌 정보를 가져옴
      form.resetFields() // Form의 필드를 초기화합니다.
    } else {
      alert('계좌연결에 동의해주세요.')
    }
  }

  // 연결 가능한 은행 목록 필터링
  const availableBanks = banks.filter(
    bank => !accounts.find(account => account.bankCode === bank.code)
  )

  // 계좌번호 최대 입력 길이 계산
  const maxAccountLength = selectedBankDigits.reduce((acc, val) => acc + val, 0)

  // Table Columns 정의
  const columns = [
    {
      title: '은행명',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: '계좌번호',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: '계좌 잔액',
      dataIndex: 'balance',
      key: 'balance',
      render:(balance: number) => `${balance.toLocaleString()}원` // 잔액을 원화로 표시
    },
    {
      title: '',
      key: 'action',
      render: (record : AccountWithKey) => (
        <Button
          onClick={() => {
            setToDeleteAccountId(record.id) // Set the account to delete
            setConfirmVisible(true) // Show the confirmation modal
          }}>
          계좌 해지
        </Button>
      ),
    },
  ]

  return (
    <div className='bank-account-page'>
      <Card className="account-list-card" title="나의 계좌" bordered={true}>
        <Table dataSource={accounts} columns={columns} pagination={false} />
      </Card>
      
      <Card className="account-connect-card" title ="계좌 연결" bordered={true}>
        <Form
          className="account-connect"
          form={form}
          onFinish={handleAccountConnect}
          style={{ width: '240px' }}>
          <Form.Item
            name="bankCode"
            rules={[{ required: true, message: '은행을 선택해주세요.' }]}>
            <Select
              className="bank-select"
              placeholder="은행 선택"
              onChange={handleBankSelect}>
              {availableBanks.map(bank => (
                <Option
                  key={bank.code}
                  value={bank.code}>
                  {bank.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="accountNumber"
            rules={[{ required: true, message: '계좌번호를 입력해주세요' }]}>
            <Input
              className="account-input"
              placeholder="계좌번호"
              maxLength={maxAccountLength}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: '전화번호를 입력해주세요' }]}>
            <Input
              className="account-input"
              placeholder="전화번호"
              maxLength={11}
            />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[{ required: true, message: '계좌연결에 동의해주세요' }]}>
            <Checkbox className="signature-checkbox">
              계좌연결에 동의합니다
            </Checkbox>
          </Form.Item>
          <Form.Item className='buttons-container'>
            <Button
              className="connect-button"
              type="primary"
              htmlType="submit">
              계좌 연결
            </Button>
            <Button
              className="reset-button"
              onClick={() => form.resetFields()}>
              초기화
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ConfirmModal
        content="계좌해지에 동의하십니까"
        onConfirm={handleAccountDelete}
        open={confirmVisible}
        setConfirmVisible={setConfirmVisible}
      />
    </div>
  )
}

export default BanksInfo