const FAKE_DELAY_MS = 500

export const followsService = {
    async follow(_artistId: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
    },
    async unfollow(_artistId: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
    },
}