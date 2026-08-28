import { useEffect, useState } from 'react'
import { homeService } from '../../data/home.service.ts'
import type { Track } from '../../../../shared/types/track'

interface SectionState {
    data: Track[]
    isLoading: boolean
    error: string | null
}

const initialState: SectionState = { data: [], isLoading: true, error: null }

export function useHomeSections() {
    const [popular, setPopular] = useState<SectionState>(initialState)
    const [newReleases, setNewReleases] = useState<SectionState>(initialState)
    const [recommendations, setRecommendations] = useState<SectionState>(initialState)

    useEffect(() => {
        homeService.getPopular()
            .then((data) => setPopular({ data, isLoading: false, error: null }))
            .catch(() => setPopular({ data: [], isLoading: false, error: 'Impossible de charger les titres populaires.' }))

        homeService.getNewReleases()
            .then((data) => setNewReleases({ data, isLoading: false, error: null }))
            .catch(() => setNewReleases({ data: [], isLoading: false, error: 'Impossible de charger les nouveautés.' }))

        homeService.getRecommendations()
            .then((data) => setRecommendations({ data, isLoading: false, error: null }))
            .catch(() => setRecommendations({ data: [], isLoading: false, error: "Impossible de charger vos recommandations." }))
    }, [])

    return { popular, newReleases, recommendations }
}