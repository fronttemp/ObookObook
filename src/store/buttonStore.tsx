import { create } from 'zustand'

interface State {
  maxResults: number;
  handleAddResultsClick: () => void;
}

export const handleAddResultsClick = create<State>((set) => ({
  maxResults: 10,
  handleAddResultsClick: () => set((state) => ({maxResults: state.maxResults + 10}))
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
