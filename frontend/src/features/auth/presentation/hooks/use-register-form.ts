import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../../data/auth.service'
import { useAuthStore } from '../../../../core/store/auth-store'
import { useToastStore } from '../../../../core/store/toast-store'

export function useRegisterForm() {
    const navigate = useNavigate()
    const setSession = useAuthStore((state) => state.setSession)
    const showToast = useToastStore((state) => state.showToast)

    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError(null)
        setIsSubmitting(true)
        try {
            // Le vrai backend connecte automatiquement après inscription (renvoie
            // déjà des tokens) — amélioration naturelle par rapport au mock, qui
            // redirigeait vers /login et forçait une double saisie.
            const { tokens, user } = await authService.register({ pseudo, email, password })
            setSession(tokens.accessToken, tokens.refreshToken, { id: user.id, pseudo: user.pseudo, email: user.email }, user.isAdmin)
            showToast('Compte créé avec succès', 'success')
            navigate('/home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return { pseudo, setPseudo, email, setEmail, password, setPassword, error, isSubmitting, handleSubmit }
}