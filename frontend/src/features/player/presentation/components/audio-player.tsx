import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat,
    Repeat1,
    List,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { usePlayerStore, useCurrentTrack } from '../store/player-store'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { historyService } from '../../../listening-history'
import type { Track } from '../../../../shared/types/track'

export function AudioPlayer() {
    const {
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
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        setProgress,
    } = usePlayerStore()

    const currentTrack = useCurrentTrack()

    const audioRef = useRef<HTMLAudioElement>(null)
    const listenedSecondsRef = useRef(0)
    const previousTrackRef = useRef<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            const ct = audio.currentTime
            const dur = audio.duration || 0

            setCurrentTime(ct)
            setDuration(dur)
            setProgress(dur > 0 ? (ct / dur) * 100 : 0)
            listenedSecondsRef.current = ct
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

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.play().catch(() => {})
        } else {
            audio.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) return

        // Journalise l'écoute du titre PRÉCÉDENT avant de charger le nouveau —
        // capture le temps réellement écouté (limité à la durée du titre,
        // au cas où currentTime dépasserait légèrement par imprécision flottante).
        const previous = previousTrackRef.current
        if (previous && previous.id !== currentTrack.id) {
            const clamped = Math.min(Math.floor(listenedSecondsRef.current), previous.duration)
            historyService.logListen(previous.id, clamped)
        }
        previousTrackRef.current = currentTrack
        listenedSecondsRef.current = 0

        audio.src = currentTrack.fileUrl
        audio.load()

        if (isPlaying) {
            audio.play().catch(() => {})
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack?.id])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.volume = volume / 100
    }, [volume])

    const handleSeek = (value: number) => {
        const audio = audioRef.current
        if (!audio || !duration) return

        audio.currentTime = (value / 100) * duration
        seek(value)
    }

    const repeatLabel =
        repeat === 'none'
            ? 'Répéter : désactivé'
            : repeat === 'all'
                ? 'Répéter : file entière'
                : 'Répéter : ce titre en boucle'

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 px-4 py-3">
            {/* Toujours montée, même sans titre actif */}
            <audio ref={audioRef} onEnded={next} />

            {!currentTrack ? (
                <div className="flex items-center justify-center text-muted">
                    <p className="text-sm">Aucun titre en cours</p>
                </div>
            ) : (
                <div className="flex items-center justify-between">

                    {/* Informations du titre */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial">
                        {currentTrack.coverUrl ? (
                            <img
                                src={currentTrack.coverUrl}
                                alt={currentTrack.title}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-md bg-surface-raised flex-shrink-0" />
                        )}

                        <div className="truncate">
                            <p className="text-sm font-body text-ivory truncate">
                                {currentTrack.title}
                            </p>

                            <p className="text-xs text-muted truncate">
                                {currentTrack.artistName}
                            </p>
                        </div>
                    </div>

                    {/* Contrôles */}
                    <div className="flex items-center gap-3 md:gap-4">

                        {/* SHUFFLE */}
                        <button
                            className={`hover:text-ivory hidden sm:inline-block transition-colors ${
                                shuffle ? 'text-amber' : 'text-muted'
                            }`}
                            onClick={toggleShuffle}
                            aria-label={
                                shuffle
                                    ? 'Lecture aléatoire activée'
                                    : 'Lecture aléatoire désactivée'
                            }
                            title={
                                shuffle
                                    ? 'Lecture aléatoire activée'
                                    : 'Lecture aléatoire désactivée'
                            }
                        >
                            <Shuffle className="w-4 h-4" />
                        </button>

                        {/* PREVIOUS */}
                        <button
                            className="text-muted hover:text-ivory"
                            onClick={previous}
                            aria-label="Titre précédent"
                            title="Titre précédent"
                        >
                            <SkipBack className="w-5 h-5" />
                        </button>

                        {/* PLAY / PAUSE */}
                        <button
                            onClick={togglePlay}
                            aria-label={
                                isPlaying
                                    ? 'Mettre en pause'
                                    : 'Lire'
                            }
                            title={
                                isPlaying
                                    ? 'Mettre en pause'
                                    : 'Lire'
                            }
                            className="bg-amber text-ink rounded-full p-2 hover:brightness-110 transition"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5" />
                            )}
                        </button>

                        {/* NEXT */}
                        <button
                            className="text-muted hover:text-ivory"
                            onClick={next}
                            aria-label="Titre suivant"
                            title="Titre suivant"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>

                        {/* REPEAT */}
                        <button
                            className={`hover:text-ivory hidden sm:inline-block transition-colors ${
                                repeat !== 'none'
                                    ? 'text-amber'
                                    : 'text-muted'
                            }`}
                            onClick={toggleRepeat}
                            aria-label={repeatLabel}
                            title={repeatLabel}
                        >
                            {repeat === 'one' ? (
                                <Repeat1 className="w-4 h-4" />
                            ) : (
                                <Repeat className="w-4 h-4" />
                            )}
                        </button>

                        {/* QUEUE */}
                        <Link
                            to="/queue"
                            className="text-muted hover:text-ivory hidden sm:inline-block"
                            aria-label="File d'attente"
                            title="File d'attente"
                        >
                            <List className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Progression + volume */}
                    <div className="hidden md:flex items-center gap-4 flex-1 ml-4">

                        <span className="text-xs text-muted font-mono">
                            {formatDuration(currentTime)}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) =>
                                handleSeek(Number(e.target.value))
                            }
                            aria-label="Progression de la lecture"
                            className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(
                                    to right,
                                    var(--color-amber) 0%,
                                    var(--color-amber) ${progress}%,
                                    var(--color-surface-raised) ${progress}%,
                                    var(--color-surface-raised) 100%
                                )`,
                            }}
                        />

                        <span className="text-xs text-muted font-mono">
                            {formatDuration(duration)}
                        </span>

                        {/* Volume */}
                        <div className="flex items-center gap-2">

                            <button
                                onClick={toggleMute}
                                className="text-muted hover:text-ivory"
                                aria-label={
                                    volume === 0
                                        ? 'Rétablir le son'
                                        : 'Couper le son'
                                }
                                title={
                                    volume === 0
                                        ? 'Rétablir le son'
                                        : 'Couper le son'
                                }
                            >
                                {volume === 0 ? (
                                    <VolumeX className="w-4 h-4" />
                                ) : (
                                    <Volume2 className="w-4 h-4" />
                                )}
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) =>
                                    setVolume(Number(e.target.value))
                                }
                                aria-label="Volume"
                                className="w-20 h-1 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(
                                        to right,
                                        var(--color-amber) 0%,
                                        var(--color-amber) ${volume}%,
                                        var(--color-surface-raised) ${volume}%,
                                        var(--color-surface-raised) 100%
                                    )`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}