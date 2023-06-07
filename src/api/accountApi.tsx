import { API_HEADER } from "./usersApi"


///// 선택 가능한 은행 목록 조회 /////
export async function bankChoiceAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/account/banks', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'}
  })
  const data = await res.json()
  return data
}

///// 계좌 목록 및 잔액 조회 /////
export async function accountCheckAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/account', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
}

///// 계좌 연결 /////
export async function accountConnectAPI(bankCode: string, accountNumber: string, phoneNumber: string, signature: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/account', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
    body: JSON.stringify({
      bankCode,
      accountNumber,
      phoneNumber,
      signature
    })
  })
  const data = await res.json()
  return data
}

 ///// 계좌 해지 //////
 export async function accountDeleteAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/account', {
    method : 'DELETE',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
}
