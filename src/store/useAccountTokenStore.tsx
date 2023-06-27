// 로컬스토리지 토큰 관리 스토어 (유저 정보)
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useAccountTokenStore = create(
  persist(
    set => ({
      loginToken: localStorage.getItem('accountToken') || null,
      setLoginToken: token => {
        set({ loginToken: token })
        localStorage.setItem('accountToken', token)
      },
      setIsLoggedOut: () => {
        set({ loginToken: null })
        localStorage.removeItem('accountToken')
      },
      getIsLoginToken: token => {
        set({ loginToken: token })
        localStorage.getItem('accountToken')
      }
    }),
    {
      name: 'accountToken',
      getStorage: () => localStorage
    }
  )
)

export default useAccountTokenStore
