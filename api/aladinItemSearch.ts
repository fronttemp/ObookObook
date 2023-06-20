import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const query = request.query.q
  try {
    const { data } = await axios.get(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbantglljung1351001&Query=${query}&output=js&Version=20131101

      `
    )
    response.status(200).json(data)
    console.log('data: ', data)
  } catch (error) {
    console.error('Error fetching data from Aladin API:', error)

    response
      .status(500)
      .json({ error: 'There was an error calling the Aladin API' })
  }
}
