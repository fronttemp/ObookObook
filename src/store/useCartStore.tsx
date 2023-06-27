import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    set => ({
      bookCart: [],
<<<<<<< HEAD
=======
      selectedItems: [],
>>>>>>> dev
      addBookCart: book =>
        set(state => {
          if (state.bookCart.some(b => b.isbn === book.isbn)) {
            return state
          }
<<<<<<< HEAD
          return { bookCart: [...state.bookCart, {...book, id: book.isbn }]}
        }),
      removeBook: book =>
        set(state => ({ bookCart: state.bookCart.filter(b => b !== book) }))
=======
          return { bookCart: [...state.bookCart, { ...book, id: book.isbn }] }
        }),
      removeBook: book =>
        set(state => ({ bookCart: state.bookCart.filter(b => b !== book) })),
      saveSelectedItems: items =>
        set(state => {
          const selectedBooks = state.bookCart.filter(book =>
            items.includes(book.id)
          )
          return { selectedItems: selectedBooks }
        })
>>>>>>> dev
    }),
    { name: 'cart' }
  )
)
