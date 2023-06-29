import {useState, useEffect} from 'react'
import axios from 'axios'
import ItemListInfo from '../../components/ItemListInfo'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

const BestsellerPage = () => {
  const [loading, setLoading] =useState(false)
  const [bestSeller, setBestSeller] = useState([])
  const [newBestSeller, setNewBestSeller] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [trackPerPage, setTrackPerPage] = useState(10)
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  const fetchBestseller = async () => {
    try {
      const response = await axios.get('/api/aladinItemSearch?s=ItemList&qt=Bestseller&st=eBook&mr=50');
      setBestSeller(response.data.item)
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  }

  useEffect(() => {
    fetchBestseller()
  }, [])

  useEffect(() => {
    setNewBestSeller(bestSeller.filter(item => item.adult !== true ).slice(0, 10))
  }, [bestSeller])

  const indexOfLastTrack = currentPage * trackPerPage;
  const indexOfFirstTrack = indexOfLastTrack - trackPerPage;
  const currentBooks = newBestSeller.slice(indexOfFirstTrack, indexOfLastTrack);

  console.log(currentBooks)

  return (
    <section>
      <div className='page_title'>베스트셀러</div>
      <div className='page_discription'>오늘의 베스트셀러에 등록된 책 리스트입니다.</div>
      {loading ? <div className="loadingAnimation"><Spin indicator={antIcon} /></div>
      :
        <ItemListInfo books = {currentBooks} />
      }
    </section>
  )
}

export default BestsellerPage