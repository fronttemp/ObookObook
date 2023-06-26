import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    set => ({
      bookCart: [],
      addBookCart: book =>
        set(state => {
          if (state.bookCart.some(b => b.isbn === book.isbn)) {
            return state
          }
          return { bookCart: [...state.bookCart, {...book, id: book.isbn }]}
        }),
      removeBook: book =>
        set(state => ({ bookCart: state.bookCart.filter(b => b !== book) }))
    }),
    { name: 'cart' }
  )
)
