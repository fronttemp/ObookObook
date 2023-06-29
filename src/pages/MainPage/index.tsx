import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Carousel, Card } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';

interface Book {
  title: string
  author: string
  cover: string
  adult: boolean
  isbn13: string
  // 다른 도서 속성들도 추가할 수 있습니다.
}


const MainPage = () => {
  const [quote, setQuote] = useState<string>('');
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [newRecommendations, setNewRecommendations] = useState<Book[]>([]);
  const [bestsellers2, setBestsellers2] = useState<Book[]>([]);
  const [newbestsellers2, setnewbestsellers2] = useState<Book[]>([]);



  const navigate = useNavigate()


  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state: { value } })
  }

  useEffect(() => {
    fetchRandomQuote();
    fetchNewReleases();
    fetchRecommendations();
    fetchBestsellers2();
  }, []);

  useEffect(() => {
    setNewRecommendations(recommendations.filter(a => a.adult !== true))
  }, [recommendations])

  useEffect(() => {
    setnewbestsellers2(bestsellers2.filter(a => a.adult !== true))
  }, [bestsellers2])

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error('Failed to fetch random quote', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=10&t=56387');
      setRecommendations(response.data.item)
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };

  const fetchNewReleases = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=ItemNewAll&mr=10');
      setNewReleases(response.data.item.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch new releases', error);
    }
  };
  const fetchBestsellers2 = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=10');
      setBestsellers2(response.data.item);
    } catch (error) {
      console.error('Failed to fetch bestsellers2', error);
    }
  };
  console.log(newbestsellers2)

  return (
    <section>
      <div className='today-quote'>
        <div>오늘의 명언</div>
        <p>{quote}</p>
      </div>
      <h2>베스트셀러에세이</h2>
      <br></br>
      <div>
        <div className="carousel-container">
          <Carousel
            slidesToShow={3}
            autoplay={false}
            dots={false}
            draggable
            infinite
            swipeToSlide={false}
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {newRecommendations.map((book, index) => (
              <Card
                className="carousel-item"
                key={index}
                onClick={() => moveDetailPage(book.isbn13)}
              >
                <div className="carousel-item-image">
                  <img src={book.cover.replace(/coversum/g, 'cover500')} alt={book.title} />
                </div>
                <div className="carousel-item-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </Card>
            ))}
          </Carousel>
        </div>
      </div>

      <h2>신간 책</h2>
      <div style={{ textAlign: 'right', margin: '12px 0' }}>
        <Link to="./NewBook">더보기</Link>
      </div>
      <div>
        <div className="carousel-container">
          <Carousel
            slidesToShow={6}
            autoplay={false}
            dots={false}
            draggable
            infinite
            swipeToSlide={false}
          >
            {newReleases.map((book, index) => (
              <div
                className="carousel-item"
                key={index}
                onClick={() => moveDetailPage(book.isbn13)}
              >
                <Card
                  className="ItemNewAll-card"
                  cover={<img src={book.cover.replace(/coversum/g, 'cover200')} />}
                />
                <div className='carousel-item-title'>
                  <p>{book.title.length > 8 ? `${book.title.slice(0, 8)}...` : book.title}</p>
                  <p className='ItemNewAll-author'>{book.author}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      
      <h2>베스트셀러</h2>
        <div style={{ textAlign: 'right', margin: '12px 0' }}>
          <Link to="./Bestsellers">더보기</Link>
        </div>
        <div>
          <div className="carousel-container">
            <Carousel
              slidesToShow={6}
              autoplay={false}
              dots={false}
              draggable
              infinite
              swipeToSlide={false}
            >
              {newbestsellers2.map((book, index) => (
                <div
                  className="carousel-item"
                  key={index}
                  onClick={() => moveDetailPage(book.isbn13)}
                >
                  <Card
                    className="ItemNewAll-card"
                    cover={<img src={book.cover.replace(/coversum/g, 'cover200')} />}
                  />
                  <div className='carousel-item-title'>
                    <p>{book.title.length > 8 ? `${book.title.slice(0, 8)}…` : book.title}</p>
                    <p className='ItemNewAll-author'>{book.author}</p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <h2>자동슬라이드</h2>
        <div style={{ textAlign: 'center', margin: '12px 0' }}>
          <Carousel slidesToShow={1} autoplay>
            <div>
              <h3>열시미하자</h3>
            </div>
            <div>
              <h3>모두화이팅</h3>
            </div>
            <div>
              <h3>ㅎㅎㅎㅎ</h3>
            </div>
          </Carousel>
        </div>
    </section>
  );
};

export default MainPage;