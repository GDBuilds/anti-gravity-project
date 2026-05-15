import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { mockCustomers, mockLeads, mockInvoices, mockNotifications, mockActivities } from '../data/mockData'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [customers, setCustomers] = useState([])
  const [leads, setLeads] = useState([])
  const [invoices, setInvoices] = useState([])
  const [documents, setDocuments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activities, setActivities] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  useEffect(() => {
    if (!user) {
      setCustomers(mockCustomers)
      setLeads(mockLeads)
      setInvoices(mockInvoices)
      setDocuments([])
      setNotifications(mockNotifications)
      setActivities(mockActivities)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch Customers
        const { data: custData } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
        if (custData) setCustomers(custData)

        // Fetch Leads
        const { data: leadData } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
        if (leadData) setLeads(leadData)

        // Fetch Invoices
        const { data: invData } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
        if (invData) setInvoices(invData)

        // Fetch Documents
        const { data: docData } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
        if (docData) setDocuments(docData)

        // Fetch Notifications
        const { data: notifData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
        if (notifData) setNotifications(notifData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  // Persistence logic
  React.useEffect(() => {
    localStorage.setItem('cf_customers', JSON.stringify(customers))
  }, [customers])

  React.useEffect(() => {
    localStorage.setItem('cf_leads', JSON.stringify(leads))
  }, [leads])

  React.useEffect(() => {
    localStorage.setItem('cf_invoices', JSON.stringify(invoices))
  }, [invoices])

  React.useEffect(() => {
    localStorage.setItem('cf_revenue', JSON.stringify(revenue))
  }, [revenue])

  const addCustomer = useCallback(async (customer) => {
    if (user) {
      const { data, error } = await supabase.from('customers').insert([{ ...customer, user_id: user.id }]).select()
      if (error) {
        console.error('Insert error:', error)
        alert('Error adding customer: ' + error.message)
      }
      if (!error && data) setCustomers(prev => [data[0], ...prev])
    } else {
      alert('You must be logged in to save to the database!')
      setCustomers(prev => [{ ...customer, id: prev.length + 1 }, ...prev])
    }
  }, [user])

  const updateCustomer = useCallback(async (id, updateData) => {
    if (user) {
      const { error } = await supabase.from('customers').update(updateData).eq('id', id)
      if (error) alert('Error updating: ' + error.message)
      if (!error) setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c))
    } else {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c))
    }
  }, [user])

  const deleteCustomer = useCallback(async (id) => {
    if (user) {
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) alert('Error deleting: ' + error.message)
      if (!error) setCustomers(prev => prev.filter(c => c.id !== id))
    } else {
      setCustomers(prev => prev.filter(c => c.id !== id))
    }
  }, [user])

  const updateLeadStage = useCallback(async (leadId, newStage) => {
    if (user) {
      const { error } = await supabase.from('leads').update({ stage: newStage }).eq('id', leadId)
      if (error) alert('Error updating lead: ' + error.message)
      if (!error) setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l))
    } else {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l))
    }
  }, [user])

  const addLead = useCallback(async (lead) => {
    if (user) {
      const { data, error } = await supabase.from('leads').insert([{ ...lead, user_id: user.id }]).select()
      if (error) alert('Error adding lead: ' + error.message)
      if (!error && data) setLeads(prev => [data[0], ...prev])
    } else {
      alert('You must be logged in to save to the database!')
      setLeads(prev => [{ ...lead, id: prev.length + 1 }, ...prev])
    }
  }, [user])

  const addInvoice = useCallback(async (invoice) => {
    if (user) {
      const { data, error } = await supabase.from('invoices').insert([{ ...invoice, user_id: user.id }]).select()
      if (error) alert('Error adding invoice: ' + error.message)
      if (!error && data) setInvoices(prev => [data[0], ...prev])
    } else {
      alert('You must be logged in to save to the database!')
      setInvoices(prev => [{ ...invoice, id: prev.length + 1 }, ...prev])
    }
  }, [user])

  const addDocument = useCallback(async (document) => {
    if (user) {
      const { data, error } = await supabase.from('documents').insert([{ ...document, user_id: user.id }]).select()
      if (error) alert('Error adding document: ' + error.message)
      if (!error && data) setDocuments(prev => [data[0], ...prev])
    } else {
      alert('You must be logged in to save to the database!')
      setDocuments(prev => [{ ...document, id: prev.length + 1 }, ...prev])
    }
  }, [user])

  const deleteDocument = useCallback(async (id) => {
    if (user) {
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) alert('Error deleting document: ' + error.message)
      if (!error) setDocuments(prev => prev.filter(d => d.id !== id))
    } else {
      setDocuments(prev => prev.filter(d => d.id !== id))
    }
  }, [user])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const updateInvoiceStatus = useCallback(async (invoiceId, newStatus) => {
    if (user) {
      const { error } = await supabase.from('invoices').update({ status: newStatus }).eq('id', invoiceId)
      if (error) alert('Error updating invoice: ' + error.message)
      if (!error) setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    } else {
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    customers, setCustomers, addCustomer, updateCustomer, deleteCustomer,
    leads, setLeads, updateLeadStage, addLead,
    invoices, setInvoices, updateInvoiceStatus, addInvoice,
    documents, setDocuments, addDocument, deleteDocument,
    notifications, markNotificationRead, unreadCount,
    activities,
    sidebarOpen, setSidebarOpen, toggleSidebar,
    mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar,
    theme, toggleTheme,
    searchQuery, setSearchQuery,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
