import React from 'react'
import MainRoutes from './MainRoutes'
import { UserProvider } from './context/UserContext'
import ToastNotification from './components/ToastNotification';
import GrainOverlay from './components/GrainOverlay';

const App = () => {
  return (
    <UserProvider>
      <GrainOverlay />
      <ToastNotification />
      <MainRoutes/>
    </UserProvider>
  )
}

export default App
