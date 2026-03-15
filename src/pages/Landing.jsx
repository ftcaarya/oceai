import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback } from 'react'

function HolographicWave() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const W = rect.width
    const H = rect.height
    const t = performance.now() * 0.001

    ctx.clearRect(0, 0, W, H)

    // Grid params
    const cols = 32
    const rows = 20
    const cellW = W / (cols - 1)
    const cellH = H / (rows - 1)

    // Perspective
    const vanishY = H * 0.15
    const horizonFade = 0.3

    // Build height map
    const heightMap = []
    for (let r = 0; r < rows; r++) {
      heightMap[r] = []
      for (let c = 0; c < cols; c++) {
        const nx = c / (cols - 1)
        const ny = r / (rows - 1)

        // Layered waves
        const wave1 = Math.sin(nx * 4 + t * 0.8) * Math.cos(ny * 3 + t * 0.5) * 28
        const wave2 = Math.sin(nx * 7 - t * 1.2 + ny * 2) * 12
        const wave3 = Math.cos(nx * 3 + ny * 5 + t * 0.6) * 8

        // Mouse influence
        const dx = nx - mouseRef.current.x
        const dy = ny - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mouseWave = Math.exp(-dist * dist * 8) * Math.sin(dist * 20 - t * 3) * 18

        heightMap[r][c] = wave1 + wave2 + wave3 + mouseWave
      }
    }

    // Project 3D point
    const project = (c, r, h) => {
      const x = c * cellW
      const baseY = r * cellH
      const perspective = 0.3 + 0.7 * (r / (rows - 1))
      const py = vanishY + (baseY - vanishY) * perspective
      const px = W * 0.5 + (x - W * 0.5) * perspective
      return { x: px, y: py - h * perspective }
    }

    // Draw horizontal grid lines (front to back)
    for (let r = rows - 1; r >= 0; r--) {
      const progress = r / (rows - 1)
      const alpha = horizonFade + (1 - horizonFade) * progress

      ctx.beginPath()
      for (let c = 0; c < cols; c++) {
        const p = project(c, r, heightMap[r][c])
        if (c === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      }

      // Gradient color from accent to teal based on height
      const avgH = heightMap[r].reduce((a, b) => a + b, 0) / cols
      const hue = 190 + avgH * 0.5
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha * 0.4})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw vertical grid lines
    for (let c = 0; c < cols; c += 2) {
      const progress = c / (cols - 1)
      ctx.beginPath()
      for (let r = 0; r < rows; r++) {
        const p = project(c, r, heightMap[r][c])
        if (r === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      }
      ctx.strokeStyle = `rgba(56, 189, 248, 0.12)`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Glow layer — redraw front rows with more intensity
    for (let r = rows - 1; r >= Math.floor(rows * 0.6); r--) {
      const progress = (r - rows * 0.6) / (rows * 0.4)
      ctx.beginPath()
      for (let c = 0; c < cols; c++) {
        const p = project(c, r, heightMap[r][c])
        if (c === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      }
      ctx.strokeStyle = `rgba(45, 212, 191, ${progress * 0.2})`
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Scanline effect
    const scanY = (t * 40) % H
    ctx.beginPath()
    ctx.moveTo(0, scanY)
    ctx.lineTo(W, scanY)
    ctx.strokeStyle = `rgba(56, 189, 248, 0.06)`
    ctx.lineWidth = 1
    ctx.stroke()

    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [draw])

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: 0.5, y: 0.5 } }}
    >
      {/* Glow base */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.06] via-transparent to-transparent rounded-2xl" />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* Holographic overlay shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-teal/[0.02] to-transparent rounded-2xl pointer-events-none" />
      {/* "HOLOGRAM" label */}
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        <span className="font-mono text-[9px] text-teal/60 tracking-[0.25em] uppercase">Live Waveform</span>
      </div>
    </div>
  )
}

