import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    set => ({
      bookCart: [],
      addBookCart: book =>
        set(state => {
          if (state.bookCart.some(b => b.title === book.title)) {
            return state
          }
          return { bookCart: [...state.bookCart, book] }
        }),
      removeBook: book =>
        set(state => ({ bookCart: state.bookCart.filter(b => b !== book) }))
    }),
    { name: 'cart' }
  )
)
