import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Carousel, Card } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SkeletonBookCard from './SkeletonBookCard';

interface Book {
  title: string;
  author: string;
  cover: string;
  adult: boolean;
  isbn: string;
  // 다른 도서 속성들도 추가할 수 있습니다.
}

const MainPage = () => {
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [bestsellers2, setBestsellers2] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [newRecommendations, setNewRecommendations] = useState<Book[]>([]);
  const [newBestsellers2, setNewBestsellers2] = useState<Book[]>([]);

  const navigate = useNavigate();

  const moveDetailPage = (value: string) => {
    navigate('/Detail', { state: { value } });
  };

  useEffect(() => {
    fetchNewReleases();
    fetchRecommendations();
    fetchBestsellers2();
  }, []);

  useEffect(() => {
    setNewRecommendations(recommendations.filter((a) => !a.adult));
  }, [recommendations]);

  useEffect(() => {
    setNewBestsellers2(bestsellers2.filter((a) => !a.adult).slice(0, 6));
  }, [bestsellers2]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=10&t=56387');
      setRecommendations(response.data.item);
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
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&mr=20');
      setBestsellers2(response.data.item);
    } catch (error) {
      console.error('Failed to fetch bestsellers2', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className='event'>
        <div
          className='event-img'
          style={{ backgroundImage: 'url(/icon.png)' }}
        ></div>
        <div className='event-text'>오북오북은 E-Book 판매 사이트입니다!</div>
      </div>
      <div>
        {loading ? (
          <div className='carousel-container'>
            {[...Array(3)].map((_, index) => (
              <SkeletonBookCard key={index} />
            ))}
          </div>
        ) : (
          <div className='carousel-container'>
            <Carousel slidesToShow={3} autoplay dots={false} infinite swipeToSlide={false} arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} >
              {newRecommendations.map((book, index) => (
                <Card className='carousel-item' key={index} onClick={() => moveDetailPage(book.isbn)}>
                  <div className='carousel-item-image-box'>
                    <div className='carousel-item-image' style={{ backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover500')})` }}>
                      <div className='main-item-info'>
                        <div className='main-item-info-desc'>
                          <h3>{book.title.split('-')[0]}</h3>
                          <p>
                            {book.author.split('(')[0].length > 8
                              ? `${book.author.split('(')[0].slice(0, 8)}...`
                              : book.author.split('(')[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Carousel>
          </div>
        )}
      </div>
      <div className='listBox'>
        <div className='list'>
          <div className='headSection'>
            <div className='title__text'>새로나온 책</div>
            <div className='linkbutton'>
              <Link to='./NewBook'>더보기</Link>
            </div>
          </div>
          <div className='itemsBox'>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <SkeletonBookCard key={index} />
              ))
            ) : (
              newReleases.map((book, index) => (
                <div className='items' key={index} onClick={() => moveDetailPage(book.isbn)}>
                  <div className='card' style={{ backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover200')})` }}></div>
                  <div className='item-desc'>
                    <p className='item-title'>
                      {book.title.length > 8 ? `${book.title.slice(0, 10)}…` : book.title}
                    </p>
                    <p className='item-author'>
                      {book.author.split('(')[0].length > 8
                        ? `${book.author.split('(')[0].slice(0, 8)}...`
                        : book.author.split('(')[0]}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className='list'>
          <div className='headSection'>
            <div className='title__text'>베스트셀러</div>
            <div className='linkbutton'>
              <Link to='./Bestseller'>더보기</Link>
            </div>
          </div>
          <div className='itemsBox'>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <SkeletonBookCard key={index} />
              ))
            ) : (
              newBestsellers2.map((book, index) => (
                <div className='items' key={index} onClick={() => moveDetailPage(book.isbn)}>
                  <div className='card' style={{ backgroundImage: `url(${book.cover.replace(/coversum/g, 'cover200')})` }}></div>
                  <div className='item-desc'>
                    <p className='item-title'>
                      {book.title.length > 8 ? `${book.title.slice(0, 10)}…` : book.title}
                    </p>
                    <p className='item-author'>
                      {book.author.split('(')[0].length > 8
                        ? `${book.author.split('(')[0].slice(0, 8)}...`
                        : book.author.split('(')[0]}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainPage;