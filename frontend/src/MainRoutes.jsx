import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './pages/Layout';
import PageTransition from './components/PageTransition';

const SignInPage = React.lazy(() => import('./pages/SignIn'));
const SignUpPage = React.lazy(() => import('./pages/SignUp'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const AuthSuccessPage = React.lazy(() => import('./pages/AuthSuccess'));

const SuspenseFallback = () => (
  <div className="h-screen w-full bg-[#0c0c0e] flex items-center justify-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
      <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-400/50 animate-spin direction-reverse [animation-duration:1.5s]" />
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Layout /></PageTransition>} />
        <Route path="/login" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PageTransition><SignInPage /></PageTransition>
          </React.Suspense>
        } />
        <Route path="/register" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PageTransition><SignUpPage /></PageTransition>
          </React.Suspense>
        } />
        <Route path="/profile" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PageTransition><ProfilePage /></PageTransition>
          </React.Suspense>
        } />
        <Route path="/auth/success" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PageTransition><AuthSuccessPage /></PageTransition>
          </React.Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default MainRoutes
