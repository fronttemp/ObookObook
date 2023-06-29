import {Button} from 'antd'
import { useNavigate } from 'react-router-dom'
import AddBookCart from './AddBookCart'
import { StarFilled } from '@ant-design/icons'
import AddBookPurchase from './AddBookPurchase'

const ItemListInfo = ({books}) => {
  const navigate = useNavigate()
  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state : {value}})
  }
  
  const truncate = (str, n) => {
    return str?.length > n ? str.substring(0, n) + "..." : str;
  }

  return (
      <div className = 'booksInfo'>
        {books.map((book, index) => (
            <div key={index} className = 'bookInfo'>
              <div className="bookInfo_box">
                <div
                  className="bookImg"
                  style={
                    {backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover200')})`}
                  }
                  onClick = {()=>moveDetailPage(book.isbn13)}
                >
                </div>
                <div className = 'book'>
                  <div className="book_top">
                    <div className = 'bookTitle' onClick = {()=>moveDetailPage(book.isbn13)}>{truncate(book.title, 40)}</div>
                    <div className = 'bookAuthor'>{book.author ? book.author+'·' : null} {book.publisher}</div>
                  </div>
                  <div className="book_bottom">
                    <div className="bookreview"><StarFilled /> {book.customerReviewRank}</div>
                    <div className = 'bookPrice'>{book.priceSales}원</div>
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