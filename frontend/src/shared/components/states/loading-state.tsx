import {Spinner} from "../spinner.tsx";

export function LoadingState({ message = 'Chargement...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Spinner size="md" />
            <p className="text-sm text-muted">{message}</p>
        </div>
    )
}