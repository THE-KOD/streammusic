import { apiClient } from './api-client'

export async function uploadFile(file: File, kind: 'audio' | 'image'): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post<{ url: string }>(`/uploads/${kind}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
}