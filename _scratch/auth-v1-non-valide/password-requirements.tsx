import { CheckCircle, Circle } from 'lucide-react'
import { PASSWORD_REQUIREMENTS } from '../../domain/auth-validation'

interface PasswordRequirementsProps {
    password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
    return (
        <div className="space-y-1.5">
            <p className="text-sm font-body font-medium text-ivory">Exigences du mot de passe :</p>
            <ul className="space-y-1 text-sm font-body">
                {PASSWORD_REQUIREMENTS.map(({ id, label, test }) => {
                    const valid = test(password)
                    return (
                        <li key={id} className="flex items-center gap-2">
                            {valid ? <CheckCircle className="w-4 h-4 text-teal" /> : <Circle className="w-4 h-4 text-muted" />}
                            <span className={valid ? 'text-teal' : 'text-muted'}>{label}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}