'use client'

import { useTheme } from '../contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="flex h-9 w-16 items-center rounded-full border p-1 transition-all duration-300"
      style={{
        borderColor: 'var(--c-border-mid)',
        backgroundColor: 'var(--c-glass)',
      }}
    >
      {/* Track */}
      <span
        className="flex h-full w-7 items-center justify-center rounded-full text-xs transition-all duration-300"
        style={{
          marginLeft: isDark ? '0' : '100%',
          transform: isDark ? 'translateX(0)' : 'translateX(-100%)',
          background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)',
        }}
      >
        {isDark ? (
          /* Moon icon */
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a0612" stroke="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          /* Sun icon */
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a0612" stroke="none">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#0a0612" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </span>
    </button>
  )
}
