import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import AIFloatingButton from '../ai/AIFloatingButton'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout() {
  const { sidebarOpen } = useApp()
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface-900 relative">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <Sidebar />

      <motion.div
        animate={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (sidebarOpen ? 260 : 72) : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>

      <AIFloatingButton />
    </div>
  )
}
