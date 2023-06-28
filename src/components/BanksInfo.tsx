import React, { useEffect, useState } from 'react';
import { bankChoiceAPI, accountCheckAPI, accountConnectAPI, accountDeleteAPI } from '../api/accountApi';
import { Button, Input, Checkbox } from 'antd';
import './BanksInfo.css';

const BanksInfo = () => {
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankDigits, setSelectedBankDigits] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signature, setSignature] = useState(false);

  const fetchBanks = async () => {
    try {
      const data = await bankChoiceAPI();
      if (data) setBanks(data);
    } catch (error) {
      console.error('Fetching banks failed:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await accountCheckAPI();
      if (data && data.accounts) setAccounts(data.accounts);
    } catch (error) {
      console.error('Fetching accounts failed:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchAccounts();
  }, []);

  const handleAccountDelete = async (accountId) => {
    try {
      await accountDeleteAPI(accountId);
      fetchBanks(); // 은행 목록 다시 가져오기
      fetchAccounts(); // 계좌 삭제 후 다시 계좌 정보를 가져옴
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  };

  const handleBankSelect = (bankCode) => {
    setSelectedBankCode(bankCode);
    const selectedBank = banks.find(bank => bank.code === bankCode);
    if (selectedBank) {
      setSelectedBankDigits(selectedBank.digits);
    }
  };

  const handleAccountConnect = async () => {
    if (signature) {
      await accountConnectAPI(selectedBankCode, accountNumber, phoneNumber, signature);
      fetchBanks(); // 은행 목록 다시 가져오기
      fetchAccounts(); // 계좌 연결 후 다시 계좌 정보를 가져옴
    } else {
      alert('계좌연결에 동의해주세요.');
    }
  };

  // 연결 가능한 은행 목록 필터링
  const availableBanks = banks.filter(bank => !accounts.find(account => account.bankCode === bank.code));

  return (
    <div>
      <h2 style={{ marginTop: '20px' }}>나의 계좌</h2>
      <div className="account-list">
        {accounts.map(account => (
          <div key={account.id} className="account-item">
            <p>{account.bankName} - {account.accountNumber}</p>
            <Button onClick={() => handleAccountDelete(account.id)}>계좌 해지</Button>
          </div>
        ))}
      </div>

      <h2>계좌 연결</h2>
      <div className="account-connect">
        <select
          className="bank-select"
          value={selectedBankCode}
          onChange={(e) => handleBankSelect(e.target.value)}
        >
          <option value="" disabled hidden>
            은행 선택
          </option>
          {availableBanks.map(bank => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        <Input
          className="account-input"
          placeholder="계좌번호"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Input
          className="account-input"
          placeholder="전화번호"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Checkbox
          className="signature-checkbox"
          onChange={(e) => setSignature(e.target.checked)}
        >
          계좌연결에 동의합니다
        </Checkbox>
        <Button className="connect-button" onClick={handleAccountConnect}>
          계좌 연결
        </Button>
      </div>
    </div>
  );
};

export default BanksInfo;
