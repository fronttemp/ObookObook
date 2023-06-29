import { Link, Outlet } from 'react-router-dom'
import './AccountPage.css'
import { useState, ChangeEvent, FormEvent } from 'react'
import useAccountTokenStore from '../../store/useAccountTokenStore'
import { API_HEADER } from '../../api/usersApi'
import './myProfile.css'

const AccountPage = (): JSX.Element => {
  // 유저 정보 스토어
  const {
    loginToken,
    nickNameToken,
    userImgToken,
    setNickNameToken,
    setUserImgToken
  } = useAccountTokenStore(state => state)

  // 닉네임 변경
  const [newNickName, setNewNickName] = useState<string>('')

  async function modifyUserName(e: FormEvent) {
    e.preventDefault()

    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
      {
        method: 'PUT',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          displayName: newNickName
        })
      }
    )
    if (res.ok) {
      setNickNameToken(newNickName)
    }
  }

  function handleNickNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNewNickName(e.target.value)
  }

  // 프로필 변경
  const [newUserImg, setNewUserImg] = useState<string>('')

  async function modifyUserImg(e: FormEvent) {
    e.preventDefault()

    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
      {
        method: 'PUT',
        headers: {
          ...API_HEADER,
          Authorization: `Bearer ${loginToken}`
        },
        body: JSON.stringify({
          profileImgBase64: newUserImg
        })
      }
    )
    if (res.ok) {
      if (newUserImg === '') {
        setUserImgToken('/user.png')
      } else {
        setUserImgToken(newUserImg)
      }
    }
  }

  // 프로필 이미지 업로드
  function uploadImage(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files as FileList
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', e => {
        setNewUserImg(e.target?.result as string)
      })
    }
  }

  return (
    <>
      {/* sidebar */}
      <h1>내 계정</h1>
      <div className="account-page">
        <div className="left-sidebar">
          <Link to="OrderHistory">주문내역</Link>
          <Link to="EditUserInfo">개인정보 수정</Link>
          <Link to="EditBankInfo">계좌관리</Link>
        </div>
        <div className="outlet-container">
          <Outlet />

          {/* /Account/content */}
          <h3>프로필 및 닉네임 변경 페이지</h3>
          <section className="myProfile">
            {/* 프로필 사진 변경 */}
            <form onSubmit={modifyUserImg}>
              <img
                className="userImg"
                src={newUserImg || userImgToken} // false면 userImgToken(현재), true면 newUserImg(변경할 이미지)
              />
              <div className="current-userName">{nickNameToken}</div>
              <div className="imgInputWrap">
                <input
                  className="userImg-input"
                  type="file"
                  onChange={uploadImage}
                />
                <button
                  className="userImg-btn"
                  type="submit">
                  프로필 사진 변경
                </button>
              </div>
            </form>
            {/* 닉네임 변경 */}
            <form onSubmit={modifyUserName}>
              <input
                type="text"
                value={newNickName}
                onChange={handleNickNameChange}
                placeholder="새로운 닉네임을 입력하세요"
              />
              <button type="submit">닉네임 변경</button>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}

export default AccountPage
