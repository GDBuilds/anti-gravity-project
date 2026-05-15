import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, title, value, change, changeType = 'positive', delay = 0, gradient }) {
  const isPositive = changeType === 'positive'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default"
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${gradient || 'bg-primary-500'}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient ? gradient : 'gradient-primary'} bg-opacity-20`}>
            <Icon size={20} className="text-white" />
          </div>
          {change && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${isPositive ? 'badge-success' : 'badge-danger'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}
