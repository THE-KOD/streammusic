import { useState } from 'react'
import { apiClient } from '../../../../infrastructure/http/api-client'
import { uploadFile } from '../../../../infrastructure/http/file-upload'
import type { NewTrackPayload } from '../../domain/upload.entity'

export function useSubmitTrack() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submit = async (payload: NewTrackPayload) => {
        setIsSubmitting(true)
        setError(null)
        try {
            // Upload réel vers le stockage local du backend, avant de créer le titre.
            const fichierAudioUrl = await uploadFile(payload.audioFile, 'audio')
            const pochetteUrl = payload.coverFile ? await uploadFile(payload.coverFile, 'image') : undefined

            await apiClient.post('/tracks', {
                titre: payload.title,
                genreId: payload.genreId,
                albumId: payload.albumId || undefined,
                duree: Math.round(payload.duration),
                fichierAudioUrl,
                pochetteUrl,
                dateSortie: payload.releaseDate || undefined,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la soumission du titre.')
            throw err
        } finally {
            setIsSubmitting(false)
        }
    }

    return { isSubmitting, error, submit }
}