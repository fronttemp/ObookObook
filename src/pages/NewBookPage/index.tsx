import axios from 'axios'
import React, { useEffect, useState } from 'react'

const NewbookPage = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    //useEffect를 사용하여 신간 카테고리에 들어오자마자 검색 즉시실행
    (async () => {
      try {
        //신간 쿼리 값은 고정적이기 때문에 변수 사용 x
        const response = await axios.get(`/api/aladinItemSearch?s=ItemList&qt=ItemNewAll`)
        setBooks(response.data.item)
        console.log(response.data.item)
      } catch (error) {
        console.error('Failed to search books', error)
      }
    })();
    }, [])
  
  
  return (
    <>
    <h1>새로나온책</h1>
    {books &&
        books.map((book, index) => (
          <div key={index}>
            <h2>{book.title}</h2>
            <img
              src={book.cover.replace(/coversum/g, 'cover500')}
              alt={book.title}
            />
            <p>{book.author}</p>
            <p>{book.publisher}</p>
            <a href={book.link}>상품 보러가기</a>
          </div>
        ))}
    </>
  )
}

export default NewbookPage