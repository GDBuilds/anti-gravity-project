// Fresh data for the CRM application - All mock data cleared
import { format } from 'date-fns'

export const mockCustomers = []

export const mockLeads = []

export const mockInvoices = []

export const mockRevenueData = [
  { month: 'Jan', revenue: 0, customers: 0 },
  { month: 'Feb', revenue: 0, customers: 0 },
  { month: 'Mar', revenue: 0, customers: 0 },
  { month: 'Apr', revenue: 0, customers: 0 },
  { month: 'May', revenue: 0, customers: 0 },
  { month: 'Jun', revenue: 0, customers: 0 },
  { month: 'Jul', revenue: 0, customers: 0 },
  { month: 'Aug', revenue: 0, customers: 0 },
  { month: 'Sep', revenue: 0, customers: 0 },
  { month: 'Oct', revenue: 0, customers: 0 },
  { month: 'Nov', revenue: 0, customers: 0 },
  { month: 'Dec', revenue: 0, customers: 0 },
]

export const mockLeadConversionData = [
  { month: 'Jan', newLeads: 0, converted: 0, lost: 0 },
  { month: 'Feb', newLeads: 0, converted: 0, lost: 0 },
  { month: 'Mar', newLeads: 0, converted: 0, lost: 0 },
  { month: 'Apr', newLeads: 0, converted: 0, lost: 0 },
  { month: 'May', newLeads: 0, converted: 0, lost: 0 },
  { month: 'Jun', newLeads: 0, converted: 0, lost: 0 },
]

export const mockSubscriptionData = [
  { name: 'Basic', value: 0, color: '#3b82f6' },
  { name: 'Premium', value: 0, color: '#8b5cf6' },
  { name: 'Elite', value: 0, color: '#a855f7' },
]

export const mockActivities = []

export const mockNotifications = []

export const mockWhatsAppTemplates = [
  { id: 1, name: 'Renewal Reminder', message: 'Hi {{name}}, your {{plan}} membership expires on {{date}}. Renew now to continue enjoying our facilities! Visit us or call {{phone}}.', category: 'Reminder', lastUsed: 'Never' },
  { id: 2, name: 'Welcome Message', message: 'Welcome to FitLife Gym, {{name}}! 🎉 We\'re excited to have you. Your {{plan}} membership starts today. See you at the gym!', category: 'Onboarding', lastUsed: 'Never' },
  { id: 3, name: 'Payment Reminder', message: 'Hi {{name}}, your payment of {{amount}} is pending. Please clear it by {{date}} to avoid service interruption. Pay now: {{link}}', category: 'Payment', lastUsed: 'Never' },
]
