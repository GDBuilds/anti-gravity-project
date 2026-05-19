import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(240,0,255,0.12) 0%, transparent 70%)' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo with pulse ring */}
        <div className="relative">
          {/* Outer pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary-500/30"
            animate={{
              scale: [1, 1.8, 2.2],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{ width: 72, height: 72, margin: '-4px' }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary-500/20"
            animate={{
              scale: [1, 1.5, 1.8],
              opacity: [0.4, 0.1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            style={{ width: 72, height: 72, margin: '-4px' }}
          />
          
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
            style={{ 
              background: 'linear-gradient(135deg, #00e5ff, #0077ff)',
              boxShadow: '0 0 40px rgba(0, 229, 255, 0.4), 0 0 80px rgba(0, 229, 255, 0.15)',
            }}
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>
        </div>

        {/* Brand name with stagger */}
        <div className="flex items-center gap-1">
          {'Gymshark'.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00e5ff, #f000ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-sm text-slate-500 tracking-wider"
        >
          SMART CRM PLATFORM
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00e5ff, #f000ff, #00e5ff)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </div>
    </div>
  )
}
