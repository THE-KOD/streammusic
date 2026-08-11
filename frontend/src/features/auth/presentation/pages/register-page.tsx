import { Link } from 'react-router'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { useRegisterForm } from '../hooks/use-register-form'

export function RegisterPage() {
  const { pseudo, setPseudo, email, setEmail, password, setPassword, error, isSubmitting, handleSubmit } =
      useRegisterForm()

  return (
      <div className="min-h-screen flex items-center justify-center bg-ink px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-display text-2xl font-semibold text-ivory">Crée ton compte</h1>
            <p className="text-muted text-sm">Rejoins StreamMusic en quelques secondes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Pseudo"
                placeholder="ton-pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
            />
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
              {isSubmitting ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-teal hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
  )
}