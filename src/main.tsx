import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Table from './components/Table.tsx'
import AuthProvider from './provider/authProvider.tsx'
import Login from './components/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Login />
      <Table />
    </AuthProvider>
  </StrictMode>
)
