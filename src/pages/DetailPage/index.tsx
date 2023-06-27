
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddBookCart from '../../components/AddBookCart';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const DetailPage = () => {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation();
  const isbnNum = location.state?.value;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/aladinItemSearch?s=ItemLookUp&id=${isbnNum}&opt=Story,authors,fulldescription,Toc`);
        setBook(response.data.item[0]);
        setLoading(false)
      } catch (error) {
        console.error('Failed to search books', error);
        setLoading(false)
      }
    })();
  }, [isbnNum]);

  function decodeHTMLEntities(text) {
    const element = document.createElement('div');
    element.innerHTML = text;
    return element.textContent;
  }

  function renderDescription(description) {
    const lines = description.split('<BR>');
  
    return lines.map((line, index) => (
      <div key={index}>
        {line.includes('<b>')||line.includes('</b>') ? (
          <strong>{line.replace(/<\/?b>/g, '')}</strong>
        ) : (
          line
        )}
        {index !== lines.length - 1 && <br />}
      </div>
    ));
  }

  return (
    <section>
      {
        <div>
          <div className="title">
            <div className='title__text'>{book.title}</div>
            <div className="shortDetail">
              {book.author} {book.publisher}
            </div>
          </div>
          <div className='img_detail'>
            <div className="cover">
              <img
                src={book.cover.replace(/coversum/g, 'cover500')}
                alt={book.title}
              />
             </div>
            <div className="subDetail">
              <div className="subDetail__content">
                <div className="subDetailBox">
                  <div className='subDetail__title'>별점</div>
                  <div className='subDetail_text'><StarFilled /> {book.customerReviewRank}</div>
                </div>
                <div className="subDetailBox">
                  <div className='subDetail__title'>가격</div>
                  <div className="subDetail__text">{book.priceSales}원</div>
                </div>
                <div className="subDetailBox">
                  <div className='subDetail__title'>내용</div>
                  <div className="subDetail__text">{book.description}</div>
                </div>
              </div>
              <AddBookCart book={book}/>
            </div>
          </div>
         <div className="discription">
            <div className="discriptionBox">
                <div className='discription__title'>책 소개</div>
                <div className="discription__text">{renderDescription(book.fullDescription)}</div>
            </div>
              <div className="discriptionBox">
                <div className='discription__title'>출판사 제공 책 소개</div>
                <div className="discription__text">{renderDescription(book.fullDescription2)}</div>
              </div>
              <div className="discriptionBox">
                <div className='discription__title'>저자 및 역자 소개</div>
                <div className="discription__text">
                  {book.subInfo.authors.map((author, index) => (
                    <div className='author' key={index}>
                      <div className="author__box">
                        <div className='author__name'>{author.authorName}</div>
                        <div className="author__type">{author.authorTypeDesc}</div>
                      </div>
                      <div className="author__info">{decodeHTMLEntities(author.authorInfo)}</div>
                    </div>
                  ))}
                </div>
              </div>
              {book.subInfo.toc ? (
                <div className="discriptionBox">
                  <div className='discription__title'>목차</div>
                  <div className="discription__text"> {book.subInfo.toc} </div>
                </div>
              ) : null}
          </div>
        </div>
      }
    </section>
  )
}

export default DetailPage
