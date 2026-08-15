import { useEffect, useState } from 'react'
import { playlistsService } from '../../data/playlists-mock.service'
import type { Playlist } from '../../domain/playlist.entity'

export function usePlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        playlistsService.list()
            .then((data) => { setPlaylists(data); setError(null) })
            .catch(() => setError('Impossible de charger les playlists.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const createPlaylist = async (name: string) => {
        const playlist = await playlistsService.create(name)
        reload()
        return playlist
    }
    const renamePlaylist = async (id: string, name: string) => { await playlistsService.rename(id, name); reload() }
    const updateVisibility = async (id: string, isPublic: boolean) => { await playlistsService.updateVisibility(id, isPublic); reload() }
    const deletePlaylist = async (id: string) => { await playlistsService.remove(id); reload() }

    return { playlists, isLoading, error, createPlaylist, renamePlaylist, updateVisibility, deletePlaylist }
}