import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/ui/Modal'
import {
  Search, Plus, Filter, MoreHorizontal, Edit, Trash2,
  Eye, Phone, Mail, MapPin, Calendar, ChevronLeft, ChevronRight, Download
} from 'lucide-react'

const initialForm = { name: '', email: '', phone: '', address: '', plan: 'Basic', status: 'Active', paymentStatus: 'Pending', notes: '' }

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp()
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [showActions, setShowActions] = useState(null)
  const perPage = 8

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = (c.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (c.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (c.phone?.includes(search) || false)
      const matchPlan = filterPlan === 'All' || c.plan?.toLowerCase() === filterPlan.toLowerCase()
      const matchStatus = filterStatus === 'All' || c.status?.toLowerCase() === filterStatus.toLowerCase()
      return matchSearch && matchPlan && matchStatus
    })
  }, [customers, search, filterPlan, filterStatus])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editMode && selectedCustomer) {
      updateCustomer(selectedCustomer.id, formData)
    } else {
      const avatar = formData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      addCustomer({ ...formData, avatar, renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], joinDate: new Date().toISOString().split('T')[0] })
    }
    setShowModal(false)
    setFormData(initialForm)
    setEditMode(false)
  }

  const openEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, plan: customer.plan, status: customer.status, paymentStatus: customer.paymentStatus, notes: customer.notes })
    setEditMode(true)
    setShowModal(true)
    setShowActions(null)
  }

  const openView = (customer) => {
    setSelectedCustomer(customer)
    setShowViewModal(true)
    setShowActions(null)
  }

  const handleDelete = (id) => {
    deleteCustomer(id)
    setShowActions(null)
  }

  const statusBadge = (status) => {
    const map = { Active: 'badge-success', Expired: 'badge-danger', Paused: 'badge-warning' }
    return map[status] || 'badge-info'
  }

  const paymentBadge = (status) => {
    const map = { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' }
    return map[status] || 'badge-info'
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-slate-400 mt-1">{customers.length} total customers</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={16} /> Export
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setFormData(initialForm); setEditMode(false); setShowModal(true) }}
            className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25 flex items-center gap-2"
            id="add-customer-btn">
            <Plus size={16} /> Add Customer
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500" id="customer-search" />
        </div>
        <select value={filterPlan} onChange={(e) => { setFilterPlan(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
          <option value="All">All Plans</option>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="Elite">Elite</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        <AnimatePresence>
          {paginated.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {customer.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setShowActions(showActions === customer.id ? null : customer.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                    <MoreHorizontal size={18} />
                  </button>
                  <AnimatePresence>
                    {showActions === customer.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-40 glass-strong rounded-xl shadow-2xl py-1 z-20 border border-white/10">
                        <button onClick={() => openView(customer)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => openEdit(customer)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5">
                          <Trash2 size={14} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Plan</p>
                  <span className="badge-primary text-[10px] px-2 py-0.5 rounded-md font-medium">{customer.plan || 'Basic'}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <span className={`${statusBadge(customer.status)} text-[10px] px-2 py-0.5 rounded-md font-medium capitalize`}>{customer.status || 'Active'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop View - Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden md:block glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Customer', 'Plan', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge-primary text-xs px-2.5 py-1 rounded-lg font-medium">{customer.plan || 'Basic'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`${statusBadge(customer.status)} text-xs px-2.5 py-1 rounded-lg font-medium capitalize`}>{customer.status || 'Active'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button onClick={() => setShowActions(showActions === customer.id ? null : customer.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                        <AnimatePresence>
                          {showActions === customer.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-40 glass-strong rounded-xl shadow-2xl py-1 z-20">
                              <button onClick={() => openView(customer)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                                <Eye size={14} /> View
                              </button>
                              <button onClick={() => openEdit(customer)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => handleDelete(customer.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5">
                                <Trash2 size={14} /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-xs text-slate-500">Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1 ? 'gradient-primary text-white' : 'text-slate-400 hover:bg-white/5'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditMode(false) }} title={editMode ? 'Edit Customer' : 'Add New Customer'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', field: 'email', type: 'email', placeholder: 'john@email.com' },
              { label: 'Phone', field: 'phone', type: 'text', placeholder: '+91 98765 43210' },
              { label: 'Address', field: 'address', type: 'text', placeholder: '123 Main St, City' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <input type={type} value={formData[field]} onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={placeholder} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Membership Plan</label>
              <select value={formData.plan} onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
                <option value="Basic">Basic</option><option value="Premium">Premium</option><option value="Elite">Elite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
                <option value="Active">Active</option><option value="Expired">Expired</option><option value="Paused">Paused</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..." rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10">Cancel</button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25">{editMode ? 'Save Changes' : 'Add Customer'}</motion.button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Customer Details" size="md">
        {selectedCustomer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-xl font-bold text-white">{selectedCustomer.avatar}</div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedCustomer.name}</h3>
                <p className="text-sm text-slate-400">{selectedCustomer.plan} Member</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email', value: selectedCustomer.email },
                { icon: Phone, label: 'Phone', value: selectedCustomer.phone },
                { icon: MapPin, label: 'Address', value: selectedCustomer.address },
                { icon: Calendar, label: 'Renewal', value: selectedCustomer.renewalDate },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/3 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1"><Icon size={14} /><span className="text-xs">{label}</span></div>
                  <p className="text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <span className={`${statusBadge(selectedCustomer.status)} text-xs px-3 py-1.5 rounded-lg font-medium`}>{selectedCustomer.status}</span>
              <span className={`${paymentBadge(selectedCustomer.paymentStatus)} text-xs px-3 py-1.5 rounded-lg font-medium`}>{selectedCustomer.paymentStatus}</span>
            </div>
            {selectedCustomer.notes && (
              <div className="bg-white/3 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-200">{selectedCustomer.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
