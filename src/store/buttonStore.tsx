import create from 'zustand'

export const handleAddResultsClick = create((set) => ({
  maxResults: 10,
  handleAddResultsClick: () => set((maxResults) => ({maxResults: maxResults + 10}))
}))


// export const useAddResultsStore = create((set) => ({
//   const indexOfLast = currentPage * postsPerPage
//   const indexOfFirst = indexOfLast - postsPerPage
//   const currentBooks = (books) => {
//     let currentBooks = 0;
//     currentBooks = books.slice(indexOfFirst, indexOfLast);
//     return currentBooks;
//   }
// }))
