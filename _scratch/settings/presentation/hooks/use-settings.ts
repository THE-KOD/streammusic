import { useState } from 'react'

export interface UserSettings {
    hasPassword: boolean
    isPremium: boolean
}

export function useSettings() {
    const [settings] = useState<UserSettings>({
        hasPassword: true,
        isPremium: false,
    })

    return { settings }
}