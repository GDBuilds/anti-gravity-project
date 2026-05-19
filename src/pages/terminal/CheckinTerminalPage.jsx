import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { 
  Scan, CheckCircle, AlertTriangle, Search, Clock, 
  ArrowRight, ShieldCheck, ShieldAlert, Zap, Flame, User, Play, Square 
} from 'lucide-react'

export default function CheckinTerminalPage() {
  const { customers } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [scanState, setScanState] = useState('idle') // 'idle' | 'scanning' | 'success' | 'denied'
  const [checkins, setCheckins] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundCooldown = useRef(false)

  // Web Audio Context for Futuristic Sci-Fi Sound Effects
  const playBeep = (type) => {
    if (!soundEnabled || soundCooldown.current) return
    soundCooldown.current = true
    setTimeout(() => { soundCooldown.current = false }, 300)

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      
      if (type === 'scan') {
        // High pitched laser sweep sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      } else if (type === 'success') {
        // Futuristic double chime (chime of approval)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain1 = ctx.createGain()
        const gain2 = ctx.createGain()
        
        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
        gain1.gain.setValueAtTime(0.1, ctx.currentTime)
        gain1.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        
        osc1.start()
        osc1.stop(ctx.currentTime + 0.3)
      } else if (type === 'error') {
        // Cyber alarm/error sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(180, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4)
        osc.start()
        osc.stop(ctx.currentTime + 0.4)
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e)
    }
  }

  // Filter customers matching search
  const filteredCustomers = searchQuery.trim() === '' ? [] : customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  )

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setSearchQuery('')
    setScanState('idle')
  }

  const triggerScan = () => {
    if (!selectedCustomer) return
    setScanState('scanning')
    playBeep('scan')

    // Simulate scanning delay
    setTimeout(() => {
      const isApproved = selectedCustomer.status?.toLowerCase() === 'active'
      if (isApproved) {
        setScanState('success')
        playBeep('success')
        // Add to check-in log
        setCheckins(prev => [
          {
            id: Date.now(),
            name: selectedCustomer.name,
            plan: selectedCustomer.plan || 'Basic Plan',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: 'approved'
          },
          ...prev
        ])
      } else {
        setScanState('denied')
        playBeep('error')
        // Add to check-in log
        setCheckins(prev => [
          {
            id: Date.now(),
            name: selectedCustomer.name,
            plan: selectedCustomer.plan || 'Expired Plan',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: 'denied'
          },
          ...prev
        ])
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scan className="text-primary-400 animate-pulse" size={26} /> Gymshark Security Terminal
          </h1>
          <p className="text-sm text-slate-400 mt-1">High-tech check-in interface & membership authorization HUD</p>
        </div>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
            soundEnabled 
              ? 'border-primary-500/30 bg-primary-500/10 text-primary-400 shadow-md shadow-primary-500/10' 
              : 'border-white/10 bg-white/5 text-slate-500'
          }`}
        >
          🔊 Cyber Audio: {soundEnabled ? 'ONLINE' : 'MUTED'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search & Member Selector */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 bg-primary-500" />
          
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">1. Identify Member</h3>
          
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search member name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            {/* Search results dropdown */}
            <AnimatePresence>
              {filteredCustomers.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-surface-950 border border-white/10 rounded-xl max-h-60 overflow-y-auto z-20 shadow-2xl divide-y divide-white/5"
                >
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.phone || 'No phone'}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                        customer.status?.toLowerCase() === 'active' 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                          : 'border-red-500/30 bg-red-500/10 text-red-400'
                      }`}>
                        {customer.status || 'Inactive'}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Member Preview Card */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {selectedCustomer ? (
                <motion.div
                  key={selectedCustomer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-light p-4 rounded-xl border border-white/5 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-primary-500/10">
                      <User className="text-primary-400" size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{selectedCustomer.name}</h4>
                      <p className="text-xs text-slate-400">{selectedCustomer.plan || 'Custom Plan'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-white/5 text-xs text-slate-400">
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Phone</p>
                      <p className="font-semibold text-white mt-0.5">{selectedCustomer.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Renewal Date</p>
                      <p className="font-semibold text-white mt-0.5">{selectedCustomer.renewalDate || '-'}</p>
                    </div>
                  </div>

                  <button
                    onClick={triggerScan}
                    disabled={scanState === 'scanning'}
                    className="w-full py-3 gradient-primary rounded-xl text-sm font-semibold text-white shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-primary-500/40 transition-shadow"
                  >
                    Authorize Access <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 px-4 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <User className="text-slate-600 animate-pulse" size={32} />
                  <p className="text-xs text-slate-500">No member selected</p>
                  <p className="text-[10px] text-slate-600">Search for a client in the input above to begin check-in.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Column: Futuristic Neon Scanner Interface */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Futuristic scanner framing */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary-500/40 rounded-tl" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary-500/40 rounded-tr" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary-500/40 rounded-bl" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary-500/40 rounded-br" />

          <h3 className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Scanner HUD</h3>

          <div className="relative w-64 h-64 flex items-center justify-center mt-4">
            
            {/* Holographic Glowing Scanner Circle */}
            <div className="absolute inset-0 rounded-full border border-white/10 flex items-center justify-center">
              <motion.div 
                className="w-56 h-56 rounded-full border border-dashed border-primary-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Sweep radar lines */}
            <AnimatePresence>
              {scanState === 'scanning' && (
                <>
                  {/* Moving scanning bar */}
                  <motion.div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent shadow-[0_0_12px_#00e5ff]"
                    initial={{ top: '10%' }}
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Pulse ring */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-primary-400/40"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Scanner Status Message */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <AnimatePresence mode="wait">
                {scanState === 'idle' && (
                  <motion.div 
                    key="idle" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                      <Scan size={36} />
                    </div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Ready to Scan</span>
                  </motion.div>
                )}

                {scanState === 'scanning' && (
                  <motion.div 
                    key="scanning" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/30 text-primary-400">
                      <Scan size={36} className="animate-pulse" />
                    </div>
                    <span className="text-xs text-primary-400 uppercase tracking-widest font-semibold animate-pulse">Scanning Bio-Data...</span>
                  </motion.div>
                )}

                {scanState === 'success' && (
                  <motion.div 
                    key="success" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <ShieldCheck size={48} />
                    </div>
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider mt-1">ACCESS GRANTED</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Welcome, {selectedCustomer?.name?.split(' ')[0]}</span>
                  </motion.div>
                )}

                {scanState === 'denied' && (
                  <motion.div 
                    key="denied" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <ShieldAlert size={48} />
                    </div>
                    <span className="text-sm font-bold text-red-400 uppercase tracking-wider mt-1">ACCESS DENIED</span>
                    <span className="text-[10px] text-red-500/80 uppercase tracking-widest font-semibold animate-pulse">Membership Expired</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Live Access Logs */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 relative overflow-hidden max-h-[432px]">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 bg-accent-500" />
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-slate-500" /> Security Logs
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">
              Live Feed
            </span>
          </div>

          {/* Logs container */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/5">
            <AnimatePresence initial={false}>
              {checkins.length > 0 ? (
                checkins.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      log.status === 'approved' 
                        ? 'border-emerald-500/10 bg-emerald-500/5' 
                        : 'border-red-500/10 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'approved' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-xs font-semibold text-white">{log.name}</p>
                        <p className="text-[10px] text-slate-400">{log.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-500">{log.time}</p>
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${
                        log.status === 'approved' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {log.status === 'approved' ? 'OK' : 'DENIED'}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 py-20 border border-dashed border-white/5 rounded-xl">
                  <Clock className="text-slate-700" size={24} />
                  <p className="text-[10px] text-slate-500">No events logged today</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}
