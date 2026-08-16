// features/admin/presentation/components/admin-page-header.tsx

interface AdminPageHeaderProps {
    title: string
    description?: string
    icon?: React.ReactNode
}

export function AdminPageHeader({ title, description, icon }: AdminPageHeaderProps) {
    return (
        <div className="mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-amber/10 text-amber">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="font-display text-4xl font-semibold text-ivory tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted font-body text-sm mt-0.5">{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}