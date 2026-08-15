import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubscriptionPlan } from '../../domain/subscription.entity'

interface SubscriptionState {
    plan: SubscriptionPlan
    startDate: string | null
    endDate: string | null
    activatePremium: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set) => ({
            plan: 'GRATUIT',
            startDate: null,
            endDate: null,
            activatePremium: () => {
                const now = new Date()
                const end = new Date(now)
                end.setMonth(end.getMonth() + 1)
                set({ plan: 'PREMIUM', startDate: now.toISOString(), endDate: end.toISOString() })
            },
        }),
        { name: 'subscription-storage' },
    ),
)