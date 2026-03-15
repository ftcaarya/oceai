import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Chat', path: '/chat' },
    { label: 'Predict', path: '/fish' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="glass-strong rounded-2xl px-6 py-3 max-w-5xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-teal flex items-center justify-center overflow-hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060d18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12" />
                <path d="M2 12C2 12 5 20 12 20C19 20 22 12 22 12" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-base-50 font-semibold text-[15px] tracking-tight">OceAI</span>
              <span className="text-base-400 text-[11px] ml-1.5 font-mono tracking-wide hidden sm:inline">v1.0</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-accent bg-accent/10'
                    : 'text-base-300 hover:text-base-100 hover:bg-base-800/50'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            ))}
            <div className="w-px h-5 bg-base-700 mx-2" />
            <a
              href="https://github.com/ftcaarya/oceai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-400 hover:text-base-200 transition-colors p-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-base-300 hover:text-base-100 p-1 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isOpen ? (
                <><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>
              ) : (
                <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="20" y2="17" /></>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden glass-strong rounded-2xl mt-2 p-3 max-w-5xl mx-auto animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-accent bg-accent/10'
                    : 'text-base-300 hover:text-base-100 hover:bg-base-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
