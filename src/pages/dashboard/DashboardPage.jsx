import React from 'react'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, CreditCard, AlertCircle, UserPlus,
  TrendingUp, Calendar, Clock, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import { useApp } from '../../context/AppContext'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 shadow-2xl border border-white/10">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { customers, leads, activities, notifications, invoices, updateInvoiceStatus } = useApp()

  const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'active').length
  
  const pendingInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'pending')
  const pendingPaymentsCount = pendingInvoices.length
  
  const newLeads = leads.filter(l => l.stage === 'new').length

  const currentMonth = new Date().getMonth()
  const monthlyRevenue = invoices
    .filter(inv => inv.status?.toLowerCase() === 'paid' && new Date(inv.issue_date || inv.created_at).getMonth() === currentMonth)
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const revenueData = months.map((month, index) => {
    const monthInvoices = invoices.filter(inv => {
      const date = new Date(inv.issue_date || inv.created_at)
      return date.getMonth() === index && inv.status?.toLowerCase() === 'paid'
    })
    const monthRevenue = monthInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
    
    const monthCustomers = customers.filter(c => {
      const date = new Date(c.created_at || new Date())
      return date.getMonth() <= index
    }).length

    return { month, revenue: monthRevenue, customers: monthCustomers }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:border-primary-500/50">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} title="Total Customers" value={customers.length} change="+12%" delay={0.05} gradient="gradient-primary" />
        <StatCard icon={DollarSign} title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} change="Live" delay={0.1} gradient="bg-emerald-500" />
        <StatCard icon={CreditCard} title="Active Subscriptions" value={activeCustomers} change="Live" delay={0.15} gradient="bg-blue-500" />
        <StatCard icon={AlertCircle} title="Pending Payments" value={pendingPaymentsCount} change="Live" changeType={pendingPaymentsCount > 0 ? "negative" : "positive"} delay={0.2} gradient="bg-amber-500" />
        <StatCard icon={UserPlus} title="New Leads" value={newLeads} change="Live" delay={0.25} gradient="bg-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-1">Monthly revenue and customer growth</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-slate-400">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-400" />
                <span className="text-slate-400">Customers</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revenueGradient)" />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#38bdf8" strokeWidth={2} fill="url(#customerGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pending Payments - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Pending Payments</h3>
              <p className="text-xs text-slate-400 mt-1">Click 'Receive' to update dashboard</p>
            </div>
            <CreditCard size={16} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {pendingInvoices.length > 0 ? (
              pendingInvoices.map((invoice, i) => {
                const customer = customers.find(c => c.id === invoice.customer_id)
                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20 uppercase">
                        {customer ? customer.name[0] : invoice.invoice_number[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{customer ? customer.name : invoice.invoice_number}</p>
                        <p className="text-[10px] text-slate-400">Due: {invoice.due_date} • ₹{Number(invoice.amount).toLocaleString()}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                      className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
                    >
                      Receive
                    </motion.button>
                  </motion.div>
                )
              })
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 italic">No pending payments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lead Conversion & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead Conversion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-semibold text-white mb-1">Lead Conversion</h3>
          <p className="text-xs text-slate-400 mb-4">New leads vs converted vs lost</p>
          <ResponsiveContainer width="100%" height={250}>
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Recent Activity</h3>
              <p className="text-xs text-slate-400 mt-1">Latest actions and updates</p>
            </div>
            <button className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-1">
            {activities.length > 0 ? (
              activities.slice(0, 6).map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/3 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.type === 'customer' ? 'bg-primary-500/10 text-primary-400' :
                    activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                    activity.type === 'lead' ? 'bg-blue-500/10 text-blue-400' :
                    activity.type === 'reminder' ? 'bg-amber-500/10 text-amber-400' :
                    activity.type === 'invoice' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    <Clock size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">No recent activity</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Renewals & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Upcoming Renewals</h3>
              <p className="text-xs text-slate-400 mt-1">Memberships expiring soon</p>
            </div>
            <Calendar size={16} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            {customers.filter(c => c.status === 'Active').length > 0 ? (
              customers
                .filter(c => c.status === 'Active')
                .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
                .slice(0, 5)
                .map((customer, i) => {
                  const daysLeft = Math.ceil((new Date(customer.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))
                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.plan} Plan</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        daysLeft <= 3 ? 'badge-danger' : daysLeft <= 7 ? 'badge-warning' : 'badge-success'
                      }`}>
                        {daysLeft}d left
                      </span>
                    </motion.div>
                  )
                })
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">No upcoming renewals</div>
            )}
          </div>
        </motion.div>

        {/* Quick Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Notifications</h3>
              <p className="text-xs text-slate-400 mt-1">Important alerts and updates</p>
            </div>
            <TrendingUp size={16} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className={`flex items-start gap-3 py-2.5 px-3 rounded-xl transition-colors ${!notif.read ? 'bg-primary-500/5' : 'hover:bg-white/3'}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    notif.type === 'danger' ? 'bg-red-400' :
                    notif.type === 'warning' ? 'bg-amber-400' :
                    notif.type === 'info' ? 'bg-blue-400' :
                    'bg-emerald-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{notif.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{notif.time}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">No new notifications</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
