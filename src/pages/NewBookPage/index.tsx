import { useEffect, useState } from 'react'
import { useListApi } from '../../store/useItemApi'
import ItemListInfo from '../../components/ItemListInfo'
import { Pagination, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

const NewBookPage = () => {
  const [loading, setLoading] = useState(true)
  const { fetch, books } = useListApi()
  const [currentPage, setCurrentPage] = useState(1)
  const [trackPerPage, setTrackPerPage] = useState(10)
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;


  useEffect(() => {
    setLoading(true)
    fetch()
      .then(() => {
        setLoading(false)
      })
  }, [])

  const indexOfLastTrack = currentPage * trackPerPage;
  const indexOfFirstTrack = indexOfLastTrack - trackPerPage;
  const currentBooks = books.slice(indexOfFirstTrack, indexOfLastTrack);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)


  console.log(currentBooks)


  return (
    <section>
      <div className='page_title'>새로나온책</div>
      <div className='page_discription'>오늘의 새롭게 등록된 책 리스트입니다.</div>
      {loading ? <div className="loadingAnimation"><Spin indicator={antIcon} /></div>
      :
      <div>
        <ItemListInfo books = {currentBooks}/>
        <div className="pagination">
          <Pagination
          defaultCurrent={currentPage}
          onChange ={paginate}
          pageSize = {10}
          total={books.length}
          />
        </div>
      </div> 
      }
    </section>
  )
}

export default NewBookPage