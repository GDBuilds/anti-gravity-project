import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { signIn, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await signIn({ email, password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110" 
          style={{ backgroundImage: 'url("/assets/gym-bg.jpg")' }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-900 relative">
        <div className="bg-orb bg-orb-1" style={{ opacity: 0.08 }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">ClientFlow AI</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your account to continue</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  style={{ paddingLeft: '3.2rem' }}
                  className="w-full pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-primary-500/50 transition-all outline-none"
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingLeft: '3.2rem' }}
                  className="w-full pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-primary-500/50 transition-all outline-none"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full py-3 gradient-primary rounded-xl text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow flex items-center justify-center gap-2 disabled:opacity-70"
              id="login-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all">
              <Globe size={16} />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
