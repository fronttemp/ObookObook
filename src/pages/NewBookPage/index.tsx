import { useEffect, useState } from 'react'
import { useListApi } from '../../store/useItemApi'
import ItemListInfo from '../../components/ItemListInfo'
import {Pagination} from 'antd'

const NewBookPage = () => {
  const [loading, setLoading] = useState(true)
  const {fetch, books} = useListApi()
  const [currentPage, setCurrentPage] = useState(1)
  const [trackPerPage, setTrackPerPage] = useState(10)



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
    <div>
      <h1>새로나온책</h1>
      {loading ? <h2>loading...</h2> 
      :
      <div>
        <ItemListInfo books = {currentBooks}/>
        <Pagination
            defaultCurrent={currentPage}
            onChange ={paginate}
            pageSize = {10}
            total={books.length}
            />
      </div> 
      }
    </div>
  )
}

export default NewBookPage