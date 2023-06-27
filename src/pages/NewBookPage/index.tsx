import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TagSearchMenu from '../../components/TagSearchMenu'
import AddBookCart from '../../components/AddBookCart'

const NewBookPage = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/api/aladinItemSearch?s=ItemList&qt=ItemNewAll`)
        setBooks(response.data.item)
        console.log(response.data.item)
      } catch (error) {
        console.error('Failed to search books', error)
      }
    })();
    }, [])
  
  
  return (
    <section>
    <h1>새로나온책</h1>
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
            <AddBookCart book={book}/>
          </div>
        ))}
    </section>
  )
}

export default NewBookPage