import { API_HEADER } from './usersApi'


///// 선택 가능한 은행 목록 조회 /////
export async function bankChoiceAPI(token: string) {
  const res = await fetch(
    'https://asia-northeast3-heropy-api.cloudfunctions.net/api/account/banks',
    {
      method: 'GET',
      headers: {
        ...API_HEADER,
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = await res.json()
  return data
}

///// 계좌 목록 및 잔액 조회 /////
export async function accountCheckAPI(token: string | null) {
  const res = await fetch(
    'https://asia-northeast3-heropy-api.cloudfunctions.net/api/account',
    {
      method: 'GET',
      headers: {
        ...API_HEADER,
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = await res.json()
  return data
}

///// 계좌 연결 /////
export async function accountConnectAPI(token : string | null,
  bankCode: string,
  accountNumber: string,
  phoneNumber: string,
  signature: boolean
) {
  const res = await fetch(
    'https://asia-northeast3-heropy-api.cloudfunctions.net/api/account',
    {
      method: 'POST',
      headers: {
        ...API_HEADER,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        bankCode,
        accountNumber,
        phoneNumber,
        signature
      })
    }
  )
  const data = await res.json()
  return data
}

///// 계좌 해지 //////
export async function accountDeleteAPI(token: string, accountId: string) {
  const signature = true
  const res = await fetch(
    'https://asia-northeast3-heropy-api.cloudfunctions.net/api/account',
    {
      method: 'DELETE',
      headers: {
        ...API_HEADER,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ accountId, signature })
    }
  )
  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    throw new Error('Account deletion failed')
  }
}
