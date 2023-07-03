import { API_HEADER } from "./usersApi"



///// 모든 제품 조회 /////
export async function ItemCheckAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
  })
  const data = await res.json()
  return data
}

///// 전체 거래(판매) 내역 /////
export async function ItemAllSellCheckAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/all', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
  })
  const data = await res.json()
  return data
}

///// 거래(판매) 내역 완료/취소 및 해제
export async function ItemSellCheckAPI(detailId: string, isCanceled: boolean, done: boolean) {
  const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/${detailId}`, {
    method : 'PUT',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
    body: JSON.stringify({
      'isCanceled' : isCanceled,
      'done' : done
    })
  })
  const data = await res.json()
  return data
}

///// 제품 추가 /////
export async function ItemAddAPI(title: string, price: number, description: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
    body: JSON.stringify({
      "title" : `${title}`,
      "price" : price,
      "description" : `${description}`,
    })
  })
  const data = await res.json()
  return data
}

///// 제품 수정 /////
export async function ItemUpdateAPI(title? : string, price?: number, description?: string, tags?: string[], thumbnailBase64?: string, photoBase64?: string, isSoldOut?: boolean) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/:productId', {
    method : 'PUT',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
    body: JSON.stringify({
      title,
      price,
      description,
      tags,
      thumbnailBase64,
      photoBase64,
      isSoldOut
    })
  })
  const data = await res.json()
  return data
}

///// 제품 삭제 /////
export async function ItemDeleteAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/:productId', {
    method : 'DELETE',
    headers: {
      ...API_HEADER,
      'masterKey': 'true'},
  })
  const data = await res.json()
  return data
}

///// 단일 제품 상세 조회 /////
export async function ItemDetailCheckAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/:productId', {
    method : 'GET',
    headers: API_HEADER
  })
  const data = await res.json()
  return data
}

///// 제품 검색 /////
export async function ItemSearchAPI(searchText?: string, searchTags?: string[]) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/search', {
    method : 'POST',
    headers: API_HEADER,
    body: JSON.stringify({
      searchText,
      searchTags
    })
  })
  const data = await res.json()
  return data
}

///// 제품 거래(구매) 신청 /////
export async function ItemBuyAPI(loginToken: string | null, productId: string, accountId: string) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/buy', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': `Bearer ${loginToken}`},
      body: JSON.stringify({
        "productId" : `${productId}`,
        "accountId" : `${accountId}`,
      })
  })
  const data = await res.json()
  return data
}

///// 제품 거래(구매) 취소 /////
export async function ItemCancelAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/cancel', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
}

///// 제품 거래(구매) 확정
export async function ItemConfirmAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/ok', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
}

///// 제품 전체 거래(구매) 내역 /////
export async function ItemAllBuymAPI(loginToken: string){
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/details', {
    method : 'GET',
    headers: {
      ...API_HEADER,
      'Authorization': `Bearer ${loginToken}`},
  })
  const data = await res.json() 
  return data
}

///// 단일 제품 상세 거래(구매) 내역 /////
export async function ItemBuyDetailmAPI() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/detail', {
    method : 'POST',
    headers: {
      ...API_HEADER,
      'Authorization': 'Bearer <accessToken>'},
  })
  const data = await res.json()
  return data
  }
