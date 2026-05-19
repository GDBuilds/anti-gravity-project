import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, Users, Target, Bot, BarChart3, FileText,
  CreditCard, MessageCircle, Settings, ChevronLeft, ChevronRight,
  Sparkles, X, FolderOpen
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useApp()
  const location = useLocation()

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${sidebarOpen || isMobile ? 'px-6' : 'px-4 justify-center'} py-6 border-b border-white/5`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Sparkles size={18} className="text-white" />
          </div>
          {(sidebarOpen || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold gradient-text whitespace-nowrap">Gymshark</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Smart CRM Platform</p>
            </motion.div>
          )}
        </div>
        {isMobile && (
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              onClick={() => isMobile && setMobileSidebarOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${isActive
                  ? 'text-white bg-gradient-to-r from-primary-600/20 to-primary-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
                ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full gradient-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={20} className={`shrink-0 ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'} transition-colors`} />
              {(sidebarOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
              {isActive && !sidebarOpen && !isMobile && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-surface-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
                  {label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Button - Desktop only */}
      {!isMobile && (
        <div className="p-3 border-t border-white/5">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm rounded-lg hover:bg-white/5"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] glass-strong z-50"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:block fixed left-0 top-0 bottom-0 glass-strong z-30"
        id="desktop-sidebar"
      >
        {sidebarContent(false)}
      </motion.aside>
    </>
  )
}
