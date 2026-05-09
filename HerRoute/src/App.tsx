import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { MapSection } from './components/MapSection';
import { Sidebar } from './components/Sidebar';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";



export default function App() {
  const [nightMode, setNightMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarView, setSidebarView] = useState<'overview' | 'segment'>('overview');
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const resetMapViewRef = useRef<(() => void) | null>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const DEFAULT_ORIGIN = "McMaster Children's Hospital - Hamilton Health Sciences, Main Street West, Hamilton, ON, Canada";

  const handleDestinationSelect = async (destination: string) => {
    const origin = selectedOrigin || DEFAULT_ORIGIN;
    setSelectedDestination(destination);
    setRouteLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/her-route/us-central1/getRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ origin, destination }),
        }
      );

      const data = await response.json();
      console.log("Best route:", data);
      setRoute(data.bestRoute);
      setRouteGenerated(true);
      setSidebarView('overview');
      setSidebarCollapsed(false);
    } finally {
      setRouteLoading(false);
    }
  };

  const handleDestinationChange = async (destination: string) => {
    const response = await fetch(
      `http://127.0.0.1:5001/her-route/us-central1/getSuggestions?address=${encodeURIComponent(destination)}`
    );

    const data = await response.json();
    setSuggestions(data);
  };

  const handleOriginChange = async (origin: string) => {
    const response = await fetch(
      `http://127.0.0.1:5001/her-route/us-central1/getSuggestions?address=${encodeURIComponent(origin)}`
    );

    const data = await response.json();
    setOriginSuggestions(data);
  };

  const handleClearRoute = () => {
    setRouteGenerated(false);
    setSidebarView('overview');
    setSelectedSegment(null);
    setSidebarCollapsed(false);
    setSuggestions([]);
    setOriginSuggestions([]);
    setSelectedDestination("");
  };

  const handleExitRoute = () => {
    setSidebarCollapsed(true);
  };

  const handleBackToOverview = () => {
    setSidebarView('overview');
    if (resetMapViewRef.current) {
      resetMapViewRef.current();
    }
  };

  return (
    <div className={`h-screen flex flex-col ${nightMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Header
        nightMode={nightMode}
        onToggleNightMode={() => setNightMode(!nightMode)}
        onSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <MapSection
          nightMode={nightMode}
          routeGenerated={routeGenerated}
          routeLoading={routeLoading}
          onDestinationSelect={handleDestinationSelect}
          onDestinationChanged={handleDestinationChange}
          onOriginChanged={handleOriginChange}
          onOriginSelect={(origin) => setSelectedOrigin(origin)}
          onClearRoute={handleClearRoute}
          onNodeClick={(nodeId) => {
            setSelectedSegment(nodeId);
            setSidebarView('segment');
            setSidebarCollapsed(false);
          }}
          onResetView={(resetFn) => {
            return resetMapViewRef.current = resetFn;
          }}
          suggestions={suggestions}
          originSuggestions={originSuggestions}
          route={route}
        />

        {routeGenerated && (
          <Sidebar
            nightMode={nightMode}
            view={sidebarView}
            selectedSegment={selectedSegment}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onBackToOverview={handleBackToOverview}
            onExit={handleExitRoute}
            route={route}
            origin={selectedOrigin || DEFAULT_ORIGIN}
            destination={selectedDestination}
          />
        )}
      </div>
    </div>
  );
}