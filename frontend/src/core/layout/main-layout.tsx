import { Outlet } from 'react-router'
import { AppHeader } from './app-header'
import { AudioPlayer } from '../../features/player/presentation/components/audio-player'

export function MainLayout() {
    return (
        <div className="min-h-screen bg-ink pb-28 bg-[radial-gradient(ellipse_at_top_left,_var(--color-surface)_0%,_transparent_70%)]">
            {/* Pattern subtil en arrière-plan (optionnel) */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('/pattern-vinyl.svg')] bg-repeat" aria-hidden="true" />

            <AppHeader />
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
                <Outlet />
            </main>
            <AudioPlayer />
        </div>
    )
}