import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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



  const navigate = useNavigate()


  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state : {value}})
  }

  useEffect(() => {
    fetchRandomQuote();
    fetchNewReleases();
    fetchRecommendations();
  }, []);

  useEffect(()=> {
    setNewRecommendations(recommendations.filter(a => a.adult !== true ))
  }, [recommendations])

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
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=20');
      setRecommendations(response.data.item)
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };

  const fetchNewReleases = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=ItemNewAll&mr=20');
      setNewReleases(response.data.item.slice(0, 12));
    } catch (error) {
      console.error('Failed to fetch new releases', error);
    }
  };


  return (
    <>
      <div>
        <h1>오늘의 명언</h1>
        <p>{quote}</p>
      </div>
      <div>
        <h2>추천 도서</h2>
        <div className="carousel-container">
          <Carousel
            slidesToShow={4}
            autoplay={false}
            dots={ false }
            draggable
            infinite
            swipeToSlide={false}
            arrows prevArrow={<LeftOutlined/>} nextArrow={<RightOutlined/>}>
            {newRecommendations.map((book, index) => (
              <div
              className="carousel-item"
              key={index}
              onClick = {()=>moveDetailPage(book.isbn13)}>
                <Card
                  className="book-card"
                  cover={<img src={book.cover.replace(/coversum/g, 'cover500')} alt={book.title} />}
                >
                  <Card.Meta title={book.title} description={book.author} />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div>
        <h2>신간 책</h2>
        <div className="carousel-container">
          <Carousel
            slidesToShow={4}
            autoplay={false}
            dots={false}
            draggable
            infinite
            swipeToSlide={false}
            arrows prevArrow={<LeftOutlined/>} nextArrow={<RightOutlined/>}>
            {newReleases.map((book, index) => (
              <div
              className="carousel-item"
              key={index}
              onClick = {()=>moveDetailPage(book.isbn13)}>
                <Card
                  className="book-card"
                  cover={<img src={book.cover.replace(/coversum/g, 'cover500')} alt={book.title} />}
                >
                  <Card.Meta title={book.title} description={book.author} />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default MainPage;