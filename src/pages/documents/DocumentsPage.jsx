import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import FileUpload from '../../components/ui/FileUpload'
import { FileText, Download, Trash2, Search, File, FileImage, FileCode } from 'lucide-react'

export default function DocumentsPage() {
  const { documents, addDocument, deleteDocument, customers } = useApp()
  const [search, setSearch] = useState('')

  const filtered = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    (doc.customer_id && customers.find(c => c.id === doc.customer_id)?.name.toLowerCase().includes(search.toLowerCase()))
  )

  const getFileIcon = (url) => {
    const ext = url.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return FileImage
    if (['json', 'js', 'html', 'css', 'jsx'].includes(ext)) return FileCode
    return FileText
  }

  const handleUploadSuccess = (url, fileName) => {
    addDocument({
      name: fileName,
      file_url: url,
      size: 'Unknown',
      customer_id: null, // Attach customer logic could be added here
      created_at: new Date().toISOString()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-sm text-slate-400 mt-1">{documents.length} files stored</p>
        </div>
        <div className="flex items-center gap-3">
          <FileUpload 
            bucket="uploads"
            pathPrefix="documents"
            label="Upload Document"
            onUploadSuccess={handleUploadSuccess}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 max-w-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((doc, i) => {
          const Icon = getFileIcon(doc.file_url)
          return (
            <motion.div
              key={doc.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <button onClick={() => deleteDocument(doc.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white truncate" title={doc.name}>{doc.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">{doc.created_at?.split('T')[0]}</p>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1">
                    <Download size={12} /> Download
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-white/10 rounded-2xl">
            <File size={48} className="mb-4 opacity-50" />
            <p>No documents found</p>
          </div>
        )}
      </div>
    </div>
  )
}
