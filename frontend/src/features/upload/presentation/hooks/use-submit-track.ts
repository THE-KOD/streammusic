import { useState } from 'react'
import { uploadCatalogService } from '../../data/upload-catalog-mock.service'
import type { NewTrackPayload } from '../../domain/upload.entity'

export function useSubmitTrack() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submit = async (payload: NewTrackPayload) => {
        setIsSubmitting(true)
        setError(null)
        try {
            await uploadCatalogService.submitTrack(payload)
        } catch {
            setError('Erreur lors de la soumission du titre.')
            throw new Error('submit-failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    return { isSubmitting, error, submit }
}