import { useEffect, useRef } from 'react'

export default function ContactAeroBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = 0
    let height = 0

    // Particle nodes representing flight telemetry waypoints
    const nodeCount = 22
    let nodes = []
    let mouse = { x: -1000, y: -1000, active: false }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = canvas.width = parent.clientWidth
      height = canvas.height = parent.clientHeight

      // Initialize nodes within container bounds
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.4 + 0.25,
        isGold: Math.random() > 0.7,
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw faint coordinate tick marks across the area
      const gridSize = 120
      ctx.fillStyle = 'rgba(0, 83, 149, 0.08)'
      ctx.font = '9px monospace'
      for (let x = 60; x < width; x += gridSize) {
        for (let y = 60; y < height; y += gridSize) {
          // Tiny crosshair
          ctx.fillRect(x - 3, y, 7, 1)
          ctx.fillRect(x, y - 3, 1, 7)
        }
      }

      // Update and draw flight telemetry nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.x += node.vx
        node.y += node.vy

        // Bounce at boundaries
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        // Draw connections to nearby nodes (simulating air traffic corridors)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j]
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.hypot(dx, dy)

          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.16
            ctx.strokeStyle = node.isGold || other.isGold
              ? `rgba(255, 154, 9, ${lineAlpha * 1.3})`
              : `rgba(0, 83, 149, ${lineAlpha})`
            ctx.lineWidth = 1
            ctx.setLineDash([3, 5])
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }

        // Draw subtle connection to mouse if nearby
        if (mouse.active) {
          const mDist = Math.hypot(mouse.x - node.x, mouse.y - node.y)
          if (mDist < 160) {
            const mAlpha = (1 - mDist / 160) * 0.22
            ctx.strokeStyle = `rgba(0, 83, 149, ${mAlpha})`
            ctx.lineWidth = 1.2
            ctx.setLineDash([2, 4])
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }

        // Draw waypoint node dot & pulse ring
        ctx.fillStyle = node.isGold
          ? `rgba(255, 154, 9, ${node.alpha * 0.9})`
          : `rgba(0, 83, 149, ${node.alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="contact-aero-bg" aria-hidden="true">
      {/* Soft ambient lighting gradients */}
      <div className="contact-aero-bg__glow contact-aero-bg__glow--1" />
      <div className="contact-aero-bg__glow contact-aero-bg__glow--2" />

      {/* Aeronautical flight telemetry canvas */}
      <canvas ref={canvasRef} className="contact-aero-bg__canvas" />

      {/* Decorative Compass & Radar rings */}
      <svg className="contact-aero-bg__dial" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="160" stroke="rgba(0, 83, 149, 0.05)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="110" stroke="rgba(0, 83, 149, 0.04)" strokeWidth="1" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(0, 83, 149, 0.04)" strokeWidth="1" strokeDasharray="3 7" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(0, 83, 149, 0.04)" strokeWidth="1" strokeDasharray="3 7" />
      </svg>

      {/* Aviation Telemetry Coordinates Badge */}
      <div className="contact-aero-bg__hud">
        <code>OPERATIONS RADAR • FREQ 121.50 MHz • DISPATCH GRID MIA-LIM</code>
      </div>
    </div>
  )
}
