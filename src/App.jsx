import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import SplashScreen from './components/ui/SplashScreen'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import CustomersPage from './pages/customers/CustomersPage'
import LeadsPage from './pages/leads/LeadsPage'
import AIAssistantPage from './pages/ai/AIAssistantPage'
import InvoicesPage from './pages/invoices/InvoicesPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import WhatsAppPage from './pages/whatsapp/WhatsAppPage'
import SettingsPage from './pages/settings/SettingsPage'
import DocumentsPage from './pages/documents/DocumentsPage'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      <AppProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SplashScreen />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Router>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Dashboard Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/leads" element={<LeadsPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/invoices" element={<InvoicesPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/whatsapp" element={<WhatsAppPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </motion.div>
          )}
        </AnimatePresence>
      </AppProvider>
    </AuthProvider>
  )
}
