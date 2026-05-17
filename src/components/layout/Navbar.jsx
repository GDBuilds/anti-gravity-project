import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import {
  Search, Bell, Moon, Sun, User, ChevronDown,
  LogOut, Settings as SettingsIcon, HelpCircle, Menu
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { 
    theme, toggleTheme, notifications, markNotificationRead, 
    unreadCount, searchQuery, setSearchQuery, sidebarOpen,
    toggleMobileSidebar 
  } = useApp()
  const { user, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const typeColors = { danger: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400', success: 'text-emerald-400' }
  const typeBg = { danger: 'bg-red-500/10', warning: 'bg-amber-500/10', info: 'bg-blue-500/10', success: 'bg-emerald-500/10' }

  return (
    <header className="sticky top-0 z-20 glass border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            id="mobile-menu-toggle"
          >
            <Menu size={20} />
          </button>

          {/* Search - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center max-w-md">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:bg-white/8 transition-all min-w-[200px] lg:min-w-[300px]"
                id="global-search"
              />
            </div>
          </div>

          {/* Mobile Search Icon - Only shown on small screens */}
          <button className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <Search size={18} />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            id="theme-toggle"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              id="notifications-toggle"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 dropdown-menu rounded-2xl shadow-2xl overflow-hidden"
                  id="notifications-panel"
                >
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-primary-400">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <motion.div
                        key={n.id}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 border-b border-white/5 cursor-pointer ${!n.read ? 'bg-primary-500/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-primary-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${typeColors[n.type]}`}>{n.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-white/5">
                    <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors w-full text-center py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all"
              id="profile-dropdown"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white uppercase">
                {user?.user_metadata?.full_name ? user.user_metadata.full_name[0] : user?.email?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-200">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 dropdown-menu rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="font-medium text-sm">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: 'Profile', action: () => navigate('/settings') },
                      { icon: SettingsIcon, label: 'Settings', action: () => navigate('/settings') },
                      { icon: HelpCircle, label: 'Help & Support', action: () => {} },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={() => { action(); setShowProfile(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <button
                      onClick={async () => {
                        await signOut()
                        navigate('/login')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
