
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {Pagination, Spin} from 'antd'
import { useSearchApi } from '../../store/useItemApi'
import TagSearchMenu from '../../components/TagSearchMenu'
import ItemListInfo from '../../components/ItemListInfo'
import ItemSortMenu from '../../components/ItemSortMenu'
import { LoadingOutlined } from '@ant-design/icons'


const SearchPage = () => {
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState(null)
  const [sort, setSort] = useState('')
  const { fetch, books } = useSearchApi()
  const [currentPage, setCurrentPage] = useState(1)
  const [trackPerPage, setTrackPerPage] = useState(10)

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;



  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }
  const query = useQuery()
  const searchTerm = query.get('q')

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      setLoading(true)
      fetch(searchTerm, tag, sort)
        .then(() => {
          setLoading(false)
        })
    }
  }, [fetch, searchTerm, tag, sort])



  const handleTagClick = (value) => {
    setTag(value)
    console.log(value)
  }

  const handleSortClick = (value) => {
    setSort(value)
    console.log(value)
  }


  // const handleAddResultsClick = async () => {
  //   setMaxResults(maxResults => maxResults + 10)
  //   await fetch(searchTerm, tag, maxResults)
  //   console.log(books)
  // }

  const indexOfLastTrack = currentPage * trackPerPage;
  const indexOfFirstTrack = indexOfLastTrack - trackPerPage;
  const currentBooks = books.slice(indexOfFirstTrack, indexOfLastTrack);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)


  return (
    <section>
      <h1>'{searchTerm}'의 검색결과</h1>   
      <TagSearchMenu onTagClick = {handleTagClick}/>
      <ItemSortMenu onSortChange = {handleSortClick}/>

      {loading ? <div className="loadingAnimation"><Spin indicator={antIcon} /></div>
        :
        <div>
        { books.length > 0 ? 
        <div>
          <ItemListInfo books = {currentBooks}/> 
          {/* <Button onClick = {handleAddResultsClick}> 더보기 </Button> */}
          <Pagination
            defaultCurrent={currentPage}
            onChange ={paginate}
            pageSize = {10}
            total={books.length}
            />
        </div>
            : 
            (<h1>
              {searchTerm} 검색 결과가 없습니다.
            </h1>)
          }
        </div>
      }
    </section>
  )
}

export default SearchPage