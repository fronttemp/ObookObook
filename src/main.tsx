import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import store from './store/store'
import { BrowserRouter } from 'react-router-dom'

const root = document.getElementById('root')

if (root !== null) {
  createRoot(root).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}
