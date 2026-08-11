interface GreetingProps {
    pseudo: string
}

export function Greeting({ pseudo }: GreetingProps) {
    return (
        <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-ivory">Bonjour, {pseudo}</h1>
            <p className="font-body text-base text-muted">Découvrez votre musique</p>
        </div>
    )
}