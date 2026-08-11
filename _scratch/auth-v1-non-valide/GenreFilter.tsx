import { useState } from 'react'

// Simulé - valeurs fournies par backend
const genres = ['Tous', 'Pop', 'Hip-Hop', 'Afrobeat', 'Rock', 'Jazz']

export function GenreFilter() {
    const [selected, setSelected] = useState('Tous')

    return (
        <div>
            <label className="text-sm text-ivory font-body block mb-1">Genre</label>
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            >
                {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
        </div>
    )
}