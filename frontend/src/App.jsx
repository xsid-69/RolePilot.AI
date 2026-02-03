import React from 'react'
import MainRoutes from './MainRoutes'
import { UserProvider } from './context/UserContext'
import ToastNotification from './components/ToastNotification';

const App = () => {
  return (
    <UserProvider>
      <ToastNotification />
      <MainRoutes/>
    </UserProvider>
  )
}

export default App