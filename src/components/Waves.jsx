export default function Waves({ className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="rgba(6,182,212,0.1)"
          className="animate-wave"
        />
        <path
          d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="rgba(20,184,166,0.05)"
          className="animate-wave"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>
    </div>
  )
}
