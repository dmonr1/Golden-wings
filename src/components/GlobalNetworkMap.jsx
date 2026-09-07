export default function GlobalNetworkMap() {
  return (
    <div className="global-network-map" aria-hidden="true">
      {/* Geodesic Background Grid & Latitude Rings */}
      <div className="global-network__grid" />

      {/* SVG Global Arcs & Route Corridors */}
      <svg className="global-network__svg" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="routeGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cda452" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cda452" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="routeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5ec5c9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Global Longitude/Latitude Curved Guide Arcs */}
        <ellipse cx="720" cy="260" rx="680" ry="190" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 8" />
        <ellipse cx="720" cy="260" rx="540" ry="140" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" strokeDasharray="2 6" />
        <line x1="80" y1="260" x2="1360" y2="260" stroke="rgba(205, 164, 82, 0.16)" strokeWidth="1" strokeDasharray="4 8" />

        {/* Major Flight Route Arcs (Originating from Florida Hub at ~380, 260) */}
        {/* Route 1: Miami -> London / Europe */}
        <path className="network-arc network-arc--1" d="M 380,260 Q 640,110 940,170" stroke="url(#routeGold)" strokeWidth="2" strokeDasharray="8 6" />
        {/* Route 2: Miami -> Frankfurt */}
        <path className="network-arc network-arc--2" d="M 380,260 Q 680,140 1020,190" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="6 6" />
        {/* Route 3: Miami -> São Paulo / South America */}
        <path className="network-arc network-arc--3" d="M 380,260 Q 480,360 560,420" stroke="url(#routeCyan)" strokeWidth="1.8" strokeDasharray="7 5" />
        {/* Route 4: Miami -> Tokyo / Asia-Pacific */}
        <path className="network-arc network-arc--4" d="M 380,260 Q 720,70 1280,160" stroke="url(#routeGold)" strokeWidth="1.6" strokeDasharray="10 8" />
        {/* Route 5: Miami -> West Coast (LAX/Seattle) */}
        <path className="network-arc network-arc--5" d="M 380,260 Q 260,200 140,210" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" strokeDasharray="5 5" />

        {/* Primary Florida Hub Pulse Indicator */}
        <circle cx="380" cy="260" r="14" fill="none" stroke="#cda452" strokeWidth="1.5" className="hub-ping" />
        <circle cx="380" cy="260" r="6" fill="#f3ce68" />

        {/* Global Destination Nodes */}
        <circle cx="940" cy="170" r="4" fill="#ffffff" />
        <circle cx="1020" cy="190" r="4" fill="#cda452" />
        <circle cx="560" cy="420" r="4" fill="#5ec5c9" />
        <circle cx="1280" cy="160" r="4" fill="#ffffff" />
        <circle cx="140" cy="210" r="4" fill="#ffffff" />
      </svg>

      {/* Floating Hub Labels & Badges */}
      <div className="global-network__badge global-network__badge--hub">
        <span className="hub-dot" />
        <div>
          <strong>DORAL HQ • GLOBAL HUB</strong>
          <small>25.8195° N, 80.3553° W • SOURCING DISPATCH</small>
        </div>
      </div>

      <div className="global-network__badge global-network__badge--stats">
        <span>GLOBAL COVERAGE <strong>100,000+ PARTS</strong></span>
        <span>EXPERIENCE <strong>25+ COMBINED YRS</strong></span>
        <span>AOG FULFILLMENT <strong>24/7/365</strong></span>
      </div>

      {/* Animated Compass Rose Emblem in Background */}
      <div className="global-network__compass">
        <div className="compass-ring compass-ring--outer" />
        <div className="compass-ring compass-ring--inner" />
        <span className="compass-mark compass-mark--n">N</span>
        <span className="compass-mark compass-mark--e">E</span>
        <span className="compass-mark compass-mark--s">S</span>
        <span className="compass-mark compass-mark--w">W</span>
      </div>
    </div>
  )
}
