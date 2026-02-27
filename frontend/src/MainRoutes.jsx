import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout';
const SignInPage = React.lazy(() => import('./pages/SignIn'));
const SignUpPage = React.lazy(() => import('./pages/SignUp'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const AuthSuccessPage = React.lazy(() => import('./pages/AuthSuccess'));

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={
          <React.Suspense fallback={<div className="h-screen w-full bg-[#030712] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <SignInPage />
          </React.Suspense>
        } />
        <Route path="/register" element={
          <React.Suspense fallback={<div className="h-screen w-full bg-[#030712] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <SignUpPage />
          </React.Suspense>
        } />
        <Route path="/profile" element={
          <React.Suspense fallback={<div className="h-screen w-full bg-[#030712] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <ProfilePage />
          </React.Suspense>
        } />
        <Route path="/auth/success" element={
          <React.Suspense fallback={<div className="h-screen w-full bg-[#0c0c0e] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <AuthSuccessPage />
          </React.Suspense>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default MainRoutes