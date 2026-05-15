import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, Calendar
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'


const subscriptionPlans = [
  { name: 'Basic Monthly', price: '₹3,000', features: ['Gym access', 'Locker facility', 'Basic equipment'], members: 45, color: '#3b82f6' },
  { name: 'Premium Annual', price: '₹15,000', features: ['All Basic features', 'Group classes', 'Sauna & steam', 'Free parking'], members: 38, color: '#8b5cf6' },
  { name: 'Elite Annual', price: '₹25,000', features: ['All Premium features', 'Personal trainer', 'Nutrition plan', 'Priority booking', 'Guest passes'], members: 17, color: '#a855f7' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl border border-white/10">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: ₹{(p.value / 1000).toFixed(0)}K
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PaymentsPage() {
  const { customers, invoices, updateInvoiceStatus } = useApp()
  const [tab, setTab] = useState('overview')

  const pendingInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'pending')
  const overdueInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'overdue')
  
  const totalCollected = invoices
    .filter(inv => inv.status?.toLowerCase() === 'paid')
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const totalPendingAmt = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
  const totalOverdueAmt = overdueInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  const paymentHistory = months.map((month, index) => {
    const monthInvoices = invoices.filter(inv => new Date(inv.issue_date || inv.created_at).getMonth() === index)
    return {
      month,
      collected: monthInvoices.filter(i => i.status?.toLowerCase() === 'paid').reduce((sum, i) => sum + Number(i.amount || 0), 0),
      pending: monthInvoices.filter(i => i.status?.toLowerCase() === 'pending').reduce((sum, i) => sum + Number(i.amount || 0), 0),
    }
  }).filter((_, i) => i <= currentMonth)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage all payment transactions</p>
        </div>
        <div className="flex items-center gap-2">
          {['overview', 'plans'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'gradient-primary text-white shadow-lg shadow-primary-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, title: 'Total Collected', value: `₹${totalCollected.toLocaleString()}`, change: 'Live', positive: true, bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
              { icon: Clock, title: 'Pending', value: `₹${totalPendingAmt.toLocaleString()}`, change: `${pendingInvoices.length} invoices`, positive: false, bg: 'bg-amber-500/10', color: 'text-amber-400' },
              { icon: AlertTriangle, title: 'Overdue', value: `₹${totalOverdueAmt.toLocaleString()}`, change: `${overdueInvoices.length} invoices`, positive: false, bg: 'bg-red-500/10', color: 'text-red-400' },
              { icon: TrendingUp, title: 'Collection Rate', value: 'Live', change: 'Calculating...', positive: true, bg: 'bg-blue-500/10', color: 'text-blue-400' },
            ].map(({ icon: Icon, title, value, change, positive, bg, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <span className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-slate-400'}`}>{change}</span>
                </div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* Payment Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-1">Payment Collection</h3>
            <p className="text-xs text-slate-400 mb-4">Collected vs pending payments</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pending & Overdue Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-amber-400" />
                <h3 className="font-semibold text-white">Pending Payments</h3>
              </div>
              {pendingInvoices.length > 0 ? (
                <div className="space-y-3">
                  {pendingInvoices.map(inv => {
                    const customer = customers.find(c => c.id === inv.customer_id)
                    return (
                    <div key={inv.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white uppercase">
                          {customer ? customer.name[0] : inv.invoice_number[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{customer ? customer.name : inv.invoice_number}</p>
                          <p className="text-xs text-slate-500">₹{Number(inv.amount).toLocaleString()} • Due {inv.due_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="text-[10px] px-2.5 py-1.5 rounded-lg badge-warning font-medium">Remind</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                          className="text-[10px] px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white font-bold">Receive</motion.button>
                      </div>
                    </div>
                  )})}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No pending payments 🎉</p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-red-400" />
                <h3 className="font-semibold text-white">Overdue Payments</h3>
              </div>
              {overdueInvoices.length > 0 ? (
                <div className="space-y-3">
                  {overdueInvoices.map(inv => {
                    const customer = customers.find(c => c.id === inv.customer_id)
                    return (
                    <div key={inv.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-400 uppercase">
                          {customer ? customer.name[0] : inv.invoice_number[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{customer ? customer.name : inv.invoice_number}</p>
                          <p className="text-xs text-red-400/70">Overdue since {inv.due_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="text-[10px] px-2.5 py-1.5 rounded-lg badge-danger font-medium">Follow Up</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                          className="text-[10px] px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white font-bold">Receive</motion.button>
                      </div>
                    </div>
                  )})}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No overdue payments 🎉</p>
              )}
            </motion.div>
          </div>
        </>
      )}

      {tab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: plan.color }} />
              <div className="relative z-10">
                <div className="w-3 h-3 rounded-full mb-4" style={{ backgroundColor: plan.color }} />
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-white mb-1">{plan.price}<span className="text-sm text-slate-400 font-normal">/{plan.name.includes('Monthly') ? 'mo' : 'yr'}</span></p>
                <p className="text-xs text-slate-500 mb-6">{plan.members} active members</p>
                <div className="space-y-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} style={{ color: plan.color }} />
                      {f}
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-2.5 rounded-xl text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-all">
                  Manage Plan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
