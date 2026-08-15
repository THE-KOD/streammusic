// features/upload/presentation/components/cover-image-upload.tsx
import { useState, useRef } from 'react'
import { Image, X } from 'lucide-react' // Check supprimé
import { Spinner } from '../../../../shared/components/spinner'
import { Button } from '../../../../shared/components/button'
import clsx from 'clsx'

interface CoverImageUploadProps {
    onImageSelect: (file: File) => void
    onRemove: () => void
    error?: string
    disabled?: boolean
}

export function CoverImageUpload({
                                     onImageSelect,
                                     onRemove,
                                     error,
                                     disabled,
                                 }: CoverImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        setUploadError(null)
        setIsUploading(true)

        const reader = new FileReader()
        reader.onload = (ev) => {
            setTimeout(() => {
                setPreview(ev.target?.result as string)
                setIsUploading(false)
                onImageSelect(selected)
            }, 1000)
        }
        reader.readAsDataURL(selected)
    }

    const handleRemove = () => {
        setPreview(null)
        setUploadError(null)
        if (inputRef.current) inputRef.current.value = ''
        onRemove()
    }

    const displayError = error || uploadError

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
                id="cover-upload"
                disabled={disabled || isUploading}
            />

            {!preview && !isUploading ? (
                <label
                    htmlFor="cover-upload"
                    className={clsx(
                        'flex flex-col items-center justify-center aspect-square w-full max-w-[200px] border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                        displayError ? 'border-danger bg-danger/5' : 'border-white/10 hover:border-teal hover:bg-surface/50',
                        (disabled) && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <Image className="w-8 h-8 text-muted" />
                    <span className="font-body text-sm text-ivory mt-1">Ajouter une pochette</span>
                </label>
            ) : isUploading ? (
                <div className="aspect-square w-full max-w-[200px] flex items-center justify-center border border-white/10 rounded-lg bg-surface-raised">
                    <Spinner size="md" />
                </div>
            ) : (
                <div className="relative aspect-square w-full max-w-[200px] rounded-lg overflow-hidden border border-white/10">
                    <img src={preview!} alt="Pochette" className="w-full h-full object-cover" />
                    <div className="absolute top-1 right-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            aria-label="Retirer la pochette"
                            className="bg-black/50 text-white hover:bg-black/70 p-1"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {displayError && <p className="text-xs text-danger">{displayError}</p>}
        </div>
    )
}