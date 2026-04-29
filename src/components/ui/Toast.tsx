'use client'

interface ToastProps {
    message: string
    type: 'info' | 'success'
    visible: boolean
    onClose: () => void
}

export function Toast({ message, type, visible, onClose }: ToastProps) {
    if (!visible) return null

    const baseClasses = 'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-opacity duration-300 ease-in-out'
    const typeClasses = type === 'success'
        ? 'bg-green-500'
        : 'bg-blue-500'

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
        </div>
    )
}
