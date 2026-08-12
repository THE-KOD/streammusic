// features/player/presentation/store/player-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
    id: string
    title: string
    artist: string
    album?: string
    duration: number // secondes
    coverUrl?: string
    fileUrl: string
}

interface PlayerState {
    currentTrack: Track | null
    queue: Track[]
    currentIndex: number
    isPlaying: boolean
    progress: number // 0-100
    volume: number // 0-100
    shuffle: boolean
    repeat: 'none' | 'all' | 'one'
    // Actions
    setCurrentTrack: (track: Track, queue?: Track[]) => void
    play: () => void
    pause: () => void
    togglePlay: () => void
    next: () => void
    previous: () => void
    seek: (value: number) => void
    setVolume: (value: number) => void
    toggleShuffle: () => void
    toggleRepeat: () => void
    addToQueue: (tracks: Track | Track[]) => void
    removeFromQueue: (index: number) => void
    moveInQueue: (from: number, to: number) => void
    clearQueue: () => void
    setProgress: (value: number) => void
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            queue: [],
            currentIndex: -1,
            isPlaying: false,
            progress: 0,
            volume: 80,
            shuffle: false,
            repeat: 'none',

            setCurrentTrack: (track, queue = []) => {
                const newQueue = queue.length > 0 ? queue : [track]
                const index = newQueue.findIndex(t => t.id === track.id)
                set({
                    currentTrack: track,
                    queue: newQueue,
                    currentIndex: index >= 0 ? index : 0,
                    progress: 0,
                    isPlaying: true,
                })
            },

            play: () => set({ isPlaying: true }),
            pause: () => set({ isPlaying: false }),
            togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

            next: () => {
                const { queue, currentIndex, repeat } = get() // shuffle retiré
                if (queue.length === 0) return
                let nextIndex = currentIndex + 1
                if (nextIndex >= queue.length) {
                    if (repeat === 'all') nextIndex = 0
                    else return
                }
                const nextTrack = queue[nextIndex]
                set({ currentTrack: nextTrack, currentIndex: nextIndex, progress: 0, isPlaying: true })
            },

            previous: () => {
                const { queue, currentIndex } = get()
                if (queue.length === 0 || currentIndex <= 0) return
                const prevIndex = currentIndex - 1
                const prevTrack = queue[prevIndex]
                set({ currentTrack: prevTrack, currentIndex: prevIndex, progress: 0, isPlaying: true })
            },

            seek: (value) => set({ progress: value }),

            setVolume: (value) => set({ volume: Math.min(100, Math.max(0, value)) }),

            toggleShuffle: () => {
                set((state) => ({ shuffle: !state.shuffle }))
            },

            toggleRepeat: () => {
                const modes = ['none', 'all', 'one'] as const
                const current = get().repeat
                const idx = modes.indexOf(current)
                const next = modes[(idx + 1) % modes.length]
                set({ repeat: next })
            },

            addToQueue: (tracks) => {
                const arr = Array.isArray(tracks) ? tracks : [tracks]
                set((state) => ({
                    queue: [...state.queue, ...arr],
                }))
            },

            removeFromQueue: (index) => {
                set((state) => {
                    const newQueue = [...state.queue]
                    newQueue.splice(index, 1)
                    return { queue: newQueue }
                })
            },

            moveInQueue: (from, to) => {
                set((state) => {
                    const newQueue = [...state.queue]
                    const [item] = newQueue.splice(from, 1)
                    newQueue.splice(to, 0, item)
                    return { queue: newQueue }
                })
            },

            clearQueue: () => set({ queue: [], currentIndex: -1 }),

            setProgress: (value) => set({ progress: value }),
        }),
        {
            name: 'player-storage',
            partialize: (state) => ({
                queue: state.queue,
                currentIndex: state.currentIndex,
                volume: state.volume,
                shuffle: state.shuffle,
                repeat: state.repeat,
            }),
        }
    )
)