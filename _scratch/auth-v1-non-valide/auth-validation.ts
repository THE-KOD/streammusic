const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export function validateEmail(email: string): string | undefined {
    if (!email.trim()) return "L'adresse email est requise"
    if (!EMAIL_REGEX.test(email)) return 'Email invalide'
    return undefined
}

export function validateLoginPassword(password: string): string | undefined {
    if (!password) return 'Le mot de passe est requis'
    return undefined
}

export function validateUsername(username: string): string | undefined {
    if (!username.trim()) return 'Le pseudo est requis'
    return undefined
}

export function validatePasswordConfirmation(
    password: string,
    confirmPassword: string,
): string | undefined {
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas'
    return undefined
}

export interface PasswordRequirement {
    id: string
    label: string
    test: (password: string) => boolean
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
    { id: 'length', label: '8 caractères minimum', test: (p) => p.length >= 8 },
    { id: 'uppercase', label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
    { id: 'lowercase', label: 'Une minuscule', test: (p) => /[a-z]/.test(p) },
    { id: 'digit', label: 'Un chiffre', test: (p) => /\d/.test(p) },
    { id: 'special', label: 'Un caractère spécial', test: (p) => /[^a-zA-Z0-9]/.test(p) },
]

export function validateRegisterPassword(password: string): string | undefined {
    const failed = PASSWORD_REQUIREMENTS.filter((r) => !r.test(password))
    if (failed.length === 0) return undefined
    return `Le mot de passe doit contenir : ${failed.map((r) => r.label.toLowerCase()).join(', ')}`
}