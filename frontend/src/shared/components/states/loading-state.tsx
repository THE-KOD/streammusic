import { Spinner } from '../spinner'

export function LoadingState() {
    return (
        <div className="flex justify-center items-center py-12">
            <Spinner size="md" />
        </div>
    )
}