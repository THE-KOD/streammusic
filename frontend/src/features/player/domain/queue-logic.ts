export type RepeatMode = 'none' | 'all' | 'one'

export function getNextIndex(
    queueLength: number,
    currentIndex: number,
    repeat: RepeatMode,
    shuffle: boolean,
): number | null {
    if (queueLength === 0) return null
    if (repeat === 'one') return currentIndex

    if (shuffle) {
        if (queueLength === 1) return repeat === 'all' ? 0 : null
        let randomIndex = currentIndex
        while (randomIndex === currentIndex) randomIndex = Math.floor(Math.random() * queueLength)
        return randomIndex
    }

    const next = currentIndex + 1
    if (next >= queueLength) return repeat === 'all' ? 0 : null
    return next
}

export function getPreviousIndex(queueLength: number, currentIndex: number, shuffle: boolean): number | null {
    if (queueLength === 0) return null
    if (shuffle) {
        if (queueLength === 1) return 0
        let randomIndex = currentIndex
        while (randomIndex === currentIndex) randomIndex = Math.floor(Math.random() * queueLength)
        return randomIndex
    }
    if (currentIndex <= 0) return null
    return currentIndex - 1
}

export function reorderQueue<T>(queue: T[], from: number, to: number): T[] {
    const next = [...queue]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
}