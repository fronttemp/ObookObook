// 로컬스토리지 토큰 관리 스토어 (유저 정보)
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useAccountTokenStore = create(
  persist(
    set => ({
      loginToken: localStorage.getItem('accountToken') || null,
      profileImg: '',
      setLoginToken: token => {
        set({ loginToken: token })
        localStorage.setItem('accountToken', token)
      },
      setIsLoggedOut: () => {
        set({ loginToken: null })
        localStorage.removeItem('accountToken')
      },
      // 우선 만들어 두었으나, 사용하지 않고 있음;;
      getIsLoginToken: token => {
        set({ loginToken: token })
        localStorage.getItem('accountToken')
      },
      setProfileImg: img => set({ profileImg: img })
    }),
    {
      name: 'accountToken',
      getStorage: () => localStorage
    }
  )
)

export default useAccountTokenStore
