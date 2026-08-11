import { Button } from '../../../shared/components/button'
import { Avatar } from '../../../shared/components/avatar'
import { Spinner } from '../../../shared/components/spinner'
import { Card } from '../../../shared/components/card'
import { Input } from '../../../shared/components/input'
import { TrackRow } from '../../../shared/components/track-row'

export function LandingPage() {
    return (
        <div className="p-8 space-y-6 font-body max-w-2xl">
            <h1 className="font-display text-3xl font-semibold text-ivory">StreamMusic — Design System</h1>

            <div className="flex gap-3 items-center">
                <Button variant="primary">Lecture</Button>
                <Button variant="secondary">Suivre</Button>
                <Button variant="ghost">Annuler</Button>
            </div>

            <div className="flex gap-4 items-center">
                <Avatar name="Jane Doe" size="sm" />
                <Avatar name="John Smith" size="md" />
                <Spinner size="md" />
            </div>

            <Card className="w-64">
                <p className="font-mono text-muted text-sm">03:42</p>
                <p className="font-display text-ivory">Nom de la carte</p>
            </Card>

            <Input label="Email" placeholder="toi@exemple.com" />
            <Input label="Mot de passe" type="password" error="Mot de passe trop court" />

            <div className="space-y-1">
                <TrackRow index={1} title="Midnight Drive" artistName="Nova Kline" duration={222} isLiked />
                <TrackRow index={2} title="Static Bloom" artistName="Nova Kline" duration={198} isPlaying />
                <TrackRow index={3} title="Glass Horizon" artistName="Nova Kline" duration={251} />
            </div>
        </div>
    )
}