function FloatingOrb({ className, delay = 0 }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl animate-drift ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

function FeatureRow({ number, title, desc, tags, href, reverse }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(href)}
      className={`group cursor-pointer grid md:grid-cols-2 gap-8 md:gap-16 items-center py-12 md:py-20 border-t border-base-800/50 ${reverse ? 'direction-rtl' : ''}`}
      style={reverse ? { direction: 'rtl' } : {}}
    >
      <div style={{ direction: 'ltr' }}>
        <span className="font-mono text-xs text-base-500 tracking-widest uppercase mb-4 block">
          0{number}
        </span>
        <h3 className="text-3xl md:text-4xl font-bold text-base-50 mb-4 group-hover:text-gradient transition-all duration-500 leading-tight">
          {title}
        </h3>
        <p className="text-base-300 text-base leading-relaxed mb-6 max-w-md">
          {desc}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[11px] font-mono font-medium tracking-wider uppercase rounded-full border border-base-700 text-base-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all duration-300">
          Explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      {/* Visual Block */}
      <div style={{ direction: 'ltr' }} className="relative aspect-[4/3] rounded-2xl overflow-hidden glass group-hover:glow transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal/5" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            {number === 1 ? (
              <div className="space-y-3">
                <div className="w-full max-w-[240px] mx-auto h-8 rounded-lg bg-base-800/80 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent/40" />
                  <div className="flex-1 h-3 rounded bg-base-700/50" />
                </div>
                <div className="w-full max-w-[240px] mx-auto space-y-2 pt-2">
                  <div className="flex justify-end"><div className="h-6 w-32 rounded-lg bg-accent/10 border border-accent/20" /></div>
                  <div className="flex justify-start"><div className="h-10 w-40 rounded-lg bg-base-800/60 border border-base-700/50" /></div>
                  <div className="flex justify-end"><div className="h-6 w-24 rounded-lg bg-accent/10 border border-accent/20" /></div>
                  <div className="flex justify-start"><div className="h-14 w-44 rounded-lg bg-base-800/60 border border-base-700/50" /></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-full max-w-[260px] mx-auto aspect-video rounded-xl bg-base-800/60 border border-base-700/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-accent/5" />
                  <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-accent/40 animate-pulse-ring" />
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    <div className="w-8 h-5 rounded bg-base-700/50 text-[8px] flex items-center justify-center text-base-400 font-mono">N</div>
                    <div className="w-8 h-5 rounded bg-base-700/50 text-[8px] flex items-center justify-center text-base-400 font-mono">W</div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="h-7 w-16 rounded-lg bg-teal/10 border border-teal/20" />
                  <div className="h-7 w-20 rounded-lg bg-accent/10 border border-accent/20" />
                  <div className="h-7 w-14 rounded-lg bg-teal/10 border border-teal/20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <FloatingOrb className="w-[600px] h-[600px] bg-accent/[0.04] top-[-200px] left-[-200px]" delay={0} />
      <FloatingOrb className="w-[500px] h-[500px] bg-teal/[0.03] top-[20%] right-[-150px]" delay={5} />
      <FloatingOrb className="w-[400px] h-[400px] bg-accent/[0.03] bottom-[10%] left-[10%]" delay={10} />

      {/* Noise overlay */}
      <div className="fixed inset-0 noise pointer-events-none z-10 opacity-40" />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text */}
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div className="animate-fade-up flex items-center gap-3 mb-8" style={{ animationDelay: '0.1s' }}>
                <div className="h-px w-12 bg-accent/50" />
                <span className="font-mono text-[11px] text-accent tracking-[0.2em] uppercase">
                  Ocean Intelligence Platform
                </span>
              </div>

              {/* Main heading - editorial style with serif accent */}
              <h1 className="animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[0.95] mb-8" style={{ animationDelay: '0.2s' }}>
                <span className="text-base-50">Understand</span>
                <br />
                <span className="text-base-50">the </span>
                <span className="font-display italic text-gradient">ocean</span>
                <span className="text-base-50">.</span>
              </h1>

              {/* Subheading */}
              <p className="animate-fade-up text-lg md:text-xl text-base-300 max-w-lg leading-relaxed mb-10" style={{ animationDelay: '0.35s' }}>
                AI-powered marine intelligence. Real-time fishing predictions, ocean policy insights, and research — all in one place.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: '0.5s' }}>
                <button
                  onClick={() => navigate('/fish')}
                  className="group px-6 py-3 bg-accent text-base-950 font-semibold text-sm rounded-xl hover:bg-accent-light transition-all duration-300 flex items-center gap-2"
                >
                  Start Predicting
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-6 py-3 text-base-200 font-medium text-sm rounded-xl border border-base-700 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                >
                  Open Chat
                </button>
              </div>
            </div>

            {/* Right — Holographic Wave */}
            <div className="animate-fade-up relative hidden lg:block" style={{ animationDelay: '0.4s' }}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass glow">
                <HolographicWave />
              </div>
              {/* Reflection glow beneath */}
              <div className="absolute -bottom-8 inset-x-8 h-16 bg-accent/[0.08] blur-2xl rounded-full" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base-500 animate-fade-in"
            style={{ animationDelay: '1.5s', opacity: scrollY > 50 ? 0 : 1, transition: 'opacity 0.3s' }}
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-base-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <FeatureRow
            number={1}
            title="Ocean Intelligence Chat"
            desc="Ask anything about marine policy, ocean regulations, conservation research, or fisheries law. Get expert-level AI analysis backed by real data."
            tags={['Policy', 'Research', 'Conservation', 'AI']}
            href="/chat"
          />
          <FeatureRow
            number={2}
            title="Fish Prediction Engine"
            desc="Select any coastal location and get real-time predictions on species, tides, weather conditions, and optimal fishing windows. Powered by NOAA data and migration models."
            tags={['Real-time', 'NOAA', 'Species', 'Weather']}
            href="/fish"
            reverse
          />
        </div>
      </section>

      {/* ===== TECH STRIP ===== */}
      <section className="relative border-t border-base-800/50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Species Tracked', value: '8+' },
              { label: 'Data Source', value: 'NOAA' },
              { label: 'AI Model', value: 'Claude' },
              { label: 'Coverage', value: 'Coastal US' },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-base-50 mb-1">{stat.value}</p>
                <p className="text-xs font-mono text-base-500 tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-base-800/50 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-base-500">
            Built for Smath Hacks 2026 &mdash; UI Track
          </p>
          <div className="flex items-center gap-4 text-xs text-base-500">
            <span className="font-mono">OceAI</span>
            <span className="text-base-700">/</span>
            <span>First Mate AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
