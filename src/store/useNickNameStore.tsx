import create from 'zustand'
import { persist } from 'zustand/middleware'

interface NickNameStoreState {
  nickNameToken: string | null
  setNickNameToken: (token: string) => void
  removeNickNameToken: () => void
}

const useNickNameStore = create(
  persist<NickNameStoreState>(
    set => ({
      nickNameToken: localStorage.getItem('nickNameToken') || null,
      setNickNameToken: token => {
        set({ nickNameToken: token })
        localStorage.setItem('nickNameToken', token)
      },
      removeNickNameToken: () => {
        set({ nickNameToken: null })
        localStorage.removeItem('nickNameToken')
      }
    }),
    {
      name: 'nickNameToken',
      getStorage: () => localStorage
    }
  )
)

export default useNickNameStore
