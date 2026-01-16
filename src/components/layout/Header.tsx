interface HeaderProps {
  title?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showBack?: boolean;
}

export function Header({ title, onBack, rightElement, showBack = false }: HeaderProps) {
  return (
    <header className="bg-background-secondary border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="text-text-primary hover:text-primary transition-colors duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold text-text-primary">
              {title}
            </h1>
          )}
        </div>
        
        {rightElement}
      </div>
    </header>
  );
}
