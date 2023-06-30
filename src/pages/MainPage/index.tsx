import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Carousel, Card } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Book {
  title: string
  author: string
  cover: string
  adult: boolean
  isb3: string
  // 다른 도서 속성들도 추가할 수 있습니다.
}


const MainPage = () => {
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [newRecommendations, setNewRecommendations] = useState<Book[]>([]);
  const [bestsellers2, setBestsellers2] = useState<Book[]>([]);
  const [newbestsellers2, setnewbestsellers2] = useState<Book[]>([]);
  const [bestsellers2, setBestsellers2] = useState<Book[]>([]);
  const [newbestsellers2, setnewbestsellers2] = useState<Book[]>([]);



  const navigate = useNavigate()


  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state: { value } })
  }

  useEffect(() => {
    fetchNewReleases();
    fetchRecommendations();
    fetchBestsellers2();
    fetchBestsellers2();
  }, []);

  useEffect(() => {
    setNewRecommendations(recommendations.filter(a => a.adult !== true))
  useEffect(() => {
    setNewRecommendations(recommendations.filter(a => a.adult !== true))
  }, [recommendations])

  useEffect(() => {
    setnewbestsellers2(bestsellers2.filter(a => a.adult !== true).slice(0,6))
  }, [bestsellers2])

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=10&t=56387');
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
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=ItemNewAll&mr=10');
      setNewReleases(response.data.item.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch new releases', error);
    }
  };
  const fetchBestsellers2 = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=20');
      setBestsellers2(response.data.item);
    } catch (error) {
      console.error('Failed to fetch bestsellers2', error);
    }
  };

  return (
    <section>
      <div className='event'>
        <div
        className="event-img"
        style={{backgroundImage: 'url(/icon.png)'}}></div>
        <div className='event-text'>오북오북은 E-Book 판매 사이트입니다!</div>
      </div>
      <h2>베스트셀러에세이</h2>
      <br></br>
      <div>
        <div className="carousel-container">
          <Carousel
            slidesToShow={3}
            autoplay
            dots={false}
            infinite
            swipeToSlide={false}
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {newRecommendations.map((book, index) => (
              <Card
                className="carousel-item"
                key={index}
                onClick={() => moveDetailPage(book.isbn)}
              >
                <div className="carousel-item-image-box">
                  <div
                    className="carousel-item-image"
                    style={{backgroundImage:`url(${book.cover.replace(/coversum/g, 'cover500')})`}}>
                    <div className="main-item-info">
                      <div className="main-item-info-desc">
                        <h3>{book.title.split('-')[0]}</h3>
                        <p>{book.author.split('(')[0].length > 8 ? `${book.author.split('(')[0].slice(0,8)}...` : book.author.split('(')[0]}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            ))}
          </Carousel>
        </div>
      </div>
      <div className='listBox'>
        <div className="list">
          <div className="headSection">
            <div className='title__text'>새로나온 책</div>
              <div className="linkbutton">
                <Link to="./NewBook">더보기</Link>
              </div>
          </div>
          <div className="itemsBox">
            {newReleases.map((book, index) => (
              <div className="items" key={index} onClick={()=>moveDetailPage(book.isbn)}>
                <div 
                  className="card"
                  style={{backgroundImage:`url(${book.cover.replace(/coversum/g, 'cover200')})`}}>
                </div>
                <div className="item-desc">
                  <p className='item-title'>{book.title.length > 8 ? `${book.title.slice(0, 10)}…` : book.title}</p>
                  <p className="item-author">{book.author.split('(')[0].length > 8 ? `${book.author.split('(')[0].slice(0,8)}...` : book.author.split('(')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="list">
          <div className="headSection">
            <div className='title__text'>베스트셀러</div>
            <div className="linkbutton">
              <Link to="./Bestsellers">더보기</Link>
            </div>
          </div>
          <div className="itemsBox">
            {newbestsellers2.map((book, index) => (
            <div className="items" key={index} onClick={()=>moveDetailPage(book.isbn)}>
              <div className="card"
              style={{backgroundImage:`url(${book.cover.replace(/coversum/g, 'cover200')})`}}></div>
              <div className="item-desc">
                <p className="item-title">{book.title.length > 8 ? `${book.title.slice(0, 8)}…` : book.title}</p>
                <p className="item-author">{book.author.split('(')[0].length > 8 ? `${book.author.split('(')[0].slice(0,8)}...` : book.author.split('(')[0]}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainPage;