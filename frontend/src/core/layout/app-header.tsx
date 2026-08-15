import { Link, useLocation, useNavigate } from 'react-router'
import { Avatar } from '../../shared/components/avatar'
import { DropdownMenu } from '../../shared/components/dropdown-menu'
import clsx from 'clsx'

const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Recherche', path: '/search' },
    { label: 'Bibliothèque', path: '/library' },
    { label: 'Playlists', path: '/playlists' },
]

export function AppHeader() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10">
            <div className="flex items-center gap-6">
                <Link to="/home" className="text-ivory font-display text-xl font-semibold flex items-center gap-1">
                    <span className="text-amber">♪</span> StreamMusic
                </Link>
                <nav className="hidden md:flex items-center gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path} to={item.path}
                            className={clsx('text-sm font-body transition-colors', location.pathname === item.path ? 'text-ivory font-medium' : 'text-muted hover:text-ivory')}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <DropdownMenu
                ariaLabel="Menu utilisateur"
                trigger={
                    <span className="flex items-center gap-2">
            <Avatar name="Utilisateur" size="sm" />
            <span className="hidden sm:inline text-sm text-ivory font-body">Utilisateur</span>
          </span>
                }
                items={[
                    { label: 'Historique', onClick: () => navigate('/history') },
                    { label: 'Profil', onClick: () => navigate('/profile') },
                    { label: 'Paramètres', onClick: () => navigate('/settings') },
                    { label: 'Passer Premium', onClick: () => navigate('/premium') },
                    { label: 'Uploader un titre', onClick: () => navigate('/upload') },
                    { label: 'Back-office admin', onClick: () => navigate('/admin') },
                    { label: 'Déconnexion', onClick: () => navigate('/login'), variant: 'danger' },
                ]}
            />
        </header>
    )
}