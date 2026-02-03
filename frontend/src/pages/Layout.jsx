import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ChatInput from '../components/ChatInput'

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#1f232e] via-[#0f1115] to-transparent opacity-70 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full min-h-screen">
        <Header />
        
        <main className="flex-1 flex flex-col items-center justify-center">
          <Hero />
        </main>
        
        <ChatInput />
      </div>
    </div>
  )
}

export default Layout
