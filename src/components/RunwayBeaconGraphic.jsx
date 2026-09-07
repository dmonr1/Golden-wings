export default function RunwayBeaconGraphic() {
  return (
    <div className="runway-beacon-graphic" aria-hidden="true">
      {/* Horizon Grid Lines */}
      <div className="runway-beacon__grid" />

      {/* Runway Perspective Lines & Centerline Strobes */}
      <svg className="runway-beacon__svg" viewBox="0 0 1440 500" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="runwayGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f3ce68" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#f3ce68" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f3ce68" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Runway Surface Perspective Polygon */}
        <polygon points="660,120 780,120 940,500 500,500" fill="url(#runwayGlow)" />

        {/* Runway Edges */}
        <line x1="660" y1="120" x2="500" y2="500" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" />
        <line x1="780" y1="120" x2="940" y2="500" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" />

        {/* Centerline Strobe Sequence */}
        <line x1="720" y1="130" x2="720" y2="150" stroke="#f3ce68" strokeWidth="2" className="runway-strobe runway-strobe--1" />
        <line x1="720" y1="170" x2="720" y2="200" stroke="#ffffff" strokeWidth="3" className="runway-strobe runway-strobe--2" />
        <line x1="720" y1="230" x2="720" y2="280" stroke="#f3ce68" strokeWidth="3.5" className="runway-strobe runway-strobe--3" />
        <line x1="720" y1="320" x2="720" y2="390" stroke="#ffffff" strokeWidth="4.5" className="runway-strobe runway-strobe--4" />
        <line x1="720" y1="430" x2="720" y2="500" stroke="#f3ce68" strokeWidth="5.5" className="runway-strobe runway-strobe--5" />

        {/* Threshold Green Approach Lights (Threshold Bar) */}
        <circle cx="675" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="690" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="705" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="720" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="735" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="750" cy="122" r="3" fill="#3cd070" className="beacon-light" />
        <circle cx="765" cy="122" r="3" fill="#3cd070" className="beacon-light" />

        {/* Lateral Runway Distance Marker Lines */}
        <line x1="590" y1="300" x2="850" y2="300" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="540" y1="410" x2="900" y2="410" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="8 8" />
      </svg>

      {/* Top Communication Telemetry Bar */}
      <div className="runway-beacon__comm-bar">
        <div className="comm-signal">
          <span className="comm-pulse" />
          <code>COMM CHANNEL: 121.5 / 134.25 MHz • AOG PRIORITY ACTIVE</code>
        </div>
        <div className="comm-status">
          <code>DISPATCH DESK OPEN 24/7 • FAST RFQ RESPONSE</code>
        </div>
      </div>

      {/* Pulsing Airport Beacon Light in the Distance */}
      <div className="runway-beacon__tower-light">
        <div className="beacon-sweep" />
        <div className="beacon-core" />
      </div>

      {/* Radio Frequency Animated Waveform Graphic */}
      <div className="runway-beacon__waveform">
        <span className="wave-bar" style={{ animationDelay: '0ms' }} />
        <span className="wave-bar" style={{ animationDelay: '120ms' }} />
        <span className="wave-bar" style={{ animationDelay: '240ms' }} />
        <span className="wave-bar" style={{ animationDelay: '360ms' }} />
        <span className="wave-bar" style={{ animationDelay: '180ms' }} />
        <span className="wave-bar" style={{ animationDelay: '60ms' }} />
        <span className="wave-bar" style={{ animationDelay: '300ms' }} />
        <span className="wave-bar" style={{ animationDelay: '420ms' }} />
      </div>
    </div>
  )
}
