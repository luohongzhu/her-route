import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Popup, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'

// Fix Leaflet marker icons
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function App() {
  // Map data state (from original App.jsx)
  const [roads, setRoads] = useState([])
  const [stats, setStats] = useState({ safe: 0, moderate: 0, unsafe: 0 })
  const [loading, setLoading] = useState(true)

  // UI state (from App.tsx)
  const [nightMode, setNightMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarView, setSidebarView] = useState('overview')
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [destination, setDestination] = useState('')

  const macPosition = [43.2609, -79.9192]

  // Load road data (from original App.jsx)
  useEffect(() => {
    fetch('/roads_simplified.json')
      .then(res => res.json())
      .then(data => {
        console.log(`Loaded ${data.length} roads`)

        const roadsWithScores = data.map(road => {
          let baseScore
          // More realistic scoring based on road type
          if (road.type === 'primary' || road.type === 'secondary') {
            baseScore = 70 + Math.random() * 25  // 70-95 (main roads safer)
          } else if (road.type === 'residential') {
            baseScore = 50 + Math.random() * 30  // 50-80
          } else if (road.type === 'footway' || road.type === 'path') {
            baseScore = 30 + Math.random() * 40  // 30-70 (paths less safe)
          } else {
            baseScore = 40 + Math.random() * 40  // 40-80
          }

          return {
            ...road,
            safetyScore: Math.floor(baseScore),
            // Add mock component scores for sidebar display
            components: {
              lighting: Math.floor(baseScore + Math.random() * 10),
              cameras: Math.random() > 0.5,
              crime: Math.floor(baseScore + Math.random() * 15),
              reviews: Math.floor(baseScore - Math.random() * 10)
            }
          }
        })

        const safe = roadsWithScores.filter(r => r.safetyScore >= 70).length
        const moderate = roadsWithScores.filter(r => r.safetyScore >= 40 && r.safetyScore < 70).length
        const unsafe = roadsWithScores.filter(r => r.safetyScore < 40).length

        setRoads(roadsWithScores)
        setStats({ safe, moderate, unsafe })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading roads:', err)
        setLoading(false)
      })
  }, [])

  const getSafetyColor = (score) => {
    if (score >= 80) return '#10b981'  // Dark green
    if (score >= 70) return '#22c55e'  // Green
    if (score >= 60) return '#84cc16'  // Lime
    if (score >= 50) return '#facc15'  // Yellow
    if (score >= 40) return '#fb923c'  // Orange
    return '#ef4444'                    // Red
  }

  const getWeight = (type) => {
    if (type === 'primary' || type === 'secondary') return 5
    if (type === 'footway' || type === 'path') return 2
    return 3
  }

  // Handle destination search
  const handleDestinationSelect = (dest) => {
    setDestination(dest)
    setRouteGenerated(true)
    setSidebarView('overview')
    setSidebarCollapsed(false)
  }

  // Handle route clearing
  const handleClearRoute = () => {
    setDestination('')
    setRouteGenerated(false)
    setSidebarView('overview')
    setSelectedSegment(null)
    setSidebarCollapsed(false)
  }

  // Handle road click to show segment details
  const handleRoadClick = (road, idx) => {
    setSelectedSegment(idx)
    setSidebarView('segment')
    setSidebarCollapsed(false)
  }

  return (
    <div className={`h-screen flex flex-col ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header with logo and controls */}
      <Header
        nightMode={nightMode}
        onToggleNightMode={() => setNightMode(!nightMode)}
        onSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Section */}
        <div className={`flex-1 relative ${routeGenerated && !sidebarCollapsed ? 'w-[70%]' : 'w-full'}`}>
          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="🔍 Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && destination.trim()) {
                    handleDestinationSelect(destination)
                  }
                }}
                className={`w-full px-6 py-4 text-lg rounded-xl border-2 shadow-lg
                  ${nightMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                `}
              />
              {routeGenerated && (
                <button
                  onClick={handleClearRoute}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Map Container */}
          <MapContainer
            center={macPosition}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            className={nightMode ? 'grayscale' : ''}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* User location marker */}
            <Marker position={macPosition}>
              <Popup>
                <strong>📍 Your Location</strong><br />
                <small>McMaster University</small>
              </Popup>
            </Marker>

            {/* Road segments with safety colors */}
            {roads.map((road, idx) => (
              <Polyline
                key={idx}
                positions={road.coordinates}
                pathOptions={{
                  color: getSafetyColor(road.safetyScore),
                  weight: selectedSegment === idx ? getWeight(road.type) + 2 : getWeight(road.type),
                  opacity: selectedSegment === idx ? 1 : 0.7
                }}
                eventHandlers={{
                  click: () => handleRoadClick(road, idx)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="text-base">{road.name || 'Unnamed Road'}</strong><br />
                    <span className="text-gray-600">{road.type}</span><br />
                    <div className="mt-2">
                      <strong style={{ color: getSafetyColor(road.safetyScore) }}>
                        Safety: {road.safetyScore}/100
                      </strong>
                    </div>
                    <button
                      onClick={() => handleRoadClick(road, idx)}
                      className="mt-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </MapContainer>

          {/* Legend (bottom right) */}
          {!routeGenerated && (
            <div className={`absolute bottom-8 right-8 z-[1000] rounded-xl shadow-lg p-4
              ${nightMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
            `}>
              <strong className="block mb-3 text-sm">Safety Level</strong>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-1 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span>Safe (70-100)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-1 rounded" style={{ backgroundColor: '#facc15' }}></div>
                  <span>Moderate (40-69)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-1 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Unsafe (0-39)</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats panel (top right) - only show when no route */}
          {!routeGenerated && !loading && (
            <div className={`absolute top-20 right-4 z-[1000] rounded-xl shadow-lg p-5 max-w-xs
              ${nightMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
            `}>
              <h2 className="text-xl font-bold mb-1">AfterHours AI</h2>
              <p className={`text-sm mb-4 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                McMaster Safety Map
              </p>
              <div className={`rounded-lg p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-sm">
                  <strong className="text-lg">{roads.length}</strong> road segments analyzed
                </div>
                <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>{stats.safe} safe routes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>{stats.moderate} caution areas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>{stats.unsafe} avoid at night</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[2000]">
              <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading map data...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - only show when route is generated */}
        {routeGenerated && (
          <Sidebar
            nightMode={nightMode}
            view={sidebarView}
            selectedSegment={selectedSegment}
            selectedRoad={selectedSegment !== null ? roads[selectedSegment] : null}
            collapsed={sidebarCollapsed}
            stats={stats}
            totalSegments={roads.length}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onBackToOverview={() => {
              setSidebarView('overview')
              setSelectedSegment(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App