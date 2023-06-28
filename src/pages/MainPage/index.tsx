import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Carousel, Button, Card } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [quote, setQuote] = useState('');
  const [newReleases, setNewReleases] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendations, setNewRecommendations] = useState([]);

  const navigate = useNavigate()
  const carouselRef = useRef();
  const newReleasesCarouselRef = useRef();


  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state : {value}})
  }



  useEffect(() => {
    fetchRandomQuote();
    fetchNewReleases();
    fetchRecommendations();
  }, []);

  useEffect(()=> {
    setNewRecommendations(recommendations.filter(a => a.adult !== true ).slice(0, 12))

  }, [recommendations])

  console.log(newRecommendations)

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error('Failed to fetch random quote', error);
    }
  };

  const fetchNewReleases = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=ItemNewAll');
      setNewReleases(response.data.item.slice(0, 12));
    } catch (error) {
      console.error('Failed to fetch new releases', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller');
      setRecommendations(response.data.item)
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };


  const handlePrev = () => {
    carouselRef.current.prev();
  }

  const handleNext = () => {
    carouselRef.current.next();
  }

  const handleNewReleasesPrev = () => {
    newReleasesCarouselRef.current.prev();
  }

  const handleNewReleasesNext = () => {
    newReleasesCarouselRef.current.next();
  }
  

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
            ref={carouselRef}
            dots={ false }
            draggable
            infinite
            swipeToSlide={false} >
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
          <div className="carousel-controls">
            <Button
              onClick={handlePrev}
              icon={<CaretLeftOutlined />}
            />
            <Button
              onClick={handleNext}
              icon={<CaretRightOutlined />}
            />
          </div>
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
            ref={newReleasesCarouselRef}>
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
          <div className="carousel-controls">
            <Button
              onClick={handleNewReleasesPrev}
              icon={<CaretLeftOutlined />}
            />
            <Button
              onClick={handleNewReleasesNext}
              icon={<CaretRightOutlined />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;