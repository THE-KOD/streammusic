import { useEffect, useState } from 'react'
import { adminUsersService } from '../../data/admin-mock.service'
import type { AdminUser } from '../../domain/admin.entity'

export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        adminUsersService.list()
            .then((data) => { setUsers(data); setError(null) })
            .catch(() => setError('Impossible de charger les utilisateurs.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const suspendUser = async (userId: string) => { await adminUsersService.toggleSuspend(userId); reload() }
    const deleteUser = async (userId: string) => { await adminUsersService.remove(userId); reload() }

    return { users, isLoading, error, suspendUser, deleteUser }
}