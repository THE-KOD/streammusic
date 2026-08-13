// features/player/presentation/store/player-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '../../../../shared/types/track'
import { getNextIndex, getPreviousIndex, reorderQueue, type RepeatMode } from '../../domain/queue-logic'

interface PlayerState {
    queue: Track[]
    currentIndex: number
    isPlaying: boolean
    progress: number
    volume: number
    volumeBeforeMute: number
    shuffle: boolean
    repeat: RepeatMode

    playTrack: (track: Track, queue?: Track[]) => void
    playFromQueueIndex: (index: number) => void
    togglePlay: () => void
    next: () => void
    previous: () => void
    seek: (value: number) => void
    setVolume: (value: number) => void
    toggleMute: () => void
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
            queue: [],
            currentIndex: -1,
            isPlaying: false,
            progress: 0,
            volume: 80,
            volumeBeforeMute: 80,
            shuffle: false,
            repeat: 'none',

            playTrack: (track, queue = []) => {
                const newQueue = queue.length > 0 ? queue : [track]
                const index = newQueue.findIndex((t) => t.id === track.id)
                set({ queue: newQueue, currentIndex: index >= 0 ? index : 0, progress: 0, isPlaying: true })
            },

            playFromQueueIndex: (index) => {
                const { queue } = get()
                if (index < 0 || index >= queue.length) return
                set({ currentIndex: index, progress: 0, isPlaying: true })
            },

            togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

            next: () => {
                const { queue, currentIndex, repeat, shuffle } = get()
                const nextIndex = getNextIndex(queue.length, currentIndex, repeat, shuffle)
                if (nextIndex === null) { set({ isPlaying: false }); return }
                set({ currentIndex: nextIndex, progress: 0, isPlaying: true })
            },

            previous: () => {
                const { queue, currentIndex, shuffle } = get()
                const prevIndex = getPreviousIndex(queue.length, currentIndex, shuffle)
                if (prevIndex === null) return
                set({ currentIndex: prevIndex, progress: 0, isPlaying: true })
            },

            seek: (value) => set({ progress: value }),

            setVolume: (value) => {
                const clamped = Math.min(100, Math.max(0, value))
                set({ volume: clamped, volumeBeforeMute: clamped > 0 ? clamped : get().volumeBeforeMute })
            },

            toggleMute: () => {
                const { volume, volumeBeforeMute } = get()
                set(volume === 0 ? { volume: volumeBeforeMute || 80 } : { volume: 0, volumeBeforeMute: volume })
            },

            toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

            toggleRepeat: () => {
                const modes: RepeatMode[] = ['none', 'all', 'one']
                const idx = modes.indexOf(get().repeat)
                set({ repeat: modes[(idx + 1) % modes.length] })
            },

            addToQueue: (tracks) => {
                const arr = Array.isArray(tracks) ? tracks : [tracks]
                set((state) => ({ queue: [...state.queue, ...arr] }))
            },

            removeFromQueue: (index) => {
                set((state) => {
                    const newQueue = [...state.queue]
                    newQueue.splice(index, 1)
                    let newIndex = state.currentIndex
                    if (index < state.currentIndex) newIndex -= 1
                    else if (index === state.currentIndex) newIndex = Math.min(newIndex, newQueue.length - 1)
                    return { queue: newQueue, currentIndex: newQueue.length === 0 ? -1 : newIndex }
                })
            },

            moveInQueue: (from, to) => {
                set((state) => {
                    const newQueue = reorderQueue(state.queue, from, to)
                    let newIndex = state.currentIndex
                    if (from === state.currentIndex) newIndex = to
                    else if (from < state.currentIndex && to >= state.currentIndex) newIndex -= 1
                    else if (from > state.currentIndex && to <= state.currentIndex) newIndex += 1
                    return { queue: newQueue, currentIndex: newIndex }
                })
            },

            clearQueue: () => set({ queue: [], currentIndex: -1, isPlaying: false }),
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
        },
    ),
)

/** currentTrack n'est plus un champ séparé — toujours dérivé de queue/currentIndex, donc jamais désynchronisé */
export function useCurrentTrack(): Track | null {
    return usePlayerStore((state) => state.queue[state.currentIndex] ?? null)
}