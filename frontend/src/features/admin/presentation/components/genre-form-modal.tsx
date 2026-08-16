import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'

interface GenreFormModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    initialName?: string
    onSubmit: (name: string) => Promise<void>
    submitLabel: string
}

export function GenreFormModal({
                                   isOpen,
                                   onClose,
                                   title,
                                   initialName = '',
                                   onSubmit,
                                   submitLabel,
                               }: GenreFormModalProps) {
    const [name, setName] = useState(initialName)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Le nom est obligatoire.')
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            await onSubmit(name.trim())
            setName('')
            onClose()
        } catch {
            setError('Erreur lors de l\'enregistrement.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Nom *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    error={error || undefined}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? '...' : submitLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}