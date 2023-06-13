import React, { useState } from 'react'
import axios from 'axios'

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://cors-anywhere.herokuapp.com/http://www.aladin.co.kr/ttb/api/ItemSearch.aspx',
        {
          params: {
            ttbkey: 'ttbrayanami1205001',
            Query: searchTerm,
            QueryType: 'Title',
            MaxResults: 10,
            start: 1,
            SearchTarget: 'Book',
            output: 'JS',
            Version: 20131101
          }
        }
      )

      setBooks(response.data.item)
    } catch (error) {
      console.error('Failed to search books', error)
    }
  }
  console.log(books)
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Aladin Search</button>
      {books.map((book, index) => (
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
