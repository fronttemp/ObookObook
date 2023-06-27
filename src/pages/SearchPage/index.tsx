import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import TagSearchMenu from '../../components/TagSearchMenu'
import AddBookCart from '../../components/AddBookCart'

const SearchPage = () => {
  const [books, setBooks] = useState([])
 

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }
  const query = useQuery()
  const searchTerm = query.get('q')

  useEffect(() => {
    if (searchTerm) {
      fetchSearch(searchTerm)
    }
  }, [searchTerm])

  const fetchSearch = async () => {
    try {
      const response = await axios.get(
        `/api/aladinItemSearch?s=ItemSearch&q=${searchTerm}`
      )
      setBooks(response.data.item)
    } catch (error) {
      console.error('Failed to search books', error)
    }
  }

  return (
    <>
      <h1>'{searchTerm}'의 검색결과</h1>
      <TagSearchMenu />
      {books &&
        books.map((book, index) => (
          <div key={index}>
            <img
              src={book.cover.replace(/coversum/g, 'cover500')}
              alt={book.title}
            />
            <h2>{book.title}</h2>
            <p>{book.description}</p>
            <p>{book.author}</p>
            <p>{book.publisher}</p>
            <p>{book.priceStandard}</p>
            <AddBookCart book={book} />
          </div>
        ))}
    </>
  )
}

export default SearchPage
