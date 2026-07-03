import { Buffer } from 'buffer'
// Solana web3.js expects Node's Buffer global — polyfill it for the browser.
window.Buffer = window.Buffer || Buffer

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
