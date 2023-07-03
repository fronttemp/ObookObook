### KDT_TEAM5 E-Book 쇼핑몰 팀 프로젝트 
## 오북오북 🐤
<div align="center">

  ![logo](https://github.com/fronttemp/Team5_ToyProject/assets/118456013/413ceef9-f93b-4491-9262-3a54eb3e9c38) 
  
저희 5조는 카카오 페이지를 벤치마킹한 팀프로젝트입니다.<br />
알라딘 공용 book-API를 사용하여 실시간으로 데이터를 불러와서 판매하도록 구현하였습니다.<br />
더미 데이터로는 구현하기 힘든, 실시간으로 업데이트 되는 현실적인 사이트 제작을 목표로 작업하였습니다. ☘️ <br />

배포 주소: https://team5-toy-project-5n2h-b5un8w6mb-fronttemp.vercel.app/

</div>



## 업무 분배 👤

| 팀원 | 안태욱 | 임승이 | 정재현 | 이정환 | 백지욱 |
|------|-------|-------|--------|-------|-------|
| 깃허브 | [@dotory0829](https://github.com/dotory0829) | [@doitidey](https://github.com/doitidey) | [@iskra17](https://github.com/iskra17) | [@fronttemp](https://github.com/fronttemp) | [@beakjiuk](https://github.com/beakjiuk) |
| 담당 | - 회원가입<br /> - 로그인 <br /> - 마이 페이지 | - 레이아웃 및 UI <br /> - 상품리스트 | - 카트페이지<br /> - 결제 및 계좌 기능 | - 깃 팀장 <br /> - API수정 <br /> - 상품 검색 | - 메인 페이지 |


### 사용 기술
[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/) 
[![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/)
[![Zustand](https://img.shields.io/badge/-Zustand-FF9E0F?logo=zustand&logoColor=white)](https://github.com/pmndrs/zustand)


### 페이지 기능 🔎
---
<b>< 메인 페이지 ></b>
- [헤더]
  - 로고
  - 검색 기능
  - 로그인, 회원가입 페이지 이동
  - 로그인시 로그아웃 기능으로 변화 및 프로필 이미지
  - 장바구니 페이지
- [배너]
  - 베스트 셀러 및 신규 도서 (실시간) 슬라이드 구성
- [푸터]
  - 푸터

<b>< 로그인 페이지 ></b>
- [로그인 기능]
  - 비회원일 경우 회원가입 페이지 이동 기능

<b>< 회원가입 페이지 ></b>
- [회원가입 기능]
  - 회원가입 기능

<b>< 마이 페이지 ></b>
- [내정보 수정기능]
  - 프로필 이미지, 비밀번호 및 닉네임 변경 기능
- [주문 내역기능]
  - 주문 내역 확인, 주문 확정 및 취소 기능
- [계좌 기능]
  - 계좌 설정 기능
  - 계좌 해지 기능
  - 잔액 확인 기능

<b>< 장바구니 페이지 ></b>
  - 원하는 도서를 단권뿐만아니라 카트에 담아두고 묶음으로 구매가능

<b>< 베스트 셀러 페이지 ></b>
  - 알라딘 api를 사용하여 실시간 베스트 셀러 확인 가능
  - 단, 몇몇 부적절한 검색결과는 자체 필터링 처리

<b>< 새로나온 책 페이지 ><b/>
  - 알라딘 api를 사용하여 신규 도서 실시간 확인 가능
  - 단, 몇몇 부적절한 검색결과는 자체 필터링 처리

<b>< 검색 결과 페이지 ></b>
  - 원하는 도서 검색 기능 구현
  - 검색 후 나오는 도서에 따라 정렬 기능 구현

### 폴더 구조 📁
```
/TEAM5_TOYPROJECT
┣ vercel
┣ api
┃┗ aladinItemSearch.ts
┃┗ heropy.ts
┣ node_modules
┣ public
┣ src
┃┣ api
┃┃┗ accountApi.tsx
┃┃┗ productApi.tsx
┃┃┗ usersApi.tsx
┃┣ comopnents
┃┃┗ AddBookCart.tsx
┃┃┗ AddBookPurchase.tsx
┃┃┗ BanksInfo.css
┃┃┗ BanksInfo.tsx
┃┃┗ ConfirmModal.tsx
┃┃┗ ItemListInfo.tsx
┃┃┗ ItemSortMenu.tsx
┃┃┗ TagSearchMenu.tsx
┃┃┗ TheFooter.tsx
┃┃┗ TheHeader.tsx
┃┃┣ pages
┃┃┃┗ AccountPage
┃┃┃┗ AdminPage
┃┃┃┗ BestsellerPage
┃┃┃┗ CartPage
┃┃┃┗ CheckoutPage
┃┃┃┗ DetailPage
┃┃┃┗ EditBankInfoPage
┃┃┃┗ EditUserInfoPage
┃┃┃┗ MainPage
┃┃┃┗ NewBookPage
┃┃┃┗ OrderHistoryPage
┃┃┃┗ SearchPage
┃┃┃┗ SigninPage
┃┃┃┗ SignupPage
┃┃┣ Store
┃┃┃┗ buttonStore.tsx
┃┃┃┗ useAccountTokenStore.tsx
┃┃┃┗ useCartStore.tsx
┃┃┃┗ useItemApi.tsx
┃┃┣ App.scss
┃┃┣ App.tsx
┃┃┣ hooks.tsx
┃┃┣ main.tsx
┃┃┣ vite-env.d.ts
┣ .eslintrc.cjs
┣ .eslintrc.json
┣ .gitignore
┣ .prettierrc
┣ icon.png
┣ index.html
┣ package-lock.json
┣ package.json
┣ README.md
┣ tsconfig.json
┣ tsconfig.node.json
┣ user.png
┗ vite.config.ts
```
