import {create} from 'zustand'
import axios from 'axios'

export const useSearchApi = create((set) => ({
  books: [],
  fetch: async (searchTerm: string, tag:string, sort:string) => {
    const response = await axios(`/api/aladinItemSearch?s=ItemSearch&mr=50&q=${searchTerm}&t=${tag}&sort=${sort}`)     
    set( { books: response.data.item})
    console.log(response.data.item)
  }
}))  

export const useListApi = create((set) => ({
  books: [],
  fetch: async () => {
    const response = await axios(`/api/aladinItemSearch?s=ItemList&qt=ItemNewAll&mr=50`)
    set( {books: response.data.item})
  }
}))

export const useLookupApi = create((set) => ({
  bookDetail: [],
  fetch: async(id:string) => {
    const response = await axios(`/api/aladinItemSearch?s=ItemLookup&id=${id}&opt=Story,authors,fulldescription,Toc`)
    const bookData = response.data.item[0]
    set( { bookDetail: bookData })
    console.log(bookData)
  }
}))




// const { fetch, books } = useSearchApi()


//   useEffect(() => {
//     if (searchTerm && searchTerm.trim() !== '') {
//       // setLoading(true)
//       fetch(searchTerm, tag)
//       console.log(1)
//     }}, [fetch, searchTerm, tag])