import type {ReactNode} from 'react'
import { AuthHeader } from './auth-header.tsx'
import { AuthFooter } from './auth-footer.tsx'

interface AuthLayoutProps {
    children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md flex flex-col items-center">
                <AuthHeader />
                <div className="w-full mt-8">
                    {children}
                </div>
                <AuthFooter />
            </div>
        </div>
    )
}