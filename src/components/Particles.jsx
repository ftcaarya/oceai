export default function Particles({ count = 15, className = "" }) {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
    left: Math.random() * 100,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.2
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-cyan-300 rounded-full"
          style={{
            left: `${p.left}%`,
            top: '-5px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `slide-up ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
    </div>
  )
}
