import axios from 'axios'
import { useEffect, useState } from 'react'

const NewbookPage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //useEffect를 사용하여 신간 카테고리에 들어오자마자 검색 즉시실행
    (async () => {
      try {
        //신간 쿼리 값은 고정적이기 때문에 변수 사용 x
        const response = await axios.get(`/api/aladinItemSearch?s=ItemList&qt=ItemNewAll`)
        setBooks(response.data.item)
        console.log(response.data.item)

        setLoading(false)
      } catch (error) {
        console.error('Failed to search books', error)
      }
    })();
    }, [])
  
  
  return (
    <>
    <h1>새로나온책</h1>
    {loading ? <h1>loading...</h1> 
    : 
      <div>
        {books &&
          books.map((book, index) => (
            <div key={index}>
              <img
                src={book.cover.replace(/coversum/g, 'cover')}
                alt={book.title}
              />
              <span>{book.title}</span>
              <p>{book.author}</p>
              <p>{book.publisher}</p>
              <a href={book.link}>상품 보러가기</a>
          </div>
          ))}
      </div>
    }


    </>
  )
}

export default NewbookPage