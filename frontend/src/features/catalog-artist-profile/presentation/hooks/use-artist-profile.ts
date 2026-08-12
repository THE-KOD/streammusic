import { useEffect, useState } from 'react'
import { artistProfileService } from '../../data/artist-profile-mock.service'
import type { ArtistProfile } from '../../domain/artist-profile.entity'
import type { Track } from '../../../../shared/types/track'
import type { Album } from '../../../../shared/types/album'

interface ArtistProfileState {
    artist: ArtistProfile | null
    tracks: Track[]
    albums: Album[]
    isLoading: boolean
}

export function useArtistProfile(artistId: string | undefined) {
    const [state, setState] = useState<ArtistProfileState>({ artist: null, tracks: [], albums: [], isLoading: true })

    useEffect(() => {
        if (!artistId) { setState({ artist: null, tracks: [], albums: [], isLoading: false }); return }
        setState((prev) => ({ ...prev, isLoading: true }))
        artistProfileService.getArtistProfile(artistId)
            .then(({ artist, tracks, albums }) => setState({ artist, tracks, albums, isLoading: false }))
            .catch(() => setState({ artist: null, tracks: [], albums: [], isLoading: false }))
    }, [artistId])

    return state
}