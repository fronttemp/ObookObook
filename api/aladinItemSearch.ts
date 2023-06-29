import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const search = request.query.s
  const query = `&Query=${request.query.q}`
  const queryType = `&QueryType=${request.query.qt}`
  const opt = `&OptResult=${request.query.opt}`
  const tag = `&CategoryId=${request.query.t}`
  const sort = `&Sort=${request.query.sort}`
  const id = `&ItemId=${request.query.id}`
  const mr = `&MaxResults=${request.query.mr}`

  try {
    const { data } = await axios.get(
      `https://www.aladin.co.kr/ttb/api/${search}.aspx?ttbkey=ttbckisss66601645001&output=js&SearchTarget=eBook&Version=20131101
      ${query}${queryType}${opt}${tag}${sort}${id}${mr}`
    )
    response.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data from Aladin API:', error)

    response
      .status(500)
      .json({ error: 'There was an error calling the Aladin API' })
  }
}