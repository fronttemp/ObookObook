import { useEffect, useState } from 'react';
import { useLookupApi } from '../../store/useItemApi';

const DetailPage = ({ isbn }) => {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);

  const { fetch } = useLookupApi();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        await fetch(isbn);
        setLoading(false);
        console.log(book)

      } catch (error) {
        console.error('Failed to fetch book details:', error);
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [fetch, isbn]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!book) {
    return <h1>Failed to fetch book details.</h1>;
  }


  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Publisher: {book.publisher}</p>
      {/* 나머지 상세 정보 표시 */}
    </div>
  );
};

export default DetailPage;