import { useState, useEffect } from 'react'
import type { Playlist, PlaylistTrack } from '../../../../shared/types/playlist'
import type { Track } from '../../../../shared/types/track'

// Mock data
const mockTracks: Track[] = [
    { id: 't1', title: 'Titre 1', artistName: 'Artiste 1', artistId: 'a1', albumTitle: 'Album A', duration: 222, coverUrl: '' },
    { id: 't2', title: 'Titre 2', artistName: 'Artiste 2', artistId: 'a2', albumTitle: 'Album B', duration: 255, coverUrl: '' },
    { id: 't3', title: 'Titre 3', artistName: 'Artiste 3', artistId: 'a3', albumTitle: 'Album C', duration: 178, coverUrl: '' },
    { id: 't4', title: 'Titre 4', artistName: 'Artiste 1', artistId: 'a1', albumTitle: 'Album A', duration: 301, coverUrl: '' },
]

const mockPlaylists: Playlist[] = [
    { id: 'p1', name: 'Ma playlist', isPublic: false, trackCount: 3 },
    { id: 'p2', name: 'Mes favoris', isPublic: true, trackCount: 5 },
]

const mockPlaylistTracks: Record<string, PlaylistTrack[]> = {
    p1: [
        { id: 'pt1', position: 1, track: mockTracks[0] },
        { id: 'pt2', position: 2, track: mockTracks[1] },
        { id: 'pt3', position: 3, track: mockTracks[2] },
    ],
    p2: [
        { id: 'pt4', position: 1, track: mockTracks[0] },
        { id: 'pt5', position: 2, track: mockTracks[3] },
    ],
}

export function usePlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setPlaylists(mockPlaylists)
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(load)
    }, [])

    const createPlaylist = async (name: string): Promise<Playlist> => {
        const newPlaylist: Playlist = {
            id: `p${Date.now()}`,
            name,
            isPublic: false,
            trackCount: 0,
        }
        setPlaylists(prev => [...prev, newPlaylist])
        return newPlaylist
    }

    const renamePlaylist = async (id: string, name: string) => {
        setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name } : p))
    }

    const updateVisibility = async (id: string, isPublic: boolean) => {
        setPlaylists(prev => prev.map(p => p.id === id ? { ...p, isPublic } : p))
    }

    const deletePlaylist = async (id: string) => {
        setPlaylists(prev => prev.filter(p => p.id !== id))
    }

    return {
        playlists,
        isLoading,
        error,
        createPlaylist,
        renamePlaylist,
        updateVisibility,
        deletePlaylist,
    }
}

export function usePlaylistDetail(playlistId: string) {
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const [tracks, setTracks] = useState<PlaylistTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            const found = mockPlaylists.find(p => p.id === playlistId)
            if (found) {
                setPlaylist(found)
                setTracks(mockPlaylistTracks[playlistId] || [])
            } else {
                setError('Playlist introuvable')
            }
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(load)
    }, [playlistId])

    const addTrack = async (trackId: string) => {
        // Simuler ajout
        const track = mockTracks.find(t => t.id === trackId)
        if (!track) return
        const newPosition = tracks.length + 1
        const newTrack: PlaylistTrack = {
            id: `pt${Date.now()}`,
            position: newPosition,
            track,
        }
        setTracks(prev => [...prev, newTrack])
        setPlaylist(prev => prev ? { ...prev, trackCount: prev.trackCount + 1 } : null)
    }

    const removeTrack = async (playlistTrackId: string) => {
        setTracks(prev => prev.filter(pt => pt.id !== playlistTrackId))
        setPlaylist(prev => prev ? { ...prev, trackCount: prev.trackCount - 1 } : null)
    }

    const reorderTracks = async (from: number, to: number) => {
        const newTracks = [...tracks]
        const [removed] = newTracks.splice(from, 1)
        newTracks.splice(to, 0, removed)
        setTracks(newTracks.map((pt, index) => ({ ...pt, position: index + 1 })))
    }

    return {
        playlist,
        tracks,
        isLoading,
        error,
        addTrack,
        removeTrack,
        reorderTracks,
    }
}