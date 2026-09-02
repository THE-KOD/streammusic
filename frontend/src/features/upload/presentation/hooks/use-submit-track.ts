import { useState } from 'react'
import { apiClient } from '../../../../infrastructure/http/api-client'
import type { NewTrackPayload } from '../../domain/upload.entity'

export function useSubmitTrack() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submit = async (payload: NewTrackPayload) => {
        setIsSubmitting(true)
        setError(null)
        try {
            // Pas de vrai stockage de fichiers pour l'instant (voir note en tête
            // de réponse) — URL locale au navigateur, joue réellement le bon
            // fichier cette session, ne persiste pas après un rechargement.
            const fichierAudioUrl = URL.createObjectURL(payload.audioFile)
            const pochetteUrl = payload.coverFile ? URL.createObjectURL(payload.coverFile) : undefined

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