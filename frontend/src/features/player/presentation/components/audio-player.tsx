import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, List } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/player-store'
import { Link } from 'react-router'
import { formatDuration } from '../../../../shared/utils/format-duration'

export function AudioPlayer() {
    const {
        currentTrack,
        isPlaying,
        progress,
        volume,
        shuffle,
        repeat,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        setProgress,
    } = usePlayerStore()

    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // Synchronisation avec l'élément audio
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            const ct = audio.currentTime
            const dur = audio.duration || 0
            setCurrentTime(ct)
            setDuration(dur)
            setProgress(dur > 0 ? (ct / dur) * 100 : 0)
        }

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
    }, [setProgress])

    // Play/Pause
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.play().catch(() => {})
        } else {
            audio.pause()
        }
    }, [isPlaying])

    // Changer de piste
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) return
        audio.src = currentTrack.fileUrl
        audio.load()
        if (isPlaying) {
            audio.play().catch(() => {})
        }
    }, [currentTrack, isPlaying])

    // Volume
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = volume / 100
    }, [volume])

    // Seek
    const handleSeek = (value: number) => {
        const audio = audioRef.current
        if (!audio || !duration) return
        const newTime = (value / 100) * duration
        audio.currentTime = newTime
        seek(value)
    }

    if (!currentTrack) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 px-4 py-3 z-50 flex items-center justify-center text-muted">
                <p className="text-sm">Aucun titre en cours</p>
            </div>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 px-4 py-3 z-50 flex items-center justify-between">
            <audio ref={audioRef} />

            {/* Infos titre */}
            <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial">
                {currentTrack.coverUrl ? (
                    <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-12 h-12 rounded-md object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-md bg-surface-raised flex-shrink-0" />
                )}
                <div className="truncate">
                    <p className="text-sm font-body text-ivory truncate">{currentTrack.title}</p>
                    <p className="text-xs text-muted truncate">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Contrôles centraux */}
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    className={`text-muted hover:text-ivory hidden sm:inline-block transition-colors ${shuffle ? 'text-amber' : ''}`}
                    onClick={toggleShuffle}
                    aria-label="Lecture aléatoire"
                >
                    <Shuffle className="w-4 h-4" />
                </button>
                <button className="text-muted hover:text-ivory" onClick={previous} aria-label="Titre précédent">
                    <SkipBack className="w-5 h-5" />
                </button>
                <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
                    className="bg-amber text-ink rounded-full p-2 hover:brightness-110 transition"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="text-muted hover:text-ivory" onClick={next} aria-label="Titre suivant">
                    <SkipForward className="w-5 h-5" />
                </button>
                <button
                    className={`text-muted hover:text-ivory hidden sm:inline-block transition-colors ${repeat !== 'none' ? 'text-amber' : ''}`}
                    onClick={toggleRepeat}
                    aria-label="Répéter"
                >
                    <Repeat className="w-4 h-4" />
                </button>
                <Link to="/queue" className="text-muted hover:text-ivory hidden sm:inline-block" aria-label="File d'attente">
                    <List className="w-4 h-4" />
                </Link>
            </div>

            {/* Progression + volume (desktop) */}
            <div className="hidden md:flex items-center gap-4 flex-1 ml-4">
                <span className="text-xs text-muted font-mono">{formatDuration(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    aria-label="Progression de la lecture"
                    className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, var(--color-amber) 0%, var(--color-amber) ${progress}%, var(--color-surface-raised) ${progress}%, var(--color-surface-raised) 100%)`,
                    }}
                />
                <span className="text-xs text-muted font-mono">{formatDuration(duration)}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setVolume(volume === 0 ? 80 : 0)}
                        className="text-muted hover:text-ivory"
                        aria-label={volume === 0 ? 'Rétablir le son' : 'Couper le son'}
                    >
                        {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        aria-label="Volume"
                        className="w-20 h-1 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, var(--color-amber) 0%, var(--color-amber) ${volume}%, var(--color-surface-raised) ${volume}%, var(--color-surface-raised) 100%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}