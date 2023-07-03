import { useEffect, useState } from 'react';
import { useListApi } from '../../store/useItemApi';
import ItemListInfo from '../../components/ItemListInfo';
import { Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface Book {
  cover: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categoryName: string;
  pubDate: string;
  customerReviewRank: number;
  priceSales: number;
  id: string
  priceStandard: number;
}

const NewBookPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { fetch, books } = useListApi() as {fetch: (() => Promise<void>), books: Book[]}
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [trackPerPage] = useState<number>(10);
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  useEffect(() => {
    setLoading(true);
    fetch().then(() => {
      setLoading(false);
    });
  }, []);

  const indexOfLastTrack: number = currentPage * trackPerPage;
  const indexOfFirstTrack: number = indexOfLastTrack - trackPerPage;
  const currentBooks: Book[] = books.slice(indexOfFirstTrack, indexOfLastTrack);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <div className='page_title'>새로나온책</div>
      <div className='page_discription'>오늘의 새롭게 등록된 책 리스트입니다.</div>
      {loading ? (
        <div className='loadingAnimation'>
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <div>
          <div className='pagination'>
            <Pagination current={currentPage} onChange={paginate} pageSize={10} total={books.length} />
          </div>
          <ItemListInfo books={currentBooks} />
          <div className='pagination'>
            <Pagination current={currentPage} onChange={paginate} pageSize={10} total={books.length} />
          </div>
        </div>
      )}
    </section>
  );
};

export default NewBookPage;