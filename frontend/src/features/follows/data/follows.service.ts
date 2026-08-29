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
    async listFollowed(): Promise<{ id: string; name: string; imageUrl?: string }[]> {
        const { data } = await apiClient.get<{ id: string; pseudo: string; photoProfilUrl?: string }[]>('/follows')
        return data.map((a) => ({ id: a.id, name: a.pseudo, imageUrl: a.photoProfilUrl }))
    },
}