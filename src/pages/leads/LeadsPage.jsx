import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/ui/Modal'
import {
  Plus, Phone, Mail, Calendar, Tag, DollarSign,
  User, MessageSquare, GripVertical, Eye
} from 'lucide-react'

const stages = [
  { id: 'new', label: 'New Lead', color: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'interested', label: 'Interested', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'negotiation', label: 'Negotiation', color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'converted', label: 'Converted', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'lost', label: 'Lost', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30' },
]

export default function LeadsPage() {
  const { leads, updateLeadStage, addLead } = useApp()
  const [selectedLead, setSelectedLead] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: 'Website', value: '', notes: '' })

  const handleDragStart = (lead) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e, stageId) => {
    e.preventDefault()
    setDragOverStage(stageId)
  }

  const handleDrop = (e, stageId) => {
    e.preventDefault()
    if (draggedLead) {
      updateLeadStage(draggedLead.id, stageId)
    }
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const handleAddLead = (e) => {
    e.preventDefault()
    addLead({
      ...formData,
      stage: 'new',
      followUp: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      assignedTo: 'Sales Team'
    })
    setShowAddModal(false)
    setFormData({ name: '', email: '', phone: '', source: 'Website', value: '', notes: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Pipeline</h1>
          <p className="text-sm text-slate-400 mt-1">{leads.length} total leads • Drag cards to update stage</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25 flex items-center gap-2"
          id="add-lead-btn">
          <Plus size={16} /> Add Lead
        </motion.button>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
        {/* Mobile Stage Selector */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
          {stages.map(stage => {
            const count = leads.filter(l => l.stage === stage.id).length
            const isActive = dragOverStage === stage.id || (!dragOverStage && stage.id === 'new') // Default to 'new' for now or handle active stage state
            return (
              <button
                key={stage.id}
                onClick={() => setDragOverStage(stage.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  dragOverStage === stage.id 
                    ? 'bg-primary-500/20 border-primary-500 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {stage.label} ({count})
              </button>
            )
          })}
        </div>

        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.id)
          const isDragOver = dragOverStage === stage.id
          
          // On mobile, only show the selected stage if one is selected, otherwise show all in a stack or horizontal
          // For now, let's keep it horizontal but improve the container
          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              className={`min-w-[300px] lg:min-w-[280px] w-full lg:w-[280px] flex-shrink-0 rounded-2xl transition-all duration-200 ${
                isDragOver ? 'ring-2 ring-primary-500/50 bg-primary-500/5' : ''
              } ${dragOverStage && dragOverStage !== stage.id ? 'hidden lg:block' : ''}`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between px-4 py-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3 px-1 min-h-[200px]">
                <AnimatePresence>
                  {stageLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onDragEnd={handleDragEnd}
                      className={`glass rounded-xl p-4 cursor-grab active:cursor-grabbing group hover:border-primary-500/30 transition-all ${
                        draggedLead?.id === lead.id ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical size={14} className="text-slate-600 opacity-0 lg:group-hover:opacity-100 transition-opacity" />
                          <h4 className="text-sm font-medium text-white">{lead.name}</h4>
                        </div>
                        <button onClick={() => { setSelectedLead(lead); setShowDetailModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                          <Eye size={16} />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-slate-500" />
                          <span>{lead.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={12} className="text-slate-500" />
                          <span className="text-emerald-400 font-medium">{lead.value}</span>
                        </div>
                        {lead.followUp && (
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-500" />
                            <span>Follow-up: {lead.followUp}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                            <User size={10} className="text-white" />
                          </div>
                          <span className="text-[11px] text-slate-500">{lead.assignedTo}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stageLeads.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-slate-600 border-2 border-dashed border-white/5 rounded-xl">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead" size="md">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Lead Source</label>
              <select value={formData.source} onChange={(e) => setFormData(p => ({ ...p, source: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
                <option>Website</option><option>Referral</option><option>Instagram</option><option>Facebook</option><option>Google Ads</option><option>Walk-in</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Deal Value</label>
            <input type="text" value={formData.value} onChange={(e) => setFormData(p => ({ ...p, value: e.target.value }))}
              placeholder="₹15,000" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Notes about this lead..." rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10">Cancel</button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25">Add Lead</motion.button>
          </div>
        </form>
      </Modal>

      {/* Lead Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Lead Details" size="md">
        {selectedLead && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-white">
                {selectedLead.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedLead.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stages.find(s => s.id === selectedLead.stage)?.color }} />
                  <span className="text-xs text-slate-400">{stages.find(s => s.id === selectedLead.stage)?.label}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: 'Email', value: selectedLead.email },
                { icon: Phone, label: 'Phone', value: selectedLead.phone },
                { icon: Tag, label: 'Source', value: selectedLead.source },
                { icon: DollarSign, label: 'Value', value: selectedLead.value },
                { icon: Calendar, label: 'Follow-up', value: selectedLead.followUp || 'N/A' },
                { icon: User, label: 'Assigned', value: selectedLead.assignedTo },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/3 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1"><Icon size={14} /><span className="text-xs">{label}</span></div>
                  <p className="text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
            {selectedLead.notes && (
              <div className="bg-white/3 rounded-xl p-3">
                <div className="flex items-center gap-2 text-slate-400 mb-1"><MessageSquare size={14} /><span className="text-xs">Notes</span></div>
                <p className="text-sm text-slate-200">{selectedLead.notes}</p>
              </div>
            )}
            <div className="flex gap-3">
              <select
                value={selectedLead.stage}
                onChange={(e) => updateLeadStage(selectedLead.id, e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300"
              >
                {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
