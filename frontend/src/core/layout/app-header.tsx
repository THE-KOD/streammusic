import { Link, useLocation, useNavigate } from 'react-router'
import { Avatar } from '../../shared/components/avatar'
import { DropdownMenu } from '../../shared/components/dropdown-menu'
import { useAuthStore } from '../store/auth-store'
import { useUnreadNotificationsCount } from '../hooks/use-unread-notifications-count'

import clsx from 'clsx'

const navItems = [
    { label: 'Accueil', path: '/home' },
    { label: 'Recherche', path: '/search' },
    { label: 'Bibliothèque', path: '/library' },
    { label: 'Playlists', path: '/playlists' },
]

export function AppHeader() {
    const location = useLocation()
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    const pseudo = useAuthStore((state) => state.user?.pseudo) ?? 'Utilisateur'
    const isAdmin = useAuthStore((state) => state.isAdmin)
    const unreadCount = useUnreadNotificationsCount()

    const menuItems = [
        { label: unreadCount > 0 ? `Notifications (${unreadCount})` : 'Notifications', onClick: () => navigate('/notifications') },
        { label: 'Historique', onClick: () => navigate('/history') },
        { label: 'Profil', onClick: () => navigate('/profile') },
        { label: 'Paramètres', onClick: () => navigate('/settings') },
        { label: 'Passer Premium', onClick: () => navigate('/premium') },
        { label: 'Uploader un titre', onClick: () => navigate('/upload') },
        { label: 'Mes titres', onClick: () => navigate('/upload/mine') },
        // Visible uniquement pour un compte admin — la vraie protection reste
        // AdminGuard côté backend, ceci n'est qu'un confort d'affichage.
        ...(isAdmin ? [{ label: 'Back-office admin', onClick: () => navigate('/admin') }] : []),
        { label: 'Déconnexion', onClick: async () => { await logout(); navigate('/login') }, variant: 'danger' as const },
    ]

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-8">
                <Link to="/home" className="flex items-center gap-1.5 text-ivory font-display text-xl font-semibold group">
                    <span className="text-amber transition-transform group-hover:scale-110">♪</span>
                    <span>StreamMusic</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'relative text-sm font-body transition-colors duration-200',
                                location.pathname === item.path
                                    ? 'text-ivory font-medium'
                                    : 'text-muted hover:text-ivory',
                            )}
                        >
                            {item.label}
                            {location.pathname === item.path && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <DropdownMenu
                ariaLabel="Menu utilisateur"
                trigger={
                    <span className="relative flex items-center gap-2 cursor-pointer rounded-full hover:bg-surface-raised/50 p-1 pr-2 transition-colors">
                        <span className="relative">
                            <Avatar name={pseudo} size="sm" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-danger text-[10px] font-medium text-white leading-none">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </span>
                        <span className="hidden sm:inline text-sm text-ivory font-body">{pseudo}</span>
                    </span>
                }
                items={menuItems}
            />
        </header>
    )
}