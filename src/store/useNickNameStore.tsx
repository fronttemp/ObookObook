// 로컬스토리지 토큰 관리 스토어 (닉네임)
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useNickNameStore = create(
  persist(
    set => ({
      nickNameToken: localStorage.getItem('nickNameToken') || null,
      setNickNameToken: token => {
        set({ nickNameToken: token })
        localStorage.setItem('nickNameToken', token)
      }
    }),
    {
      name: 'nickNameToken',
      getStorage: () => localStorage
    }
  )
)

export default useNickNameStore
