import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../../data/auth-mock.service'
import { useToastStore } from '../../../../core/store/toast-store'

export function useLoginForm() {
    const navigate = useNavigate()
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
            await authService.login({ email, password })
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