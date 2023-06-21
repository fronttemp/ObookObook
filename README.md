# 헤더 브런치 2번째 커밋
##  feat: ✨ 헤더푸터 추가, 헤더 검색 api 연동, 신간도서페이지 api 연동

### 변경사항!
1. `aladinItemSearch` api 수정이 있습니다.
    - api 파일을 더 추가하지 않고 request.query 값을 이용해 `url`을 동기적으로 수정하여 검색을 가능하게 했습니다.
2. api 연동
    - header의 input에서 받아온 값을 search page에 useNavigate를 이용해 넘긴 후 검색이 가능하도록 했습니다.
    - 새로나온 책 페이지에 알라딘 api item list 값을 받아올 수 있도록 했습니다.
      api `const response = await axios.get(`/api/aladinItemSearch?s=ItemSearch&q=${searchTerm}`)`
      에서 proxy에 넘기고 싶은 값이 생긴다면 &변수값=할당값 을 추가할 수 있습니다.
        ex) `/api/aladinItemSearch?s=ItemSearch&q=${searchTerm}&hero=spiderman`
3. CSS 적용이 일부 되었습니다. (수정 예정 있습니다.)
4. icon, logo가 추가되었습니다.
5. header, footer가 추가되었습니다.
6. pages의 Signin, Signup 페이지가 추가되었습니다.

### 고민사항 
1. 검색시 자주 사용되는 async 함수를 컴포넌트로 분리 하는게 좋을까?
```const fetchSearch = async () => {
    try {
      const response = await axios.get(`/api/aladinItemSearch?s=ItemSearch&q=${searchTerm}`)
      setBooks(response.data.item)
    } catch (error) {
      console.error('Failed to search books', error)
    }
  }```
2. 서치 후 태그 메뉴를 눌렀을 때 필터링의 방법 고민
    - useNavigate 이용... {'/이동경로', { state: { 키: 값, 키: 값, ... } }
