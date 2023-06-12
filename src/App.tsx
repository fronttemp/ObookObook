import React from 'react'
import Counter from './components/Counter'
import NaverSearch from './api/naverBookApi'
import AladinSearch from './api/aladinBookApi'

function App() {
  return (
    <div className="container">
      <h1>My Shopping Mall</h1>
      <Counter />
      <NaverSearch />
      <AladinSearch />
    </div>
  )
}

export default App
