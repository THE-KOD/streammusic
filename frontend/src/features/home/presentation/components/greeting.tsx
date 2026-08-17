// features/home/presentation/components/greeting.tsx
interface GreetingProps {
    pseudo: string
}

export function Greeting({ pseudo }: GreetingProps) {
    return (
        <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
            {/* Bulles décoratives en arrière-plan */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber/20 rounded-full blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-teal/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <h1 className="font-display text-4xl font-semibold text-ivory">
                    Bonjour, {pseudo}
                </h1>
                <p className="font-body text-base text-muted mt-1">
                    Découvrez votre musique
                </p>
            </div>
        </div>
    )
}