import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../../data/auth-mock.service'
import { useToastStore } from '../../../../core/store/toast-store'

export function useRegisterForm() {
    const navigate = useNavigate()
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
            await authService.register({ pseudo, email, password })
            showToast('Compte créé — connecte-toi', 'success')
            navigate('/login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return { pseudo, setPseudo, email, setEmail, password, setPassword, error, isSubmitting, handleSubmit }
}