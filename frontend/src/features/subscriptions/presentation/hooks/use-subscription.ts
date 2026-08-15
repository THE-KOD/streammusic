import { useSubscriptionStore } from '../store/subscription-store'

export function useSubscription() {
    const plan = useSubscriptionStore((s) => s.plan)
    const startDate = useSubscriptionStore((s) => s.startDate)
    const endDate = useSubscriptionStore((s) => s.endDate)
    const activatePremium = useSubscriptionStore((s) => s.activatePremium)

    return {
        isPremium: plan === 'PREMIUM',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        activatePremium,
    }
}