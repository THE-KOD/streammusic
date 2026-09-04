import { useCallback, useEffect, useState } from 'react'
import { albumDetailService } from '../../data/album-detail.service'
import type { AlbumDetail, AlbumTrack } from '../../domain/album-detail.entity'

interface AlbumDetailState {
    album: AlbumDetail | null
    tracks: AlbumTrack[]
    isLoading: boolean
}

export function useAlbumDetail(albumId: string | undefined) {
    const [state, setState] = useState<AlbumDetailState>({ album: null, tracks: [], isLoading: true })

    const reload = useCallback(() => {
        if (!albumId) { setState({ album: null, tracks: [], isLoading: false }); return }
        setState((prev) => ({ ...prev, isLoading: true }))
        albumDetailService.getAlbumDetail(albumId)
            .then(({ album, tracks }) => setState({ album, tracks, isLoading: false }))
            .catch(() => setState({ album: null, tracks: [], isLoading: false }))
    }, [albumId])

    useEffect(reload, [reload])

    return { ...state, reload }
}