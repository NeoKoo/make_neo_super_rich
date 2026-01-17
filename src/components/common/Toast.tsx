
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  const typeStyles: Record<string, string> = {
    success: 'bg-status-success',
    error: 'bg-status-error',
    warning: 'bg-status-warning',
    info: 'bg-status-info'
  };

  const typeIcons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <>
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`
                ${typeStyles[toast.type]} 
                text-white 
                px-4 
                py-3 
                rounded-lg 
                shadow-lg 
                pointer-events-auto 
                flex 
                items-center 
                gap-3 
                animate-fade-in
              `}
            >
              <span className="text-lg">{typeIcons[toast.type]}</span>
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
