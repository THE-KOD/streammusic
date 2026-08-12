import { Outlet } from 'react-router'
import { AppHeader } from './app-header'
import { AudioPlayer } from '../../features/player/presentation/components/audio-player'

export function MainLayout() {
    return (
        <div className="min-h-screen bg-ink pb-24">
            <AppHeader />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>
            <AudioPlayer />
        </div>
    )
}