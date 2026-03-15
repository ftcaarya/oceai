export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{animationDelay: '2s'}} />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{animationDelay: '4s'}} />
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-transparent to-teal-500" />
      </div>
    </div>
  )
}
