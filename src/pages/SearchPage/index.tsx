import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {Pagination, Spin} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useSearchApi } from '../../store/useItemApi'
import TagSearchMenu from '../../components/TagSearchMenu'
import ItemListInfo from '../../components/ItemListInfo'
import ItemSortMenu from '../../components/ItemSortMenu'


const SearchPage = () => {
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('')
  const { fetch, books } = useSearchApi() as {fetch: (searchTerm: string, tag: string, sort: string) => Promise<void>, books: Book[]}
  const [currentPage, setCurrentPage] = useState(1)
  const [trackPerPage] = useState(10)

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

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
    id: string;
    priceStandard: number
  }

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



  const handleTagClick = (value: string) => {
    setTag(value)
    console.log(value)
  }

  const handleSortClick = (value: string) => {
    setSort(value)
    console.log(value)
  }


  const indexOfLastTrack = currentPage * trackPerPage;
  const indexOfFirstTrack = indexOfLastTrack - trackPerPage;
  const currentBooks = books.slice(indexOfFirstTrack, indexOfLastTrack);


  const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber)
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }


  return (
    <section>
      <div className='title__text'>' <span className='hilight'>{searchTerm}</span> ' 의 검색결과</div>  
      <div className="filterList">
        <ItemSortMenu onSortChange = {handleSortClick}/>
        <TagSearchMenu onTagClick = {handleTagClick}/>
      </div> 

      {loading ? <div className="loadingAnimation"><Spin indicator={antIcon} /></div>
        :
        <div>
        { books.length > 0 ? 
        <div>
          <div className="pagination">
            <Pagination
            current={currentPage}
            onChange = {paginate}
            pageSize = {10}
            total={books.length}
            />
          </div>          
          <ItemListInfo books = {currentBooks}/> 
          <div className="pagination">
            <Pagination
            current={currentPage}
            onChange ={paginate}
            pageSize = {10}
            total={books.length}
            />
          </div>
        </div>
            : 
            (<div className='noResult'>
              검색 결과가 없습니다.
            </div>)
          }
        </div>
      }
    </section>
  )
}

export default SearchPage