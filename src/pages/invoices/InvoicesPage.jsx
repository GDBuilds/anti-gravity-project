import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/ui/Modal'
import {
  Plus, Download, Eye, FileText, Search, Filter,
  Calendar, DollarSign, Printer, CheckCircle, Clock, AlertTriangle, Link as LinkIcon
} from 'lucide-react'
import FileUpload from '../../components/ui/FileUpload'
import { jsPDF } from 'jspdf'

export default function InvoicesPage() {
  const { invoices, addInvoice, customers } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showPreview, setShowPreview] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({ customer_id: '', amount: '', due_date: '', status: 'pending', invoice_url: null })

  const filtered = invoices.filter(inv => {
    const customer = customers.find(c => c.id === inv.customer_id)
    const customerName = customer ? customer.name.toLowerCase() : ''
    const matchSearch = customerName.includes(search.toLowerCase()) || (inv.invoice_number || inv.id).toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || inv.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchSearch && matchStatus
  })

  const statusIcon = (status) => {
    const map = { Paid: CheckCircle, Pending: Clock, Overdue: AlertTriangle }
    return map[status] || Clock
  }

  const statusBadge = (status) => {
    const s = status?.toLowerCase()
    const map = { paid: 'badge-success', pending: 'badge-warning', overdue: 'badge-danger' }
    return map[s] || 'badge-info'
  }

  const totalPaid = invoices.filter(i => i.status?.toLowerCase() === 'paid').length
  const totalPending = invoices.filter(i => i.status?.toLowerCase() === 'pending').length
  const totalOverdue = invoices.filter(i => i.status?.toLowerCase() === 'overdue').length

  const handleAddInvoice = (e) => {
    e.preventDefault()
    if (!formData.customer_id) return alert('Please select a customer')
    const invoice_number = `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    addInvoice({ ...formData, invoice_number })
    setShowAddModal(false)
    setFormData({ customer_id: '', amount: '', due_date: '', status: 'pending', invoice_url: null })
  }

  const downloadAttachment = (url, filename) => {
    try {
      const downloadUrl = new URL(url)
      // Supabase uses this parameter to set Content-Disposition
      downloadUrl.searchParams.set('download', `${filename || 'Invoice'}.pdf`)
      
      const link = document.createElement('a')
      link.href = downloadUrl.toString()
      link.setAttribute('download', `${filename || 'Invoice'}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      window.open(url, '_blank')
    }
  }

  const handleDownloadPDF = () => {
    if (selectedInvoice?.invoice_url) {
      downloadAttachment(selectedInvoice.invoice_url, selectedInvoice.invoice_number)
      return
    }

    const element = document.getElementById('invoice-preview-content')
    if (!element) return

    try {
      setIsGenerating(true)
      
      const pdf = new jsPDF()
      
      // Header
      pdf.setFontSize(22)
      pdf.setTextColor(15, 23, 42)
      pdf.text('INVOICE', 20, 30)
      
      pdf.setFontSize(10)
      pdf.setTextColor(100, 116, 139)
      pdf.text('ClientFlow AI', 20, 45)
      pdf.text('123 MG Road, Mumbai, India', 20, 50)
      
      pdf.setFontSize(12)
      pdf.setTextColor(15, 23, 42)
      pdf.text(`Invoice #: ${selectedInvoice.invoice_number}`, 120, 30)
      pdf.setFontSize(10)
      pdf.setTextColor(100, 116, 139)
      pdf.text(`Date: ${selectedInvoice.issue_date || selectedInvoice.created_at?.split('T')[0]}`, 120, 38)
      pdf.text(`Due Date: ${selectedInvoice.due_date}`, 120, 44)
      
      pdf.setDrawColor(226, 232, 240)
      pdf.line(20, 60, 190, 60)
      
      const customer = customers.find(c => c.id === selectedInvoice.customer_id)
      pdf.setFontSize(10)
      pdf.setTextColor(100, 116, 139)
      pdf.text('Bill To:', 20, 75)
      pdf.setFontSize(12)
      pdf.setTextColor(15, 23, 42)
      pdf.text(customer?.name || 'Unknown', 20, 82)
      
      // Table Header
      pdf.setFillColor(241, 245, 249)
      pdf.rect(20, 100, 170, 10, 'F')
      pdf.setFontSize(10)
      pdf.setFont(undefined, 'bold')
      pdf.setTextColor(100, 116, 139)
      pdf.text('Description', 25, 107)
      pdf.text('Amount', 175, 107, { align: 'right' })
      
      // Table Row
      pdf.setFont(undefined, 'normal')
      pdf.setTextColor(15, 23, 42)
      pdf.text(customer?.plan || 'Custom Plan', 25, 120)
      pdf.text(`Rs ${Number(selectedInvoice.amount).toLocaleString()}`, 175, 120, { align: 'right' })
      
      pdf.setDrawColor(226, 232, 240)
      pdf.line(20, 130, 190, 130)
      
      pdf.setFont(undefined, 'bold')
      pdf.text('Total:', 140, 140)
      pdf.text(`Rs ${Number(selectedInvoice.amount).toLocaleString()}`, 175, 140, { align: 'right' })
      
      pdf.save(`${selectedInvoice.invoice_number}.pdf`)
    } catch (err) {
      console.error('Failed to generate PDF', err)
      alert('Failed to generate PDF. You can try the Print option instead.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-slate-400 mt-1">{invoices.length} total invoices</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25 flex items-center gap-2"
          id="create-invoice-btn">
          <Plus size={16} /> Create Invoice
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Paid', count: totalPaid, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending', count: totalPending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Overdue', count: totalOverdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ label, count, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{label} Invoices</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((invoice, i) => {
          const StatusIcon = statusIcon(invoice.status)
          const customer = customers.find(c => c.id === invoice.customer_id)
          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <FileText size={16} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{invoice.invoice_number}</p>
                    <p className="text-[10px] text-slate-500">{invoice.issue_date || invoice.created_at?.split('T')[0]}</p>
                  </div>
                </div>
                <span className={`${statusBadge(invoice.status)} text-[10px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 capitalize`}>
                  <StatusIcon size={10} /> {invoice.status}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Customer</p>
                  <p className="text-sm text-white font-medium">{customer ? customer.name : 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Amount</p>
                  <p className="text-sm text-primary-400 font-bold">₹{Number(invoice.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Due: {invoice.due_date}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setSelectedInvoice(invoice); setShowPreview(true) }}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                    <Eye size={16} />
                  </button>
                  {invoice.invoice_url && (
                    <button onClick={() => downloadAttachment(invoice.invoice_url, invoice.invoice_number)} disabled={isGenerating} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 disabled:opacity-50">
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Desktop View - Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden md:block glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Invoice', 'Customer', 'Plan', 'Amount', 'Date', 'Due Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice, i) => {
                const StatusIcon = statusIcon(invoice.status)
                const customer = customers.find(c => c.id === invoice.customer_id)
                return (
                  <motion.tr key={invoice.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-primary-400" />
                        <span className="text-sm font-medium text-white">{invoice.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">{customer ? customer.name : 'Unknown'}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{customer ? customer.plan : '-'}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white">₹{Number(invoice.amount).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{invoice.issue_date || invoice.created_at?.split('T')[0]}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{invoice.due_date}</td>
                    <td className="px-5 py-4">
                      <span className={`${statusBadge(invoice.status)} text-xs px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1.5 capitalize`}>
                        <StatusIcon size={12} /> {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedInvoice(invoice); setShowPreview(true) }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Preview">
                          <Eye size={14} />
                        </button>
                        {invoice.invoice_url && (
                          <button onClick={() => downloadAttachment(invoice.invoice_url, invoice.invoice_number)} disabled={isGenerating} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all inline-flex disabled:opacity-50" title="Download PDF">
                            <Download size={14} />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Print">
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Invoice Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Invoice" size="md">
        <form onSubmit={handleAddInvoice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Customer</label>
            <select value={formData.customer_id} onChange={(e) => setFormData(p => ({ ...p, customer_id: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300" required>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount (₹)</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
              placeholder="5000" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
            <input type="date" value={formData.due_date} onChange={(e) => setFormData(p => ({ ...p, due_date: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Attach Document</label>
            <div className="flex items-center gap-3">
              <FileUpload 
                bucket="uploads"
                pathPrefix="invoices"
                accept=".pdf,.doc,.docx,.jpg,.png"
                label="Upload Invoice"
                onUploadSuccess={(url) => setFormData(p => ({ ...p, invoice_url: url }))}
                className="flex-1"
              />
              {formData.invoice_url && <span className="text-sm text-success-500 flex items-center gap-1"><CheckCircle size={14}/> Attached</span>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10">Cancel</button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2 gradient-primary rounded-xl text-sm font-medium text-white shadow-lg shadow-primary-500/25">Create Invoice</motion.button>
          </div>
        </form>
      </Modal>

      {/* Invoice Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Invoice Preview" size="lg">
        {selectedInvoice && (
          <div className="space-y-6" id="invoice-preview-content">
            {/* Invoice Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold gradient-text">ClientFlow AI</h2>
                <p className="text-xs text-slate-400 mt-1">FitLife Gym & Wellness Center</p>
                <p className="text-xs text-slate-500">123 MG Road, Mumbai, India</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-white">{selectedInvoice.invoice_number}</h3>
                <p className="text-xs text-slate-400 mt-1">Date: {selectedInvoice.issue_date || selectedInvoice.created_at?.split('T')[0]}</p>
                <p className="text-xs text-slate-400">Due: {selectedInvoice.due_date}</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-slate-400 mb-1">Bill To</p>
              <p className="text-sm font-semibold text-white">{customers.find(c => c.id === selectedInvoice.customer_id)?.name || 'Unknown'}</p>
            </div>

            {/* Invoice Items */}
            <div className="glass-light rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-sm text-slate-200">{customers.find(c => c.id === selectedInvoice.customer_id)?.plan || 'Custom Plan'}</td>
                    <td className="px-4 py-3 text-sm text-white text-right font-medium">₹{Number(selectedInvoice.amount).toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-white">Total</td>
                    <td className="px-4 py-3 text-lg font-bold text-white text-right">₹{Number(selectedInvoice.amount).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between" data-html2canvas-ignore>
              <span className={`${statusBadge(selectedInvoice.status)} text-sm px-4 py-2 rounded-xl font-medium capitalize`}>{selectedInvoice.status}</span>
              <div className="flex gap-3">
                <button onClick={handlePrint} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2">
                  <Printer size={14} /> Print
                </button>
                <button onClick={handleDownloadPDF} disabled={isGenerating} className="px-4 py-2 gradient-primary rounded-xl text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50">
                  <Download size={14} /> {isGenerating ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
