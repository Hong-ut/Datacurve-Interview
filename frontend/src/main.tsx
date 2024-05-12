import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CodeExecutionProvider } from './Context'; // adjust the path as necessary

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CodeExecutionProvider>
    <App />
  </CodeExecutionProvider>,
)
