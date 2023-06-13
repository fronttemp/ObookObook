import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (request: VercelRequest, response: VercelResponse) {
  const { data } = await axios.get('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbantglljung1351001&Query=javascript&output=js')
  response.status(200).json(data)
}




// 강사님이 만든 서버 <--> 브라우저 => 과제


// 알라딘 <--> 브라우저  =>  CORS 에러!


// 알라딘 <--> 버셀프록시서버 <--> 브라우저  =>  잘됨!

// 검색 할 때마다 헤로피 서버에 데이터 저장  