
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddBookCart from '../../components/AddBookCart';
import { LoadingOutlined, StarFilled } from '@ant-design/icons';
import axios from 'axios';
import { Spin } from 'antd';
import AddBookPurchase from '../../components/AddBookPurchase';

interface Book {
  title: string;
  author: string;
  publisher: string;
  cover: string;
  customerReviewRank: number;
  categoryName: string;
  isbn: string; 
  priceStandard: number; 
  id: string; 
  priceSales: number;
  description?: string;
  fullDescription?: string;
  fullDescription2?: string;
  subInfo: {
    authors?: Author[];
    toc?: string;
  };
}

interface Author {
  authorName: string;
  authorTypeDesc: string;
  authorInfo: string;
}

const DetailPage = () => {
  const [book, setBook] = useState<Book>({} as Book);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isbnNum = location.state?.value;

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/aladinItemSearch?s=ItemLookUp&id=${isbnNum}&opt=Story,authors,fulldescription,Toc`);
        setBook(response.data.item[0]);
        setLoading(false)
        console.log(1)
      } catch (error) {
        console.error('Failed to search books', error);
        setLoading(false)
      }
    })();
  }, [isbnNum]);

  function decodeHTMLEntities(text: string): string {
    const element = document.createElement('div');
    element.innerHTML = text;
    return element.textContent || '';
  }

  function renderDescription(description: string): JSX.Element[]  {
    const regexpBold = /<\/?\s*b\s*>/gi
    const regexpBR = /<\/?\s*br\s*\/?>/gi
    const regexPha = /<\/?\s*p\s*>/gi

    const lines = description.replace(regexPha, '').split(regexpBR)

    
    return lines.map((line, index) => (
      <div key={index}>
        {line.replace(regexpBR,'').match(regexpBold) ? (
          <strong>{line.replace(/<\/?\s*b\s*>/gi, '')}</strong>
        ) : (
          line
        )}
        {index !== lines.length - 1 && <br />}
      </div>
    ));
  }

  return (
    <section>
      {loading ? <div className="loadingAnimation"><Spin indicator={antIcon} /></div>
      :
        <div>
          <div className="title">
            <div className='title__text'>{book.title}</div>
            <div className="shortDetail">
              {book.author} {book.publisher}
            </div>
          </div>
          <div className='img_detail'>
            <div 
            className="cover"
            style={
              {backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover500')})`}
            }></div>
            <div className="subDetail">
              <div className="subDetail__content">
                <div className="subDetailBox">
                  <div className='subDetail__title'>별점</div>
                  <div className='subDetail_text'> <StarFilled /> {book.customerReviewRank}</div>
                </div>
                <div className="subDetailBox">
                  <div className='subDetail__title'>카테고리</div>
                  <div className="subDetail__text">{book.categoryName.split('>')[1]}</div>
                </div>
                <div className="subDetailBox">
                  <div className='subDetail__title'>가격</div>
                  <div className="subDetail__text">{book.priceSales.toLocaleString()}원</div>
                </div>
                <div className="subDetailBox">
                  <div className='subDetail__title'>내용</div>
                  <div className="subDetail__text">
                    {book.description ? 
                    decodeHTMLEntities(book.description) 
                    : "등록된 내용이 없습니다."}
                  </div>
                </div>
              </div>
              <div className='buttonBox'>
                <AddBookCart book={book}/>
                <AddBookPurchase book={book}/>
              </div>
            </div>
          </div>
          <div className="discription">
            {book.fullDescription ? (
              <div className="discriptionBox">
                <div className='discription__title'>책 소개</div>
                <div className="discription__text">{renderDescription(decodeHTMLEntities(book.fullDescription))}</div>
              </div>
            ) : null}
            {book.fullDescription2 ? (
              <div className="discriptionBox">
                <div className='discription__title'>출판사 제공 책 소개</div>
                <div className="discription__text">{renderDescription(book.fullDescription2)}</div>
              </div>
            ) : null}
            {book.subInfo.authors ? (
              <div className="discriptionBox">
                <div className='discription__title'>저자 및 역자</div>
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
            ) : null}
              {book.subInfo.toc ? (
                <div className="discriptionBox">
                  <div className='discription__title'>목차</div>
                  <div className="discription__text"> {renderDescription(book.subInfo.toc)} </div>
                </div>
              ) : null}
          </div>
        </div>
      }
    </section>
  )
}

export default DetailPage
