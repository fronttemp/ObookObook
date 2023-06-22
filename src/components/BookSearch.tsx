import React, { useState } from 'react'
import axios from 'axios'

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState(null)

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/aladinItemSearch?q=${searchTerm}`)

      setBooks(response.data.item)
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
      <button onClick={handleSearch}>Aladin Search</button>
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
    </div>
  )
}

export default BookSearch
