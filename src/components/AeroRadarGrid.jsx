export default function AeroRadarGrid() {
  return (
    <div className="aero-radar-grid" aria-hidden="true">
      {/* Background Coordinate Grid */}
      <div className="aero-radar__grid-lines" />

      {/* Rotating Radar Rings & Sweep Beam */}
      <div className="aero-radar__scope">
        <div className="aero-radar__ring aero-radar__ring--1" />
        <div className="aero-radar__ring aero-radar__ring--2" />
        <div className="aero-radar__ring aero-radar__ring--3" />
        <div className="aero-radar__ring aero-radar__ring--4" />

        {/* Crosshair Axes */}
        <div className="aero-radar__axis aero-radar__axis--x" />
        <div className="aero-radar__axis aero-radar__axis--y" />

        {/* 360-degree Sweeping Radar Beam */}
        <div className="aero-radar__sweep" />

        {/* Blips & Waypoint Trackers */}
        <div className="aero-radar__blip aero-radar__blip--1">
          <span className="aero-radar__blip-ping" />
          <span className="aero-radar__blip-label">GW-737 • FL380</span>
        </div>
        <div className="aero-radar__blip aero-radar__blip--2">
          <span className="aero-radar__blip-ping" />
          <span className="aero-radar__blip-label">GW-MRO • 042°</span>
        </div>
        <div className="aero-radar__blip aero-radar__blip--3">
          <span className="aero-radar__blip-ping" />
          <span className="aero-radar__blip-label">AOG-URGENT • DISPATCH</span>
        </div>
      </div>

      {/* Flight Telemetry HUD Corner Overlays */}
      <div className="aero-radar__hud-left">
        <div className="aero-radar__telemetry">
          <span className="aero-radar__dot" />
          <code>AVIONICS &amp; MRO RADAR ACTIVE</code>
        </div>
        <div className="aero-radar__data-row">
          <span>HDG <strong>284° MAG</strong></span>
          <span>ALT <strong>38,000 FT</strong></span>
          <span>SPD <strong>M 0.82</strong></span>
        </div>
      </div>

      <div className="aero-radar__hud-right">
        <code>LAT 25° 49&apos; 10&quot; N • LON 80° 21&apos; 19&quot; W</code>
        <code>CERTIFIED FAA / EASA SURVEILLANCE</code>
      </div>

      {/* Vector Line Decorative Graphics */}
      <svg className="aero-radar__vectors" viewBox="0 0 1200 400" preserveAspectRatio="none" fill="none">
        <path d="M 0,220 L 320,220 L 440,140 L 780,140 L 920,260 L 1200,260" stroke="rgba(205, 164, 82, 0.28)" strokeWidth="1.5" strokeDasharray="6 4" />
        <path d="M 120,310 L 400,190 L 860,190 L 1050,90 L 1200,90" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="440" cy="140" r="4" fill="#cda452" />
        <circle cx="780" cy="140" r="3" fill="#ffffff" />
        <circle cx="920" cy="260" r="4" fill="#cda452" />
        <circle cx="400" cy="190" r="3" fill="#ffffff" />
      </svg>
    </div>
  )
}
