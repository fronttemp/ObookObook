import {Button} from 'antd'
import { useNavigate } from 'react-router-dom'
import './ItemList.scss'
import AddBookCart from './AddBookCart'

const ItemListInfo = ({books}) => {
  const navigate = useNavigate()


  const moveDetailPage = (isbn) => {
    navigate(`/detail:${isbn}`)
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substring(0, n) + "..." : str;
  }

  return (

      <div className = 'booksInfo'>
        {books.map((book, index) => (
            <div key={index} className = 'bookInfo'>
              <img
                className = 'bookImg'
                src={book.cover.replace(/coversum/g, 'cover200')}
                alt={book.title}
              />
              <div className = 'book'>
                <span className = 'bookTitle'>{truncate(book.title, 40)}</span>
                <p className = 'bookDescription'>{truncate(book.description, 45)}</p>
                {/* <p className = 'bookDescription'>{book.description}</p> */}
                <p className = 'bookAuthor'>{book.author}</p>
                <p className = 'bookPublisher'>{book.publisher}</p>
                <p className = 'bookPrice'>{book.priceSales}원</p>
                {/* <a href={book.link} className = 'bookLink'>상품 보러가기</a> */}
                <div className = 'bookBtn'>
                  <AddBookCart className = 'addBtn' book={book}/>
                  <Button className = 'detailBtn' onClick = {() => moveDetailPage(book.isbn)}>상세보기</Button>
                </div>

              </div>
            </div>
        ))}
      </div>
  )
}

export default ItemListInfo