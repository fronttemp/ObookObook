import { create} from 'zustand'
import { persist } from 'zustand/middleware'


interface Book {
  id: string;
  isbn: string;
  title: string;
  priceStandard : number;
  cover : string;
   // Book 객체의 다른 속성들을 여기에 추가
}

interface CartStore {
  bookCart: Book[];
  selectedItems: Book[];
  selectSingleBook: (book: Book) => void;
  addBookCart: (book: Book) => void;
  removeBook: (book: Book) => void;
  removeAllBooks: () => void;
  removeSelectedBooks: (selectedIds: string[]) => void;
  saveSelectedItems: (items: string[]) => void;
}


export const useCartStore = create(
  persist<CartStore>(
    set => ({
      bookCart: [],
      selectedItems: [],
      selectSingleBook: book => set(() => ({ selectedItems: [book] })),
      addBookCart: book =>
        set(state => {
          if (state.bookCart.some(b => b.isbn === book.isbn)) {
            return state
          }
          return { bookCart: [...state.bookCart, { ...book, id: book.isbn }] }
        }),
      removeBook: book =>
        set(state => ({ bookCart: state.bookCart.filter(b => b !== book) })),

      removeAllBooks: () => set({ bookCart: [] }),

      removeSelectedBooks: selectedIds =>
        set(state => ({
          bookCart: state.bookCart.filter(b => !selectedIds.includes(b.id))
        })),

      saveSelectedItems: items =>
        set(state => {
          const selectedBooks = state.bookCart.filter(book =>
            items.includes(book.id)
          )
          return { selectedItems: selectedBooks }
        })
    }),
    { name: 'cart' }
  )
)
