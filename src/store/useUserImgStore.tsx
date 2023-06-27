// 로컬스토리지 토큰 관리 스토어 (프로필 이미지)
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useUserImgStore = create(
  persist(
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
