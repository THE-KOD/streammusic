import type { Playlist, PlaylistTrack } from '../domain/playlist.entity'
import { PlaylistNotFoundError } from '../domain/errors'
import { CATALOG_TRACKS_MOCK } from '../../../shared/mocks/catalog-tracks.mock'

const FAKE_DELAY_MS = 700

let playlistsDb: Playlist[] = [
    { id: 'p1', name: 'Ma playlist', isPublic: false, trackCount: 3 },
    { id: 'p2', name: 'Mes favoris', isPublic: true, trackCount: 2 },
]

let playlistTracksDb: Record<string, PlaylistTrack[]> = {
    p1: [
        { id: 'pt1', position: 1, track: CATALOG_TRACKS_MOCK[0] },
        { id: 'pt2', position: 2, track: CATALOG_TRACKS_MOCK[1] },
        { id: 'pt3', position: 3, track: CATALOG_TRACKS_MOCK[2] },
    ],
    p2: [
        { id: 'pt4', position: 1, track: CATALOG_TRACKS_MOCK[0] },
        { id: 'pt5', position: 2, track: CATALOG_TRACKS_MOCK[3] },
    ],
}

const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

export const playlistsService = {
    async list(): Promise<Playlist[]> {
        await delay()
        return playlistsDb
    },
    async get(id: string): Promise<{ playlist: Playlist; tracks: PlaylistTrack[] }> {
        await delay()
        const playlist = playlistsDb.find((p) => p.id === id)
        if (!playlist) throw new PlaylistNotFoundError()
        return { playlist, tracks: playlistTracksDb[id] ?? [] }
    },
    async create(name: string): Promise<Playlist> {
        await delay()
        const playlist: Playlist = { id: `p${Date.now()}`, name, isPublic: false, trackCount: 0 }
        playlistsDb = [...playlistsDb, playlist]
        playlistTracksDb[playlist.id] = []
        return playlist
    },
    async rename(id: string, name: string): Promise<void> {
        await delay()
        playlistsDb = playlistsDb.map((p) => (p.id === id ? { ...p, name } : p))
    },
    async updateVisibility(id: string, isPublic: boolean): Promise<void> {
        await delay()
        playlistsDb = playlistsDb.map((p) => (p.id === id ? { ...p, isPublic } : p))
    },
    async remove(id: string): Promise<void> {
        await delay()
        playlistsDb = playlistsDb.filter((p) => p.id !== id)
        delete playlistTracksDb[id]
    },
    async addTrack(playlistId: string, trackId: string): Promise<void> {
        await delay()
        const track = CATALOG_TRACKS_MOCK.find((t) => t.id === trackId)
        if (!track) return
        const current = playlistTracksDb[playlistId] ?? []
        playlistTracksDb[playlistId] = [...current, { id: `pt${Date.now()}`, position: current.length + 1, track }]
        playlistsDb = playlistsDb.map((p) => (p.id === playlistId ? { ...p, trackCount: p.trackCount + 1 } : p))
    },
    async removeTrack(playlistId: string, playlistTrackId: string): Promise<void> {
        await delay()
        const current = playlistTracksDb[playlistId] ?? []
        playlistTracksDb[playlistId] = current.filter((pt) => pt.id !== playlistTrackId)
        playlistsDb = playlistsDb.map((p) => (p.id === playlistId ? { ...p, trackCount: Math.max(0, p.trackCount - 1) } : p))
    },
    async reorderTracks(playlistId: string, from: number, to: number): Promise<void> {
        await delay()
        const current = [...(playlistTracksDb[playlistId] ?? [])]
        const [moved] = current.splice(from, 1)
        current.splice(to, 0, moved)
        playlistTracksDb[playlistId] = current.map((pt, index) => ({ ...pt, position: index + 1 }))
    },
}