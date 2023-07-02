import {useState, useEffect} from 'react'
import {Button} from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import AddBookCart from './AddBookCart'
import { StarFilled } from '@ant-design/icons'
import AddBookPurchase from './AddBookPurchase'

const ItemListInfo = ({books}) => {
  const [bestSellerIndex, setBestSellerIndex] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state : {value}})
  }
  
  const truncate = (str, n) => {
    return str?.length > n ? str.substring(0, n) + "..." : str;
  }

  useEffect(() => {
    if(location.pathname === '/Bestseller') {
      setBestSellerIndex(true)    }
  }, [])

  console.log(location.pathname)


  return (
      <div className = 'booksInfo'>
        {books.filter(book => book.priceSales!==0).map((book, index) => (
            <div key={index} className = 'bookInfo'>
              <div className="bookInfo_box">
                {bestSellerIndex ? (<span className = 'bestindex'> {index+1} </span>) : null}
                <div
                  className="bookImg"
                  style={
                    {backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover200')})`}
                  }
                  onClick = {()=>moveDetailPage(book.isbn)}
                >
                </div>
                <div className = 'book'>
                  <div className="book_top">
                    <div className = 'bookTitle' onClick = {()=>moveDetailPage(book.isbn)}>{truncate(book.title, 40)}</div>
                    <div className = 'bookAuthor'>{book.author ? truncate(book.author, 30)+' · ' : null} {book.publisher}</div>
                    <div className="bookTag">{book.categoryName.split('>')[1]}</div>
                    <div className = 'bookPubDate'>{book.pubDate}</div>
                  </div>
                  <div className="book_bottom">
                    <div className="bookreview"><StarFilled /> {book.customerReviewRank}</div>
                    <div className = 'bookPrice'>{book.priceSales.toLocaleString()}원</div>
                  </div>
                </div>
              </div>
              <div className = 'buttonBox'>
                <AddBookCart book={book}/>
                <AddBookPurchase className = 'addBtn' book={book}/>
              </div>
            </div>
        ))}
      </div>
  )
}

export default ItemListInfo