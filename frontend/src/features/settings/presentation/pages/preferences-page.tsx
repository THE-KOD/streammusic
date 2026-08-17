// features/settings/presentation/pages/preferences-page.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { GenreSelector } from '../../../../shared/components/genre-selector'
import { Button } from '../../../../shared/components/button'
import { useUser } from '../../../profile'
import { LoadingState } from '../../../../shared/components/states'

export function PreferencesPage() {
    const navigate = useNavigate()
    const { user, isLoading, updateGenres, allGenres } = useUser()
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (user) setSelectedGenres(user.genres)
    }, [user])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateGenres(selectedGenres)
            navigate('/settings')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (!user) return null

    return (
        <div className="space-y-6">
            <PageHeader title="Préférences" subtitle="Personnalisez votre expérience musicale" backTo="/settings" />

            <div className="p-5 rounded-xl bg-surface/40 backdrop-blur-sm border border-white/5">
                <h2 className="font-display text-lg font-semibold text-ivory mb-1">Vos genres musicaux</h2>
                <p className="text-sm text-muted mb-5">
                    Sélectionnez les genres que vous aimez pour des recommandations personnalisées.
                </p>
                <GenreSelector
                    genres={allGenres}
                    selected={selectedGenres}
                    onChange={setSelectedGenres}
                    disabled={isSaving}
                />
            </div>

            <div className="flex justify-end">
                <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                </Button>
            </div>
        </div>
    )
}