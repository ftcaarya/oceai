import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { callFirstMate } from '../utils/api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

function DataCard({ label, value, sub, icon }) {
  return (
    <div className="glass rounded-xl p-4 group hover:glow-sm transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-mono text-base-500 tracking-wider uppercase">{label}</span>
        <span className="text-base-500">{icon}</span>
      </div>
      <p className="text-lg font-semibold text-base-50">{value}</p>
      {sub && <p className="text-xs text-base-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function FishPredictor() {
  const [selectedLat, setSelectedLat] = useState(40.7128)
  const [selectedLon, setSelectedLon] = useState(-74.0060)
  const [waterTemp, setWaterTemp] = useState(65)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLocationSelect = (lat, lon) => {
    setSelectedLat(lat)
    setSelectedLon(lon)
  }

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await callFirstMate(
        `What are the best fishing conditions at coordinates ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}?`,
        selectedLat,
        selectedLon,
        waterTemp,
        []
      )
      if (result.success) {
        setResults(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to connect. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-teal/50" />
            <span className="font-mono text-[11px] text-teal tracking-[0.15em] uppercase">First Mate AI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-50 tracking-tight mb-2">
            Fish Prediction Engine
          </h1>
          <p className="text-sm text-base-400 max-w-lg">
            Click anywhere on the map to set your fishing location. We'll analyze tides, weather, moon phase, and species migration data.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-2xl overflow-hidden" style={{ height: '460px' }}>
              <MapContainer center={[selectedLat, selectedLon]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                <Marker position={[selectedLat, selectedLon]}>
                  <Popup>
                    <span className="text-sm font-medium">
                      {selectedLat.toFixed(4)}, {selectedLon.toFixed(4)}
                    </span>
                  </Popup>
                </Marker>
                <Circle
                  center={[selectedLat, selectedLon]}
                  radius={5000}
                  pathOptions={{
                    color: '#38bdf8',
                    fillColor: '#38bdf8',
                    fillOpacity: 0.06,
                    weight: 1,
                    opacity: 0.3,
                  }}
                />
              </MapContainer>
            </div>

            {/* Coordinates & Controls */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-xl p-3">
                <label className="block text-[10px] font-mono text-base-500 tracking-wider uppercase mb-1.5">Lat</label>
                <input
                  type="number"
                  value={selectedLat.toFixed(4)}
                  onChange={(e) => setSelectedLat(parseFloat(e.target.value))}
                  step="0.0001"
                  className="w-full bg-base-900 border border-base-700/50 rounded-lg px-3 py-1.5 text-sm text-base-100 font-mono"
                />
              </div>
              <div className="glass rounded-xl p-3">
                <label className="block text-[10px] font-mono text-base-500 tracking-wider uppercase mb-1.5">Lon</label>
                <input
                  type="number"
                  value={selectedLon.toFixed(4)}
                  onChange={(e) => setSelectedLon(parseFloat(e.target.value))}
                  step="0.0001"
                  className="w-full bg-base-900 border border-base-700/50 rounded-lg px-3 py-1.5 text-sm text-base-100 font-mono"
                />
              </div>
              <div className="glass rounded-xl p-3">
                <label className="block text-[10px] font-mono text-base-500 tracking-wider uppercase mb-1.5">Water Temp</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(parseFloat(e.target.value))}
                    min="30"
                    max="90"
                    className="w-full bg-base-900 border border-base-700/50 rounded-lg px-3 py-1.5 text-sm text-base-100 font-mono"
                  />
                  <span className="text-base-500 text-xs">°F</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFetch}
              disabled={loading}
              className="w-full py-3 bg-accent text-base-950 font-semibold text-sm rounded-xl hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-base-950/30 border-t-base-950 rounded-full animate-spin" />
                  Analyzing conditions...
                </>
              ) : (
                <>
                  Get Predictions
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-4">
            {error && (
              <div className="glass rounded-xl p-4 border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!results && !loading && !error && (
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal/10 border border-teal/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p className="text-base-300 text-sm mb-1">No predictions yet</p>
                <p className="text-base-500 text-xs">
                  Select a location on the map and click "Get Predictions" to see fishing intelligence.
                </p>
              </div>
            )}

            {loading && (
              <div className="glass rounded-2xl p-8 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto mb-4" />
                <p className="text-base-300 text-sm">Fetching conditions...</p>
                <p className="text-base-500 text-xs mt-1">Querying NOAA, weather, and species data</p>
              </div>
            )}

            {results && (
              <div className="space-y-3 animate-fade-up">
                {results.conditions?.weather && (
                  <DataCard
                    label="Temperature"
                    value={`${results.conditions.weather.temperature_f}°F`}
                    sub={`Wind: ${results.conditions.weather.wind_speed_mph || '—'} mph`}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                      </svg>
                    }
                  />
                )}

                {results.conditions?.moon && (
                  <DataCard
                    label="Moon Phase"
                    value={results.conditions.moon.phase_name}
                    sub={`Illumination: ${results.conditions.moon.illumination || '—'}%`}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    }
                  />
                )}

                {results.conditions?.tides && results.conditions.tides.length > 0 && (
                  <DataCard
                    label="Next Tide"
                    value={`${results.conditions.tides[0].type || 'Tide'}`}
                    sub={results.conditions.tides[0].time || '—'}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      </svg>
                    }
                  />
                )}

                {results.conditions?.species && results.conditions.species.length > 0 && (
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-base-500 tracking-wider uppercase">Species Nearby</span>
                      <span className="text-[10px] font-mono text-base-600">{results.conditions.species.length} found</span>
                    </div>
                    <div className="space-y-2">
                      {results.conditions.species.slice(0, 5).map((s, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-base-800/50 last:border-0">
                          <span className="text-sm text-base-200">{s.species}</span>
                          {s.probability && (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-base-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-accent to-teal"
                                  style={{ width: `${Math.min(s.probability * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-base-500 w-8 text-right">
                                {(s.probability * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.response && (
                  <div className="glass rounded-xl p-5 border-accent/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-accent">First Mate Analysis</span>
                    </div>
                    <div className="text-sm text-base-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                      {results.response}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
