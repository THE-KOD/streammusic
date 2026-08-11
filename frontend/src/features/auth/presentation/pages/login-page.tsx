import { Link } from 'react-router'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { useLoginForm } from '../hooks/use-login-form'

export function LoginPage() {
  const { email, setEmail, password, setPassword, error, isSubmitting, handleSubmit } = useLoginForm()

  return (
      <div className="min-h-screen flex items-center justify-center bg-ink px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-display text-2xl font-semibold text-ivory">Content de te revoir</h1>
            <p className="text-muted text-sm">Connecte-toi pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Email"
                type="email"
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-teal hover:underline">
              Créer un compte
            </Link>
          </p>

          <p className="text-center text-xs text-muted">Démo : jane@example.com / password123</p>
        </div>
      </div>
  )
}