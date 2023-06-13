import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (request: VercelRequest, response: VercelResponse) {
  const { url, body } = request.body
  const { data } = await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/${url}`,
    headers: {
      // ...
    },
    data: body
  })
  response.status(200).json(data)
}
