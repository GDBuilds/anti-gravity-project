import React from 'react'
import { motion } from 'framer-motion'

export function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-6 rounded-lg" />
      </div>
      <div className="skeleton w-24 h-4 rounded" />
      <div className="skeleton w-32 h-8 rounded" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="skeleton w-48 h-6 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-0">
          <div className="skeleton w-8 h-8 rounded-full" />
          <div className="skeleton flex-1 h-4 rounded" />
          <div className="skeleton w-20 h-4 rounded" />
          <div className="skeleton w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl gradient-glow flex items-center justify-center mb-4">
        <Icon size={32} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="px-6 py-2.5 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
