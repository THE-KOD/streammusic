// features/admin/presentation/components/admin-layout.tsx
import { Outlet, Link, useLocation } from 'react-router'
import { LayoutDashboard, Users, Shield, Home } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Utilisateurs', icon: Users },
    { path: '/admin/moderation', label: 'Modération', icon: Shield },
]

export function AdminLayout() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-ink flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/10 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-5 border-b border-white/10">
                    <Link to="/admin" className="text-ivory font-display text-xl font-semibold flex items-center gap-2.5">
                        <span className="text-amber text-2xl">♪</span>
                        <span>StreamMusic</span>
                    </Link>
                    <p className="text-xs text-muted font-body mt-0.5 tracking-wide">Administration</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-all duration-200',
                                    isActive
                                        ? 'bg-amber/10 text-amber shadow-sm'
                                        : 'text-muted hover:text-ivory hover:bg-surface-raised/50'
                                )}
                            >
                                <item.icon className={clsx('w-5 h-5', isActive ? 'text-amber' : '')} />
                                {item.label}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 mt-auto">
                    <Link
                        to="/home"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-muted hover:text-ivory hover:bg-surface-raised/50 transition-all duration-200"
                    >
                        <Home className="w-5 h-5" />
                        Retour à l'app
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-surface/80 backdrop-blur-sm border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-lg font-semibold text-ivory">Back-office</h1>
                        <span className="px-2 py-0.5 text-xs font-mono text-muted bg-surface-raised rounded-md border border-white/5">
                            v1.0
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted font-body hidden sm:block">Admin</span>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/20 flex items-center justify-center text-ivory font-display text-sm font-semibold shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}