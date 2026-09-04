// src/shared/components/cover-image-upload.tsx
import { Image, X, Plus, AlertCircle } from 'lucide-react'
import { useState, useRef, useId, type ChangeEvent } from 'react'
import { Spinner } from './spinner'
import { Button } from './button'
import clsx from 'clsx'

const MAX_IMAGE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface CoverImageUploadProps {
    onImageSelect: (file: File) => void
    onRemove: () => void
    error?: string
    disabled?: boolean
}

export function CoverImageUpload({ onImageSelect, onRemove, error, disabled }: CoverImageUploadProps) {
    const inputId = useId()
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        processFile(selected)
    }

    const processFile = (selected: File) => {
        setUploadError(null)
        if (!ACCEPTED_TYPES.includes(selected.type)) { setUploadError('Format non supporté — utilise un JPG, PNG ou WEBP.'); return }
        if (selected.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { setUploadError(`Image trop volumineuse (max ${MAX_IMAGE_SIZE_MB} Mo).`); return }

        setIsUploading(true)
        const reader = new FileReader()
        reader.onload = (ev) => { setPreview(ev.target?.result as string); setIsUploading(false); onImageSelect(selected) }
        reader.onerror = () => { setUploadError('Impossible de lire cette image.'); setIsUploading(false) }
        reader.readAsDataURL(selected)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) processFile(dropped)
    }

    const handleRemove = () => {
        setPreview(null); setUploadError(null)
        if (inputRef.current) inputRef.current.value = ''
        onRemove()
    }

    const displayError = error || uploadError

    return (
        <div className="flex flex-col gap-2">
            <input type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleFileChange} ref={inputRef} className="hidden" id={inputId} disabled={disabled || isUploading} />
            {!preview && !isUploading ? (
                <label
                    htmlFor={inputId}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={clsx(
                        'flex flex-col items-center justify-center aspect-square w-full max-w-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                        displayError ? 'border-danger bg-danger/5' : isDragging ? 'border-teal bg-teal/5 scale-[1.02]' : 'border-white/10 hover:border-teal hover:bg-surface/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div className={clsx('w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200', isDragging ? 'bg-teal/20' : 'bg-surface-raised')}>
                        {isDragging ? <Plus className="w-6 h-6 text-teal" /> : <Image className="w-6 h-6 text-muted" />}
                    </div>
                    <span className="font-body text-sm text-ivory mt-2">{isDragging ? 'Relâchez pour déposer' : 'Ajouter une pochette'}</span>
                    <span className="text-xs text-muted mt-0.5">JPG, PNG, WEBP — 5 Mo max</span>
                </label>
            ) : isUploading ? (
                <div className="aspect-square w-full max-w-[200px] flex items-center justify-center border border-white/10 rounded-xl bg-surface-raised"><Spinner size="md" /></div>
            ) : (
                <div className="relative aspect-square w-full max-w-[200px] rounded-xl overflow-hidden border-2 border-teal/30 group">
                    <img src={preview!} alt="Pochette" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handleRemove} aria-label="Retirer la pochette" className="bg-black/50 text-white hover:bg-black/70"><X className="w-4 h-4" />Retirer</Button>
                    </div>
                    <div className="absolute top-2 right-2"><span className="text-[10px] bg-teal/90 text-ink px-2 py-0.5 rounded-full font-medium">✓</span></div>
                </div>
            )}
            {displayError && <div className="flex items-center gap-2 text-xs text-danger"><AlertCircle className="w-3.5 h-3.5" /><span>{displayError}</span></div>}
        </div>
    )
}