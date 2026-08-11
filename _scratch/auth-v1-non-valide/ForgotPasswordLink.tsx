import { Link } from 'react-router'

export function ForgotPasswordLink() {
    return (
        <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-teal hover:underline font-body">
                Mot de passe oublié ?
            </Link>
        </div>
    )
}