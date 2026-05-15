import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Target, DollarSign, Calendar,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import { useApp } from '../../context/AppContext'
const retentionData = [
  { month: 'Jan', rate: 82 }, { month: 'Feb', rate: 85 }, { month: 'Mar', rate: 83 },
  { month: 'Apr', rate: 87 }, { month: 'May', rate: 86 }, { month: 'Jun', rate: 89 },
  { month: 'Jul', rate: 88 }, { month: 'Aug', rate: 91 }, { month: 'Sep', rate: 90 },
  { month: 'Oct', rate: 92 }, { month: 'Nov', rate: 93 }, { month: 'Dec', rate: 95 },
]

const growthData = [
  { month: 'Jan', members: 45, churn: 3 }, { month: 'Feb', members: 52, churn: 2 },
  { month: 'Mar', members: 58, churn: 4 }, { month: 'Apr', members: 65, churn: 3 },
  { month: 'May', members: 72, churn: 2 }, { month: 'Jun', members: 68, churn: 5 },
  { month: 'Jul', members: 78, churn: 3 }, { month: 'Aug', members: 85, churn: 2 },
  { month: 'Sep', members: 92, churn: 4 }, { month: 'Oct', members: 98, churn: 3 },
  { month: 'Nov', members: 105, churn: 2 }, { month: 'Dec', members: 112, churn: 3 },
]

const kpiData = [
  { name: 'Revenue', value: 85, fill: '#7c3aed' },
  { name: 'Retention', value: 92, fill: '#10b981' },
  { name: 'Conversion', value: 48, fill: '#3b82f6' },
  { name: 'Satisfaction', value: 96, fill: '#f59e0b' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl border border-white/10">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}{p.name.includes('rate') || p.name.includes('Rate') ? '%' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { customers, invoices, leads } = useApp()
  const [dateRange, setDateRange] = useState('year')

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  const revenueData = months.map((month, index) => {
    const monthInvoices = invoices.filter(inv => new Date(inv.issue_date || inv.created_at).getMonth() === index && inv.status?.toLowerCase() === 'paid')
    return { month, revenue: monthInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0) }
  }).filter((_, i) => i <= currentMonth)

  const leadConversionData = months.map((month, index) => {
    const monthLeads = leads.filter(l => new Date(l.created_at || new Date()).getMonth() === index)
    return {
      month,
      newLeads: monthLeads.filter(l => l.stage?.toLowerCase() === 'new').length,
      converted: monthLeads.filter(l => l.stage?.toLowerCase() === 'converted').length,
      lost: monthLeads.filter(l => l.stage?.toLowerCase() === 'lost').length
    }
  }).filter((_, i) => i <= currentMonth)

  const subscriptionData = [
    { name: 'Basic', value: customers.filter(c => c.plan === 'Basic' || !c.plan).length, color: '#3b82f6' },
    { name: 'Premium', value: customers.filter(c => c.plan === 'Premium').length, color: '#8b5cf6' },
    { name: 'Elite', value: customers.filter(c => c.plan === 'Elite').length, color: '#a855f7' },
  ].filter(d => d.value > 0) || [{ name: 'None', value: 1, color: '#475569' }] // Fallback if no customers

  const totalMembers = customers.length
  const subscriptionList = subscriptionData.length > 0 && subscriptionData[0].name !== 'None' ? subscriptionData : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Deep dive into your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button key={range} onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateRange === range ? 'gradient-primary text-white shadow-lg shadow-primary-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, title: 'Total Revenue', value: '₹28.5L', change: '+12.5%', positive: true, color: 'from-purple-500/20 to-blue-500/20' },
          { icon: Users, title: 'Customer Retention', value: '92%', change: '+3.2%', positive: true, color: 'from-emerald-500/20 to-teal-500/20' },
          { icon: Target, title: 'Lead Conversion', value: '48%', change: '+5.8%', positive: true, color: 'from-blue-500/20 to-cyan-500/20' },
          { icon: Activity, title: 'Churn Rate', value: '2.8%', change: '-1.2%', positive: true, color: 'from-amber-500/20 to-orange-500/20' },
        ].map(({ icon: Icon, title, value, change, positive, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
            className={`glass rounded-2xl p-5 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-50`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className="text-slate-400" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {change}
                </span>
              </div>
              <p className="text-sm text-slate-400">{title}</p>
              <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Revenue Trends</h3>
          <p className="text-xs text-slate-400 mb-4">Monthly revenue performance</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#analyticsRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Customer Retention</h3>
          <p className="text-xs text-slate-400 mb-4">Monthly retention rate</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rate" name="Retention Rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Lead Conversion & Business Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Lead Conversion Rates</h3>
          <p className="text-xs text-slate-400 mb-4">New leads vs converted vs lost</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadConversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newLeads" name="New Leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Business Growth</h3>
          <p className="text-xs text-slate-400 mb-4">Members vs churn over time</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="membersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="members" name="Total Members" stroke="#3b82f6" strokeWidth={2} fill="url(#membersGradient)" />
              <Line type="monotone" dataKey="churn" name="Churn" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subscription Distribution & KPI Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Subscription Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Active memberships by plan</p>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {subscriptionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {subscriptionList.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{Math.round((item.value / totalMembers) * 100) || 0}% of members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">KPI Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Key performance indicators</p>
          <div className="grid grid-cols-2 gap-4">
            {kpiData.map(({ name, value, fill }) => (
              <div key={name} className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke={fill} strokeWidth="3"
                      strokeDasharray={`${value} ${100 - value}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">{value}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
