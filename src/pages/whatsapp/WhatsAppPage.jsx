import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import { mockWhatsAppTemplates } from '../../data/mockData'
import {
  MessageCircle, Send, Clock, Users, Plus,
  Edit, Copy, Calendar, Megaphone, Bell,
  CheckCircle, Zap, Eye, MoreHorizontal
} from 'lucide-react'

const automationRules = [
  { id: 1, name: 'Renewal Reminder - 7 Days', trigger: '7 days before expiry', template: 'Renewal Reminder', status: 'Active', lastRun: '2 hrs ago', sent: 12 },
  { id: 2, name: 'Renewal Reminder - 3 Days', trigger: '3 days before expiry', template: 'Renewal Reminder', status: 'Active', lastRun: '5 hrs ago', sent: 8 },
  { id: 3, name: 'Payment Overdue', trigger: 'Payment overdue > 3 days', template: 'Payment Reminder', status: 'Active', lastRun: '1 day ago', sent: 5 },
  { id: 4, name: 'Welcome New Member', trigger: 'On signup', template: 'Welcome Message', status: 'Active', lastRun: '6 hrs ago', sent: 3 },
  { id: 5, name: 'Birthday Wishes', trigger: 'On birthday', template: 'Birthday Wish', status: 'Paused', lastRun: '3 days ago', sent: 0 },
]

const campaigns = [
  { id: 1, name: 'Summer Fitness Challenge', status: 'Sent', recipients: 450, delivered: 442, read: 380, date: '2024-05-10' },
  { id: 2, name: 'New Zumba Classes', status: 'Scheduled', recipients: 320, delivered: 0, read: 0, date: '2024-05-15' },
  { id: 3, name: 'Referral Program Launch', status: 'Draft', recipients: 0, delivered: 0, read: 0, date: '' },
]

export default function WhatsAppPage() {
  const [tab, setTab] = useState('automation')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showBulkModal, setShowBulkModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp Automation</h1>
          <p className="text-sm text-slate-400 mt-1">Automated messaging and campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-2">
            <Megaphone size={16} /> New Campaign
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Send, title: 'Messages Sent', value: '2,847', change: 'This month', bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
          { icon: CheckCircle, title: 'Delivered', value: '98.5%', change: 'Delivery rate', bg: 'bg-blue-500/10', color: 'text-blue-400' },
          { icon: Eye, title: 'Read Rate', value: '86%', change: '+3% vs last month', bg: 'bg-purple-500/10', color: 'text-purple-400' },
          { icon: Zap, title: 'Active Rules', value: '4', change: '5 total rules', bg: 'bg-amber-500/10', color: 'text-amber-400' },
        ].map(({ icon: Icon, title, value, change, bg, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
            </div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{change}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        {['automation', 'templates', 'campaigns'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              tab === t ? 'border-primary-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Automation Rules */}
      {tab === 'automation' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {automationRules.map((rule, i) => (
            <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.status === 'Active' ? 'bg-emerald-500/10' : 'bg-slate-500/10'}`}>
                  <Zap size={18} className={rule.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{rule.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> {rule.trigger}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><MessageCircle size={10} /> {rule.template}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Last run: {rule.lastRun}</p>
                  <p className="text-xs text-slate-400">{rule.sent} sent recently</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-lg font-medium ${rule.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {rule.status}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockWhatsAppTemplates.map((template, i) => (
            <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 hover:border-primary-500/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-primary text-xs px-2.5 py-1 rounded-lg font-medium">{template.category}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setSelectedTemplate(template); setShowTemplateModal(true) }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><Eye size={14} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><Copy size={14} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><Edit size={14} /></button>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">{template.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{template.message}</p>
              <p className="text-[10px] text-slate-600 mt-3">Last used: {template.lastUsed}</p>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 flex items-center justify-center border-2 border-dashed border-white/10 hover:border-primary-500/30 transition-all cursor-pointer group min-h-[180px]">
            <div className="text-center">
              <Plus size={24} className="mx-auto text-slate-500 group-hover:text-primary-400 transition-colors" />
              <p className="text-sm text-slate-500 mt-2 group-hover:text-slate-300">Create Template</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Campaigns */}
      {tab === 'campaigns' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Campaign', 'Status', 'Recipients', 'Delivered', 'Read Rate', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, i) => (
                <motion.tr key={campaign.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Megaphone size={14} className="text-primary-400" />
                      <span className="text-sm font-medium text-white">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      campaign.status === 'Sent' ? 'badge-success' : campaign.status === 'Scheduled' ? 'badge-info' : 'badge-warning'
                    }`}>{campaign.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-300">{campaign.recipients}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{campaign.delivered}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">
                    {campaign.delivered > 0 ? `${Math.round((campaign.read / campaign.delivered) * 100)}%` : '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{campaign.date || '—'}</td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><MoreHorizontal size={14} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Template Preview Modal */}
      <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Message Template Preview" size="md">
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-primary text-xs px-3 py-1 rounded-lg font-medium">{selectedTemplate.category}</span>
              <p className="text-xs text-slate-500">Last used: {selectedTemplate.lastUsed}</p>
            </div>
            <h3 className="text-lg font-semibold text-white">{selectedTemplate.name}</h3>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">WhatsApp Preview</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{selectedTemplate.message}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2">
                <Copy size={14} /> Copy
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    const res = await fetch('http://localhost:3001/api/whatsapp/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        phone: '+1234567890',
                        message: selectedTemplate.message,
                        templateName: selectedTemplate.name
                      })
                    })
                    const data = await res.json()
                    if (data.success) {
                      alert('✅ Message sent via API! ID: ' + data.messageId)
                      setShowTemplateModal(false)
                    }
                  } catch (e) {
                    alert('Error: Make sure the backend server is running!')
                  }
                }}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-2">
                <Send size={14} /> Use Template
              </motion.button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Message Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Create Campaign" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Campaign Name</label>
            <input type="text" placeholder="e.g., Summer Promotion" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Template</label>
            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
              {mockWhatsAppTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Audience</label>
            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
              <option>All Customers</option>
              <option>Active Members</option>
              <option>Expired Members</option>
              <option>Premium Members</option>
              <option>New Leads</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Schedule Date</label>
              <input type="date" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Schedule Time</label>
              <input type="time" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowBulkModal(false)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10">Cancel</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-2">
              <Calendar size={14} /> Schedule Campaign
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
