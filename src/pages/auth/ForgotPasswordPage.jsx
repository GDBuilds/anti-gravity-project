import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 relative p-6">
      <div className="bg-orb bg-orb-1" style={{ opacity: 0.08 }} />
      <div className="bg-orb bg-orb-2" style={{ opacity: 0.06 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">ClientFlow AI</h1>
        </div>

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Reset password</h2>
            <p className="text-sm text-slate-400 mb-8">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" id="forgot-email" />
                </div>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading}
                className="w-full py-3 gradient-primary rounded-xl text-sm font-semibold text-white shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                id="forgot-submit">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-slate-400 mb-6">We've sent a password reset link to <span className="text-white font-medium">{email}</span></p>
            <p className="text-xs text-slate-500">Didn't receive it? Check spam folder or <button onClick={() => setSent(false)} className="text-primary-400 hover:text-primary-300">try again</button></p>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
