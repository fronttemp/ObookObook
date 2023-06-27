import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  //requset.query 값을 나눠 할당
  const search = request.query.s
  const query = `&Query=${request.query.q}`
  const queryType = `&QueryType=${request.query.qt}`
  const tag = `&CategoryId=${request.query.t}`
  const sort = `&Sort=${request.query.sort}`
  const id = `&ItemId=${request.query.id}`
    // 분야 검색시 예시

  try {
    const { data } = await axios.get(
      //검색에 필요한 query 값을 url 각 위치에 맞게 붙임
      //(s 외의 쿼리는 순서 상관이 없기 때문에 뒤로 계속 붙이면 됨)
      `https://www.aladin.co.kr/ttb/api/${search}.aspx?ttbkey=ttbantglljung1351001&SearchTarget=eBook&output=js&Version=20131101&MaxResults=50${query}${queryType}${tag}${sort}${id}
      `
    )
    response.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data from Aladin API:', error)

    response
      .status(500)
      .json({ error: 'There was an error calling the Aladin API' })
  }
}
