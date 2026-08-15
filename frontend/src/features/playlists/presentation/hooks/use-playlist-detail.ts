import { useEffect, useState } from 'react'
import { playlistsService } from '../../data/playlists-mock.service'
import type { Playlist, PlaylistTrack } from '../../domain/playlist.entity'

export function usePlaylistDetail(playlistId: string) {
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const [tracks, setTracks] = useState<PlaylistTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        playlistsService.get(playlistId)
            .then(({ playlist, tracks }) => { setPlaylist(playlist); setTracks(tracks); setError(null) })
            .catch(() => setError('Playlist introuvable.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [playlistId])

    const addTrack = async (trackId: string) => { await playlistsService.addTrack(playlistId, trackId); reload() }
    const removeTrack = async (playlistTrackId: string) => { await playlistsService.removeTrack(playlistId, playlistTrackId); reload() }
    const reorderTracks = async (from: number, to: number) => { await playlistsService.reorderTracks(playlistId, from, to); reload() }
    const renamePlaylist = async (id: string, name: string) => { await playlistsService.rename(id, name); reload() }
    const updateVisibility = async (id: string, isPublic: boolean) => { await playlistsService.updateVisibility(id, isPublic); reload() }
    const deletePlaylist = async (id: string) => { await playlistsService.remove(id) }

    return { playlist, tracks, isLoading, error, addTrack, removeTrack, reorderTracks, renamePlaylist, updateVisibility, deletePlaylist }
}