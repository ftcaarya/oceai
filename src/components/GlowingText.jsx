export default function GlowingText({ children, className = '' }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Blur layer for glow effect */}
      <p className="absolute inset-0 text-transparent bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-300 bg-clip-text filter blur-md opacity-40" style={{textShadow: '0 0 30px rgba(6, 182, 212, 0.6)'}}>
        {children}
      </p>
      {/* Main text */}
      <p className="relative bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
        {children}
      </p>
    </div>
  )
}
