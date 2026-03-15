export default function GradientText({ children, className = "", animated = true }) {
  return (
    <span
      className={`bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-300 bg-clip-text text-transparent ${
        animated ? 'animate-pulse' : ''
      } ${className}`}
    >
      {children}
    </span>
  )
}
