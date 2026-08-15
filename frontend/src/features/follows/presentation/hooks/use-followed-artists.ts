import { useEffect, useState } from 'react'
import { followsService } from '../../data/follows-mock.service'
import type { FollowedArtist } from '../../domain/follow.entity'

export function useFollowedArtists() {
    const [artists, setArtists] = useState<FollowedArtist[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        followsService.listFollowed().then((data) => { setArtists(data); setIsLoading(false) })
    }, [])

    return { artists, isLoading }
}