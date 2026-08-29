import { apiClient } from '../../../infrastructure/http/api-client'

export const followsService = {
    async getStatus(artistId: string): Promise<boolean> {
        const { data } = await apiClient.get<{ isFollowing: boolean }>(`/follows/${artistId}/status`)
        return data.isFollowing
    },
    async follow(artistId: string): Promise<void> {
        await apiClient.post(`/follows/${artistId}`)
    },
    async unfollow(artistId: string): Promise<void> {
        await apiClient.delete(`/follows/${artistId}`)
    },
}