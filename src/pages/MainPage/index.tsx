import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'antd';

const { Meta } = Card;

const MainPage = () => {
  const [quote, setQuote] = useState('');
  const [bestSellers, setBestSellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchRandomQuote();
    fetchBestSellers();
    fetchNewReleases();
    fetchRecommendations();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error('Failed to fetch random quote', error);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller');
      setBestSellers(response.data.item.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch best sellers', error);
    }
  };

  const fetchNewReleases = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=ItemNewAll');
      setNewReleases(response.data.item.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch new releases', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/recommendations');
      setRecommendations(response.data.items.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };

  return (
    <>
      <h1>오늘의 명언</h1>
      <p>{quote}</p>

      <h2>추천 도서</h2>
      <div className="recommendation-container">
        <button className="prev-button">이전</button>
        <div className="recommendation-list">
          <Row gutter={[16, 16]}>
            {recommendations.map((book, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img src={book.cover} alt={book.title} />}
                >
                  <Meta title={book.title} description={book.author} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <button className="next-button">다음</button>
      </div>

      <h2>베스트셀러</h2>
      <Row gutter={[16, 16]}>
        {bestSellers.map((book, index) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img src={book.cover} alt={book.title} />}
            >
              <Meta title={book.title} description={book.author} />
            </Card>
          </Col>
        ))}
      </Row>

      <h2>신간 책</h2>
      <Row gutter={[16, 16]}>
        {newReleases.map((book, index) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img src={book.cover} alt={book.title} />}
            >
              <Meta title={book.title} description={book.author} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default MainPage;
