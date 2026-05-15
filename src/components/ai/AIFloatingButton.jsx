import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, User, Loader2 } from 'lucide-react'

const suggestedPrompts = [
  'Show inactive customers',
  'Generate renewal reminder',
  'Create promotional message',
  'Summarize monthly analytics',
  'Suggest follow-up for leads',
]

const aiResponses = {
  'show inactive customers': `📊 **Inactive Customers Report**\n\nI found **3 inactive customers** who haven't visited in the last 30 days:\n\n1. **Rahul Verma** — Last visit: 15 days ago, Membership expired\n2. **Karan Mehta** — Last visit: 20 days ago, Payment overdue\n3. **Nisha Kapoor** — Last visit: 12 days ago, Membership expired\n\n💡 **Recommendation:** Send them a re-engagement WhatsApp message with a special 20% renewal discount. Shall I draft the message?`,
  'generate renewal reminder': `✉️ **Renewal Reminder Template**\n\nHi **{{name}}**! 👋\n\nYour **{{plan}}** membership at FitLife Gym expires on **{{date}}**.\n\nRenew now and get:\n🎯 10% early bird discount\n💪 Free personal training session\n🏋️ Access to new CrossFit zone\n\nRenew here: {{link}}\n\nSee you at the gym! 💪\n\n*This message has been optimized for a 23% higher response rate based on your past campaigns.*`,
  'create promotional message': `🎉 **Promotional Campaign Draft**\n\n**Summer Fitness Challenge 2024! ☀️💪**\n\nJoin our 30-day transformation challenge!\n\n✅ Expert-guided workout plans\n✅ Nutrition counseling included\n✅ Win prizes worth ₹50,000\n✅ Free body composition analysis\n\n🔥 Limited to 50 spots!\n📅 Starts: June 1st\n💰 Only ₹2,999 (Regular: ₹5,999)\n\nRegister now: {{link}}\n\n*Estimated reach: 450 contacts | Expected conversion: 12-15%*`,
  'summarize monthly analytics': `📈 **Analytics Summary**\n\n**Revenue:** ₹0\n**New Members:** 0\n**Renewals:** 0/0\n**Active Leads:** 0\n\n**Top Insights:**\n⚪️ No data available for the current period.\n\n**Recommendations:**\n1. Add your first customer to see analytics!`,
  'suggest follow-up for leads': `🎯 **Lead Follow-up Suggestions**\n\n**Priority Leads (Action needed today):**\n\n1. **Pooja Bhatt** (Negotiation)\n   → Send family package pricing comparison\n   → Schedule facility tour for this weekend\n\n2. **Suresh Pandey** (Interested)\n   → Trial session completed ✅\n   → Call to discuss membership options\n\n3. **Rajesh Kumar** (New Lead)\n   → Send welcome email with gym brochure\n   → Offer free trial session\n\n*Following up within 24 hours increases conversion by 35%*`,
}

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! 👋 I\'m your AI business assistant. I can help you with customer insights, generate messages, analyze your data, and more. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSend = async (text = input) => {
    if (!text.trim()) return

    const userMsg = text.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => userMsg.toLowerCase().includes(k))
      const response = key
        ? aiResponses[key]
        : `I understand you're asking about "${userMsg}". Let me analyze your business data...\n\n📊 Based on your current metrics:\n- Customer base: 0 active members\n- Monthly revenue: ₹0\n- Lead conversion rate: 0%\n\nWould you like me to help you add your first lead or customer?`

      setMessages(prev => [...prev, { role: 'ai', content: response }])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30 z-50 pulse-glow"
            id="ai-assistant-toggle"
          >
            <Bot size={24} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] glass-strong rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden max-sm:w-[calc(100%-2rem)] max-sm:left-4 max-sm:right-4 max-sm:bottom-4 max-sm:h-[80vh]"
            id="ai-chat-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 gradient-primary">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                  <p className="text-[10px] text-white/70">Powered by ClientFlow AI</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-all"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'gradient-primary text-white rounded-br-md'
                      : 'bg-white/5 text-slate-200 rounded-bl-md border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                      <User size={14} className="text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestedPrompts.map(prompt => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:bg-primary-500/20 transition-all"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about your business..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500"
                  id="ai-chat-input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="p-2.5 gradient-primary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  id="ai-chat-send"
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
