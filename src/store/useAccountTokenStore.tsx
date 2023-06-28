
// 로컬스토리지 토큰 관리 스토어 (유저 정보)
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AccountTokenStore {
  loginToken: string | null
  userImgToken: string | null
  nickNameToken: string | null
  setLoginToken: (token: string) => void
  setIsLoggedOut: () => void
  getIsLoginToken: (token: string) => void
  setUserImgToken: (token: string) => void
  removeUserImgToken: () => void
  setNickNameToken: (token: string) => void
  removeNickNameToken: () => void
}

const useAccountTokenStore = create(
  persist<AccountTokenStore>(
    set => ({
      loginToken: localStorage.getItem('accountToken') || null,
      userImgToken: localStorage.getItem('userImgToken') || null,
      nickNameToken: localStorage.getItem('nickNameToken') || null,
      // 로그인
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
      },

      // 프로필 이미지
      setUserImgToken: token => {
        set({ userImgToken: token })
        localStorage.setItem('userImgToken', token)
      },
      removeUserImgToken: () => {
        set({ userImgToken: null })
        localStorage.removeItem('userImgToken')
      },

      // 유저 이름
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
      name: 'accountToken',
      getStorage: () => localStorage
    }
  )
)

export default useAccountTokenStore
