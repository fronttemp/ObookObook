import React from 'react'
import Counter from './components/Counter'


(async () => {
  const res = await fetch('/api/aladin', {
    method: 'POST'
  })
  const data = await res.json()
  // console.log(JSON.parse(data.replace(';', '')))
  console.log(JSON.parse(data.replace(/\\|;/g, '')))
})()

// (async () => {
//   const res = await fetch('/api/heropy', {
//     method: 'POST',
//     body: JSON.stringify({
//       url: 'account',
//       email: "thesecon@gmail.com",
//       password: "********"
//     })
//   })
//   const data = await res.json()
//   console.log(JSON.parse(data.replace(';', '')))
// })()


function App() {
  return (
    <div className="container">
      <h1>My Shopping Mall</h1>
      <ul>
        <li>
          
        </li>
      </ul>
      <Counter />
    </div>
  )
}

export default App
