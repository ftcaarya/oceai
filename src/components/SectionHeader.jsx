import GradientText from './GradientText'

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <GradientText>{title}</GradientText>
      </h2>
      <p className="text-lg text-ocean-300 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}
