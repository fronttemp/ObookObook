import create from 'zustand'
import { persist } from 'zustand/middleware'

interface UserImgStoreState {
  userImgToken: string | null
  setUserImgToken: (token: string) => void
  removeUserImgToken: () => void
}

const useUserImgStore = create(
  persist<UserImgStoreState>(
    set => ({
      userImgToken: localStorage.getItem('userImgToken') || null,
      setUserImgToken: token => {
        set({ userImgToken: token })
        localStorage.setItem('userImgToken', token)
      },
      removeUserImgToken: () => {
        set({ userImgToken: null })
        localStorage.removeItem('userImgToken')
      }
    }),
    {
      name: 'userImgToken',
      getStorage: () => localStorage
    }
  )
)

export default useUserImgStore
