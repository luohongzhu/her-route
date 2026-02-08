import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Popup, Marker, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import L from 'leaflet'

function App() {
  const [roads, setRoads] = useState([])
  const [stats, setStats] = useState({ safe: 0, moderate: 0, unsafe: 0 })
  const [loading, setLoading] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  const [sidebarView, setSidebarView] = useState('overview')
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [destination, setDestination] = useState('')
  const [statsCollapsed, setStatsCollapsed] = useState(false)

  const macPosition = [43.2609, -79.9192]
  const mapRef = useRef(null)

  const customPinIcon = L.icon({
    iconUrl: '/custom-pin.svg',
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    className: 'custom-pin-marker'
  })

  useEffect(() => {
    fetch('/roads_simplified.json')
      .then(res => res.json())
      .then(data => {
        const roadsWithScores = data.map(road => ({
          ...road,
          safetyScore: Math.floor(40 + Math.random() * 55),
        }))
        setStats({
          safe: roadsWithScores.filter(r => r.safetyScore >= 70).length,
          moderate: roadsWithScores.filter(r => r.safetyScore >= 40 && r.safetyScore < 70).length,
        })
        setRoads(roadsWithScores)
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [])

  const getSafetyColor = (score) => {
    if (score >= 80) return '#ec4899'
    if (score >= 70) return '#f472b6'
    if (score >= 60) return '#f9a8d4'
    if (score >= 50) return '#fbcfe8'
    if (score >= 40) return '#d1d5db'
    return '#9ca3af'
  }

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
      
      <style>{`
        .leaflet-container { z-index: 1 !important; }
        .force-top { z-index: 9999 !important; }
        
        /* Pinned Zoom Buttons - Left Side Wrapped */
        .leaflet-top.leaflet-left {
          top: 110px !important; 
          left: 0px !important;
          margin-left: 0px !important;
        }
        
        .leaflet-bar a {
          background-color: ${nightMode ? '#1f2937' : '#ffffff'} !important;
          color: ${nightMode ? '#ffffff' : '#000000'} !important;
          border-radius: 0 8px 8px 0 !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }

        /* Pure black placeholder with full visibility */
        .deep-black-input::placeholder {
          color: #000000 !important;
          opacity: 1 !important;
          font-weight: 700;
        }
      `}</style>

      <Header nightMode={nightMode} onToggleNightMode={() => setNightMode(!nightMode)} />

      <div className="flex-1 flex relative overflow-hidden">
        <div className={`relative h-full transition-all duration-300 ${routeGenerated && !sidebarCollapsed ? 'w-[70%]' : 'w-full'}`}>
          
          {/* SEARCH BAR - NOW CLICKABLE AND TYPEABLE */}
          <div className="force-top absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    console.log('Searching for:', destination)
                    // TODO: Implement actual routing logic here
                    // For now, just log the search term
                  }
                }}
                className="w-full px-6 py-4 text-lg rounded-2xl border-[3px] shadow-2xl backdrop-blur-md transition-all deep-black-input focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{ 
                  color: nightMode ? '#ffffff' : '#000000', 
                  fontWeight: '700',
                  /* 0.92 is thick but still lets a tiny bit of map show through */
                  backgroundColor: nightMode ? 'rgba(17, 24, 39, 0.92)' : 'rgba(255, 255, 255, 0.75)',
                  borderColor: nightMode ? '#374151' : '#d1d5db'
                }}
              />
            </div>
          </div>

          {/* STATS BOX - WRAPPED TO RIGHT */}
          {!routeGenerated && !loading && (
            <div 
              className="force-top absolute transition-all duration-500 pointer-events-none"
              style={{ 
                top: '100px', 
                right: '0px', 
                transform: statsCollapsed ? 'translateX(270px)' : 'translateX(0px)' 
              }}
            >
              <div className={`w-[320px] p-5 rounded-l-3xl rounded-r-none shadow-2xl border-y border-l backdrop-blur-md pointer-events-auto
                ${nightMode ? 'bg-gray-800/95 border-gray-700 text-white' : 'bg-white/95 border-gray-200 text-gray-900'}`}>
                
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setStatsCollapsed(!statsCollapsed)} className="p-2 text-pink-500 font-bold">
                    {statsCollapsed ? '◀' : '▶'}
                  </button>
                  <h2 className="text-xl font-bold">HerRoute</h2>
                </div>
                {!statsCollapsed && (
                  <div className="space-y-3">
                    <div className={`rounded-xl p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="text-sm font-bold mb-2 text-pink-500">Live Stats</p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ec4899' }}></span>
                        <span>{stats.safe} safe routes found</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <MapContainer
            center={macPosition}
            zoom={14}
            zoomControl={false}
            whenCreated={(map) => { mapRef.current = map }}
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            <ZoomControl position="topleft" /> 
            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
            <Marker position={macPosition} icon={customPinIcon} />
            {roads.map((road, idx) => (
              <Polyline
                key={idx}
                positions={road.coordinates}
                pathOptions={{
                  color: getSafetyColor(road.safetyScore),
                  weight: selectedSegment === idx ? 7 : 4,
                  opacity: selectedSegment === idx ? 1 : 0.7
                }}
                eventHandlers={{ click: () => { setSelectedSegment(idx); setSidebarView('segment'); } }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default App
