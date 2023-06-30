export const API_HEADER = {
  "content-type": "application/json",
  "apikey": "KDT5_nREmPe9B",
  "username": "KDT5_Team05"
}



///// 회원가입 /////
export async function signUpAPI(email: string, password: string, displayName: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup', {
    method : 'POST',
    headers: API_HEADER,
    body: JSON.stringify({
      email,
      password,
      displayName
    })
  })
  const json = await res.json()
  return json
}

///// 로그인 ///// 
export async function logInAPI(email: string, password: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login', {
    method : 'POST',
    headers: API_HEADER,
    body: JSON.stringify({
      email,
      password
    })
  })
  const data = await res.json()
  return data
}

///// 인증확인 /////
export async function logCheckAPI(token: string) {
    const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me', {
      method : 'POST',
      headers: {
        ...API_HEADER,
        'Authorization': `Bearer ${token}`}
    })
    const data = await res.json()
    return data
}

///// 로그아웃 /////
export async function logOutAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
}

///// 사용자 정보 수정 /////
export async function userUpdateAPI(displayName: string, oldPassword: string, newPassword: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user', {
    method : 'PUT',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
    body: JSON.stringify({
      displayName,
      oldPassword,
      newPassword
    })
  })
  const data = await res.json()
  return data
}

///// 사용자 목록 조회 /////
export async function usersCheckAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/users', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'}
  })
  const data = await res.json()
  return data
}
