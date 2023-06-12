import React, { useState } from 'react'
import axios from 'axios'

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = async () => {
    const clientId = 'w9YXAESs0F5t1aP5NZgL'
    const clientSecret = 'WWA3zfYuzB'
    try {
      const response = await axios.get(
        'https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/book.json',
        {
          params: {
            query: searchTerm,
            display: 10,
            start: 1,
            sort: 'sim'
          },
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret
          }
        }
      )
      setBooks(response.data.items)
      console.log(books)
    } catch (error) {
      console.error('Failed to search books', error)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Naver Search</button>
      {books.map((book, index) => (
        <div key={index}>
          <h2>{book.title}</h2>
          <img
            src={book.image}
            alt={book.title}
          />
          <p>{book.description}</p>
          <p>Author: {book.author}</p>
          <p>Publisher: {book.publisher}</p>
          <p>ISBN: {book.isbn}</p>
          <p>Price: {book.discount}</p>
          <p>Publication Date: {book.pubdate}</p>
        </div>
      ))}
    </div>
  )
}

export default BookSearch
