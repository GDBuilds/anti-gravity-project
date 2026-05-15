import React, { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { uploadFile } from '../../lib/storage'

export default function FileUpload({ bucket = 'uploads', pathPrefix = '', onUploadSuccess, accept = "*", label = "Upload File", className = "" }) {
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState('idle') // idle, uploading, success, error
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setStatus('uploading')

    const fileExt = file.name.split('.').pop()
    const fileName = `${pathPrefix ? pathPrefix + '-' : ''}${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const path = `${fileName}`

    const { url, error } = await uploadFile(bucket, path, file)

    setIsUploading(false)
    if (error) {
      setStatus('error')
      console.error(error)
    } else {
      setStatus('success')
      if (onUploadSuccess) onUploadSuccess(url, file.name)
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
      >
        {status === 'uploading' && <Loader2 size={14} className="animate-spin" />}
        {status === 'success' && <CheckCircle size={14} className="text-success-500" />}
        {status === 'error' && <AlertTriangle size={14} className="text-danger-500" />}
        {status === 'idle' && <Upload size={14} />}
        {isUploading ? 'Uploading...' : status === 'success' ? 'Uploaded!' : label}
      </button>
    </div>
  )
}
