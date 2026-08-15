import type { Track } from '../types/track'

/**
 * Catalogue de démo partagé. Home/Search/Artist gardent pour l'instant
 * leurs propres mocks indépendants (déjà validés bout en bout) —
 * à consolider ici dans un futur passage de nettoyage.
 */
export const CATALOG_TRACKS_MOCK: Track[] = [
    { id: 't1', title: 'Midnight Drive', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'album-1', duration: 222, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 't2', title: 'Static Bloom', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'album-1', duration: 198, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 't3', title: 'Glass Horizon', artistName: 'The Reverbs', artistId: 'a2', albumTitle: 'Low Tide', albumId: 'album-2', duration: 251, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 't4', title: 'Paper Moon', artistName: 'The Reverbs', artistId: 'a2', albumTitle: 'Low Tide', albumId: 'album-2', duration: 301, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 't5', title: 'Velvet Static', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'album-1', duration: 214, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
]