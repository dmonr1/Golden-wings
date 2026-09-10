import { useEffect, useRef } from 'react'
import realisticJet from '../assets/realistic-airplane.webp'

// Minimalist Stroke Clouds (fill: none, stroke only)
function StrokeCloud1({ className = '' }) {
  return (
    <svg viewBox="0 0 180 50" fill="none" className={`cloud-stroke ${className}`} preserveAspectRatio="none">
      <path
        d="M 15 42 L 165 42 M 35 42 C 32 30, 48 22, 60 27 C 70 12, 105 10, 118 24 C 128 20, 145 25, 148 42"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 65 34 C 72 26, 92 26, 100 34"
        stroke="#e2e8f0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StrokeCloud2({ className = '' }) {
  return (
    <svg viewBox="0 0 220 55" fill="none" className={`cloud-stroke ${className}`} preserveAspectRatio="none">
      <path
        d="M 20 46 L 200 46 M 45 46 C 42 34, 60 26, 75 31 C 86 14, 126 12, 142 27 C 154 22, 175 27, 180 46"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="8" y1="46" x2="14" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="206" y1="46" x2="214" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function StrokeCloud3({ className = '' }) {
  return (
    <svg viewBox="0 0 150 45" fill="none" className={`cloud-stroke ${className}`} preserveAspectRatio="none">
      <path
        d="M 12 38 L 138 38 M 28 38 C 26 28, 42 22, 54 26 C 64 12, 94 12, 104 24 C 114 22, 126 27, 128 38"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Airplane404Scene() {
  const aircraftRef = useRef(null)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0, rot: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      const { innerWidth, innerHeight } = window
      const isMobile = innerWidth < 768

      // Normalized coordinates from -1 to 1
      const nx = (clientX / innerWidth - 0.5) * 2
      const ny = (clientY / innerHeight - 0.5) * 2

      // Responsive flight envelope: wide on desktop, gently centered on mobile
      const rangeX = isMobile ? Math.min(innerWidth * 0.07, 30) : Math.min(innerWidth * 0.22, 220)
      const rangeY = isMobile ? Math.min(innerHeight * 0.05, 18) : Math.min(innerHeight * 0.16, 110)

      targetPos.current.x = nx * rangeX
      targetPos.current.y = ny * rangeY
    }

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      if (e.touches?.[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => {
      // Smoothly return to center when touch is released on mobile
      targetPos.current.x = 0
      targetPos.current.y = 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // Continuous 60-120fps physics loop with aerodynamic inertia & lerping
    const render = (time) => {
      const isMobile = window.innerWidth < 768
      const target = targetPos.current
      const current = currentPos.current

      // Inertial damping lerp factor (aerodynamic resistance / glide momentum)
      const lerp = 0.048
      current.x += (target.x - current.x) * lerp
      current.y += (target.y - current.y) * lerp

      // Dynamic banking and pitch based on velocity vector + position
      const diffY = target.y - current.y
      const diffX = target.x - current.x
      const maxRot = isMobile ? 3.5 : 7
      const targetRot = Math.max(-maxRot, Math.min(maxRot, diffY * 0.035 + diffX * 0.015))
      current.rot += (targetRot - current.rot) * 0.06

      // Gentle ambient air thermal oscillation (floating living aircraft)
      const ambientFloatY = Math.sin(time * 0.0018) * (isMobile ? 3.5 : 8)
      const ambientFloatRot = Math.cos(time * 0.0014) * (isMobile ? 0.4 : 0.8)

      const posX = current.x
      const posY = current.y + ambientFloatY
      const rot = current.rot + ambientFloatRot

      if (aircraftRef.current) {
        aircraftRef.current.style.transform = `translate3d(calc(-50% + ${posX.toFixed(
          2
        )}px), calc(-50% + ${posY.toFixed(2)}px), 0) rotate(${rot.toFixed(2)}deg)`
      }

      rafId.current = requestAnimationFrame(render)
    }

    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div className="airplane-scene airplane-scene--white" aria-hidden="true">
      {/* Layer 1: High Slow Stroke Clouds (Lines Only) */}
      <div className="airplane-scene__layer airplane-scene__layer--stroke-back">
        <div className="airplane-scene__stroke-track">
          <StrokeCloud1 className="cloud--s-1" />
          <StrokeCloud2 className="cloud--s-2" />
          <StrokeCloud3 className="cloud--s-3" />
          <StrokeCloud1 className="cloud--s-4" />
          <StrokeCloud2 className="cloud--s-5" />
          <StrokeCloud3 className="cloud--s-6" />
        </div>
      </div>

      {/* Layer 2: Midground Stroke Clouds (Lines Only) */}
      <div className="airplane-scene__layer airplane-scene__layer--stroke-mid">
        <div className="airplane-scene__stroke-track">
          <StrokeCloud2 className="cloud--m-1" />
          <StrokeCloud3 className="cloud--m-2" />
          <StrokeCloud1 className="cloud--m-3" />
          <StrokeCloud2 className="cloud--m-4" />
          <StrokeCloud3 className="cloud--m-5" />
        </div>
      </div>

      {/* Layer 3: Minimalist Wind Speed Lines */}
      <div className="airplane-scene__wind-streaks">
        <span className="wind-streak streak-1" />
        <span className="wind-streak streak-2" />
        <span className="wind-streak streak-3" />
        <span className="wind-streak streak-4" />
        <span className="wind-streak streak-5" />
        <span className="wind-streak streak-6" />
      </div>

      {/* Layer 4: The Realistic Center Airplane with Wide Inertia Flight */}
      <div className="airplane-scene__center-aircraft" ref={aircraftRef}>
        <div className="airplane-scene__flight-physic-loop">
          {/* Realistic Airplane Image (Transparent 53KB WebP) */}
          <img
            src={realisticJet}
            alt="Golden Wings Aircraft in Flight"
            className="airplane-scene__realistic-img"
            loading="eager"
          />

          {/* Wingtip Navigation Strobe Lights */}
          <span className="airplane-beacon beacon--wingtip-left" />
          <span className="airplane-beacon beacon--tail-strobe" />

          {/* Contrail Streams */}
          <div className="airplane-scene__wind-contrails">
            <span className="wind-contrail contrail-wingtip" />
            <span className="wind-contrail contrail-engine-1" />
            <span className="wind-contrail contrail-engine-2" />
          </div>
        </div>
      </div>

      {/* Layer 5: Fast Foreground Stroke Clouds (Lines Only) */}
      <div className="airplane-scene__layer airplane-scene__layer--stroke-front">
        <div className="airplane-scene__stroke-track">
          <StrokeCloud1 className="cloud--f-1" />
          <StrokeCloud3 className="cloud--f-2" />
          <StrokeCloud2 className="cloud--f-3" />
        </div>
      </div>
    </div>
  )
}
