import { useState, type ChangeEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../../../../shared/components/input'
// @ts-ignore
import { Button } from '../../../../shared/components/button'

interface PasswordFieldProps {
    id: string
    label: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    error?: string
    disabled?: boolean
    autoComplete?: string
}

export function PasswordField({
                                  id,
                                  label,
                                  value,
                                  onChange,
                                  placeholder = '••••••••',
                                  error,
                                  disabled,
                                  autoComplete,
                              }: PasswordFieldProps) {
    const [show, setShow] = useState(false)

    return (
        <div className="relative">
            <Input
                id={id}
                label={label}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                error={error}
                disabled={disabled}
                autoComplete={autoComplete}
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                disabled={disabled}
                aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-[38px] text-muted hover:text-ivory disabled:opacity-50"
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    )
}