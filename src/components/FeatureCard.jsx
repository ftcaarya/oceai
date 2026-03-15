export default function FeatureCard({ icon, title, description, cta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-full text-left bg-gradient-to-br from-ocean-800/40 to-ocean-900/40 backdrop-blur-sm border border-ocean-700/50 rounded-xl p-6 hover:border-cyan-300/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-glow group"
    >
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-cyan-300 mb-2 group-hover:text-teal-400 transition">{title}</h3>
      <p className="text-ocean-300 text-sm mb-4 flex-grow">{description}</p>
      <div className="text-cyan-300 font-semibold text-sm group-hover:text-teal-400 transition">
        {cta} →
      </div>
    </button>
  )
}
