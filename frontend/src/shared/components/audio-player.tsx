import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react'
import { useState } from 'react'

// Simulation : on récupère le titre en cours depuis un store (zustand)
// Pour l'exemple, on utilise un état local
export function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(80)

    // Données mockées
    const currentTrack = {
        title: 'Titre exemple',
        artist: 'Artiste exemple',
        cover: 'https://via.placeholder.com/60',
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 px-4 py-3 z-50 flex items-center justify-between">
            {/* Infos titre */}
            <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial">
                <img src={currentTrack.cover} alt="" className="w-12 h-12 rounded-md object-cover" />
                <div className="truncate">
                    <p className="text-sm font-body text-ivory truncate">{currentTrack.title}</p>
                    <p className="text-xs text-muted truncate">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Contrôles centraux */}
            <div className="flex items-center gap-3 md:gap-4">
                <button className="text-muted hover:text-ivory hidden sm:inline-block">
                    <Shuffle className="w-4 h-4" />
                </button>
                <button className="text-muted hover:text-ivory">
                    <SkipBack className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-amber text-ink rounded-full p-2 hover:brightness-110 transition"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="text-muted hover:text-ivory">
                    <SkipForward className="w-5 h-5" />
                </button>
                <button className="text-muted hover:text-ivory hidden sm:inline-block">
                    <Repeat className="w-4 h-4" />
                </button>
            </div>

            {/* Progression + volume (desktop) */}
            <div className="hidden md:flex items-center gap-4 flex-1 ml-4">
                <span className="text-xs text-muted font-mono">1:23</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #E3A72F 0%, #E3A72F ${progress}%, #4B5563 ${progress}%, #4B5563 100%)`,
                    }}
                />
                <span className="text-xs text-muted font-mono">3:45</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="text-muted hover:text-ivory">
                        {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #E3A72F 0%, #E3A72F ${volume}%, #4B5563 ${volume}%, #4B5563 100%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}