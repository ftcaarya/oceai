import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'

export default function ResearchHub() {
  const [selectedCard, setSelectedCard] = useState(null)

  const researchTopics = [
    {
      title: 'Ocean Conservation',
      icon: '🌍',
      description: 'Protecting marine ecosystems and biodiversity',
      details: 'Learn about marine protected areas, species conservation, and ecosystem restoration efforts worldwide.'
    },
    {
      title: 'Marine Biology',
      icon: '🐙',
      description: 'Study of ocean life and creatures',
      details: 'Explore diverse marine species, their habitats, behaviors, and ecological roles in ocean food webs.'
    },
    {
      title: 'Climate Impact',
      icon: '🌊',
      description: 'Ocean acidification and warming trends',
      details: 'Understand how climate change affects sea levels, temperature, pH, and marine life distribution.'
    },
    {
      title: 'Fisheries Management',
      icon: '🎣',
      description: 'Sustainable fishing practices',
      details: 'Discover best practices for commercial and recreational fishing that maintain fish populations.'
    },
    {
      title: 'Oceanography',
      icon: '🧬',
      description: 'Physical and chemical ocean science',
      details: 'Deep dive into ocean currents, nutrient cycles, pressure zones, and water composition.'
    },
    {
      title: 'Coral Reefs',
      icon: '🪸',
      description: 'Protecting our underwater rainforests',
      details: 'Learn about coral ecosystems, bleaching events, and coral restoration initiatives globally.'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader title="Research Hub" subtitle="Explore ocean science and data" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
              className="group cursor-pointer bg-gradient-to-br from-ocean-700 to-ocean-900 border border-cyan-300 border-opacity-20 rounded-xl p-6 hover:border-opacity-100 transition-all duration-300 hover:shadow-glow"
            >
              <p className="text-4xl mb-3">{topic.icon}</p>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{topic.title}</h3>
              <p className="text-ocean-300 text-sm mb-4">{topic.description}</p>
              {selectedCard === idx && (
                <div className="mt-4 pt-4 border-t border-cyan-300 border-opacity-30 animate-slide-up">
                  <p className="text-ocean-200 text-sm">{topic.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-ocean-700 to-ocean-900 rounded-xl p-8 border border-cyan-300 border-opacity-20">
          <h3 className="text-2xl font-bold text-white mb-4">Featured Research</h3>
          <p className="text-ocean-200 mb-4">Real-time ocean data continuously updates this hub with latest research findings, species information, and conservation updates.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-ocean-800 p-4 rounded-lg">
              <p className="text-cyan-300 font-bold">Tidal Predictions</p>
              <p className="text-ocean-300 text-sm mt-1">NOAA 12 coastal stations</p>
            </div>
            <div className="bg-ocean-800 p-4 rounded-lg">
              <p className="text-cyan-300 font-bold">Weather Data</p>
              <p className="text-ocean-300 text-sm mt-1">Real-time conditions</p>
            </div>
            <div className="bg-ocean-800 p-4 rounded-lg">
              <p className="text-cyan-300 font-bold">Moon Phases</p>
              <p className="text-ocean-300 text-sm mt-1">Lunar impact analysis</p>
            </div>
            <div className="bg-ocean-800 p-4 rounded-lg">
              <p className="text-cyan-300 font-bold">Species Info</p>
              <p className="text-ocean-300 text-sm mt-1">8 tracked species</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
