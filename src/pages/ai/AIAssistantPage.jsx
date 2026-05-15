import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bot, Send, Sparkles, User, Loader2, Lightbulb,
  BarChart3, MessageSquare, Users, Zap
} from 'lucide-react'

const quickActions = [
  { icon: Users, label: 'Inactive Customers', prompt: 'Show inactive customers' },
  { icon: MessageSquare, label: 'Renewal Reminder', prompt: 'Generate renewal reminder' },
  { icon: Sparkles, label: 'Promo Message', prompt: 'Create promotional message' },
  { icon: BarChart3, label: 'Analytics Summary', prompt: 'Summarize monthly analytics' },
  { icon: Lightbulb, label: 'Follow-up Ideas', prompt: 'Suggest follow-up for leads' },
  { icon: Zap, label: 'Growth Tips', prompt: 'Give me 5 growth strategies for my gym' },
]

const aiResponses = {
  'show inactive customers': `📊 **Inactive Customers Report**\n\nI found **3 inactive customers** who haven't visited in the last 30 days:\n\n1. **Rahul Verma** — Last visit: 15 days ago, Membership expired\n2. **Karan Mehta** — Last visit: 20 days ago, Payment overdue\n3. **Nisha Kapoor** — Last visit: 12 days ago, Membership expired\n\n💡 **Recommendation:** Send them a re-engagement WhatsApp message with a special 20% renewal discount.`,
  'generate renewal reminder': `✉️ **Renewal Reminder Template**\n\nHi **{{name}}**! 👋\n\nYour **{{plan}}** membership at FitLife Gym expires on **{{date}}**.\n\nRenew now and get:\n🎯 10% early bird discount\n💪 Free personal training session\n🏋️ Access to new CrossFit zone\n\nRenew here: {{link}}\n\n*Optimized for 23% higher response rate.*`,
  'create promotional message': `🎉 **Summer Fitness Challenge 2024! ☀️💪**\n\nJoin our 30-day transformation challenge!\n\n✅ Expert-guided workout plans\n✅ Nutrition counseling included\n✅ Win prizes worth ₹50,000\n✅ Free body composition analysis\n\n🔥 Limited to 50 spots!\n📅 Starts: June 1st\n💰 Only ₹2,999 (Regular: ₹5,999)\n\n*Estimated reach: 450 contacts*`,
  'summarize monthly analytics': `📈 **Analytics Summary**\n\n**Revenue:** ₹0\n**New Members:** 0\n**Renewals:** 0/0\n**Active Leads:** 0\n\n**Top Insights:**\n⚪️ No data available for the current period.\n\n**Recommendations:**\n1. Add your first customer to see analytics!`,
  'suggest follow-up for leads': `🎯 **Priority Follow-ups**\n\n**Today:**\n1. **Pooja Bhatt** (Negotiation) → Send family package pricing\n2. **Suresh Pandey** (Interested) → Call to discuss membership\n\n**Tomorrow:**\n3. **Rajesh Kumar** (New) → Send welcome email\n4. **Lakshmi Rao** (New) → Share Zumba class schedule\n\n*Following up within 24 hours increases conversion by 35%*`,
  'give me 5 growth strategies for my gym': `🚀 **5 AI-Powered Growth Strategies**\n\n**1. Referral Program** 🤝\nOffer existing members ₹500 credit for each referral. Based on your data, Ananya Gupta and Deepika Iyer are your most engaged members.\n\n**2. Corporate Partnerships** 🏢\nTarget nearby offices for corporate memberships. Your lead Rajesh Kumar already wants corporate details.\n\n**3. Social Media Transformation Series** 📱\nShowcase member transformations weekly on Instagram. Your engagement rate suggests 15% growth potential.\n\n**4. Off-Peak Pricing** ⏰\nOffer 20% discount for morning batches (6-9 AM). Currently underutilized based on attendance data.\n\n**5. AI-Automated Re-engagement** 🤖\nSet up automated WhatsApp messages for:\n- 7-day inactive members\n- Upcoming renewals\n- Birthday promotions\n\n*Implementing these could increase revenue by 25-35% in 3 months.*`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '👋 Welcome to the **AI Business Assistant**!\n\nI can help you with:\n• Customer insights & reports\n• Marketing message generation\n• Analytics summaries\n• Follow-up recommendations\n• Growth strategies\n\nTry the quick actions below or ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text = input) => {
    if (!text.trim()) return
    const userMsg = text.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => userMsg.toLowerCase().includes(k))
      const response = key ? aiResponses[key]
        : `I understand you're asking about "${userMsg}".\n\n📊 Let me analyze your business data...\n\nBased on your current metrics:\n- **0** active members\n- **₹0** monthly revenue\n- **0%** lead conversion rate\n- **0%** member retention\n\nWould you like me to help you set up your first customer or lead?`

      setMessages(prev => [...prev, { role: 'ai', content: response }])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
        <p className="text-sm text-slate-400 mt-1">Your intelligent business companion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3 glass rounded-2xl flex flex-col h-[calc(100vh-220px)]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">ClientFlow AI</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-slate-400">Online • Ready to assist</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'gradient-primary text-white rounded-br-md'
                    : 'glass-light text-slate-200 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="glass-light rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-2">
                  <span className="text-sm text-slate-400">Thinking</span>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your business, customers, analytics..."
                className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500"
                id="ai-page-input"
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()} disabled={isTyping || !input.trim()}
                className="p-3 gradient-primary rounded-xl text-white disabled:opacity-50 shadow-lg shadow-primary-500/25"
                id="ai-page-send">
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map(({ icon: Icon, label, prompt }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(prompt)}
                className="w-full flex items-center gap-3 px-4 py-3 glass rounded-xl text-left hover:border-primary-500/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <Icon size={16} className="text-primary-400" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
              </motion.button>
            ))}
          </div>

          <div className="glass rounded-xl p-4 mt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">AI Capabilities</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p>• Customer behavior analysis</p>
              <p>• Automated message drafting</p>
              <p>• Revenue forecasting</p>
              <p>• Churn risk prediction</p>
              <p>• Campaign optimization</p>
              <p>• Lead scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
