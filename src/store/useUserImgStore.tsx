import create from 'zustand'
import { persist } from 'zustand/middleware'

interface UserImgStoreState {
  userImgToken: string | null
  setUserImgToken: (token: string) => void
}

const useUserImgStore = create(
  persist<UserImgStoreState>(
    set => ({
      userImgToken: localStorage.getItem('userImgToken') || null,
      setUserImgToken: token => {
        set({ userImgToken: token })
        localStorage.setItem('userImgToken', token)
      }
    }),
    {
      name: 'userImgToken',
      getStorage: () => localStorage
    }
  )
)

export default useUserImgStore
