import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../../data/auth.service'
import { useAuthStore } from '../../../../core/store/auth-store'
import { useToastStore } from '../../../../core/store/toast-store'

export function useLoginForm() {
    const navigate = useNavigate()
    const setSession = useAuthStore((state) => state.setSession)
    const showToast = useToastStore((state) => state.showToast)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError(null)
        setIsSubmitting(true)
        try {
            const { tokens, user } = await authService.login({ email, password })
            setSession(tokens.accessToken, tokens.refreshToken, { id: user.id, pseudo: user.pseudo, email: user.email }, user.isAdmin)
            showToast('Connexion réussie', 'success')
            navigate('/home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return { email, setEmail, password, setPassword, error, isSubmitting, handleSubmit }
}