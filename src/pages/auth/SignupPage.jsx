import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, User, Building } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function SignupPage() {
  const { signUp, signInWithGoogle, user } = useAuth()
  const [formData, setFormData] = useState({ name: '', business: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            business_name: formData.business,
          }
        }
      })
      if (error) throw error
      alert('Check your email for the confirmation link!')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Error signing up.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-900 relative">
        <div className="bg-orb bg-orb-2" style={{ opacity: 0.08 }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">ClientFlow AI</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-sm text-slate-400 mb-8">Start your 14-day free trial. No credit card required.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input type="text" value={formData.name} onChange={handleChange('name')} placeholder="John Doe"
                    style={{ paddingLeft: '2.8rem' }}
                    className="w-full pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 transition-all outline-none" id="signup-name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Business</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Building size={16} className="text-slate-500" />
                  </div>
                  <input type="text" value={formData.business} onChange={handleChange('business')} placeholder="FitLife Gym"
                    style={{ paddingLeft: '2.8rem' }}
                    className="w-full pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 transition-all outline-none" id="signup-business" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input type="email" value={formData.email} onChange={handleChange('email')} placeholder="you@business.com"
                  style={{ paddingLeft: '2.8rem' }}
                  className="w-full pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 transition-all outline-none" id="signup-email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange('password')} placeholder="Min 8 characters"
                  style={{ paddingLeft: '2.8rem' }}
                  className="w-full pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:bg-white/10 transition-all outline-none" id="signup-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-white/5 border-white/20 text-primary-500" id="signup-terms" />
              <label className="text-xs text-slate-400">
                I agree to the <span className="text-primary-400 cursor-pointer">Terms of Service</span> and <span className="text-primary-400 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading}
              className="w-full py-3 gradient-primary rounded-xl text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow flex items-center justify-center gap-2 disabled:opacity-70"
              id="signup-submit"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or sign up with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all"
              id="signup-google"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110" 
          style={{ backgroundImage: 'url("/assets/gym-bg.jpg")' }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
