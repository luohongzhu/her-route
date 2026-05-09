import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import HerRouteMap from "./HerRouteMap";

interface MapSectionProps {
  nightMode: boolean;
  routeGenerated: boolean;
  routeLoading: boolean;
  onDestinationSelect: (destination: string) => void;
  onDestinationChanged: (destination: string) => void;
  onOriginChanged: (origin: string) => void;
  onOriginSelect: (origin: string) => void;
  onClearRoute: () => void;
  onNodeClick: (nodeId: number) => void;
  onResetView: (resetFn: () => void) => void;
  suggestions: any[];
  originSuggestions: any[];
  route: {
    coords: { lat: number; lng: number }[];
    polyline?: string;
    distance_m?: number;
    duration_s?: number;
  } | null;
}

export function MapSection({
  nightMode,
  routeGenerated,
  routeLoading,
  onDestinationSelect,
  onDestinationChanged,
  onOriginChanged,
  onOriginSelect,
  onClearRoute,
  onNodeClick,
  onResetView,
  suggestions,
  originSuggestions,
  route,
}: MapSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [originValue, setOriginValue] = useState("");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [originConfirmed, setOriginConfirmed] = useState(false);

  const handleDestinationClick = (destinationName: string) => {
    setSearchValue(destinationName);
    onDestinationSelect(destinationName);
    setShowSuggestions(false);
  };

  const handleOriginClick = (originName: string) => {
    setOriginValue(originName);
    onOriginSelect(originName);
    setShowOriginSuggestions(false);
    setOriginConfirmed(true);
  };

  return (
    <div className="flex-1 relative h-full" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
          position: 'absolute',
          top: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '600px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
        {/* Origin search bar */}
        <div className={`rounded-xl shadow-2xl border backdrop-blur-md ${nightMode ? 'border-gray-700' : 'border-gray-200'}`}
          style={{
            pointerEvents: 'auto',
            backgroundColor: nightMode ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.75)'
          }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <input
              type="text"
              value={originValue}
              onChange={(e) => {
                setOriginValue(e.target.value);
                setShowOriginSuggestions(true);
                if (e.target.value.trim()) onOriginChanged(e.target.value);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && originValue.trim()) {
                  handleOriginClick(originValue);
                }
              }}
              placeholder="Enter starting point..."
              className={`flex-1 outline-none bg-transparent ${nightMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
            {originValue && (
              <button onClick={() => { setOriginValue(''); onOriginSelect(''); setShowOriginSuggestions(false); setOriginConfirmed(false); setSearchValue(''); onClearRoute(); }}
                className={`p-1 rounded-full ${nightMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {showOriginSuggestions && !routeGenerated && originSuggestions.length > 0 && (
            <div className={`border-t ${nightMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {originSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOriginClick(suggestion.description)}
                  className={`w-full text-left px-6 py-4 flex flex-col transition-colors ${nightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${idx === originSuggestions.length - 1 ? '' : `border-b ${nightMode ? 'border-gray-700' : 'border-gray-100'}`}`}
                >
                  <div className={`text-sm font-medium ${nightMode ? 'text-white' : 'text-gray-900'}`}>{suggestion.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination search bar — only shown once origin is confirmed */}
        {originConfirmed && <div className={`rounded-xl shadow-2xl border backdrop-blur-md ${nightMode ? 'border-gray-700' : 'border-gray-200'}`}
          style={{
            pointerEvents: 'auto',
            backgroundColor: nightMode ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.75)'
          }}>
          <div className="flex items-center gap-3 px-4 py-3">
            {routeLoading
              ? <Loader2 className="w-5 h-5 flex-shrink-0 text-pink-500 animate-spin" />
              : <Search className="w-5 h-5 flex-shrink-0 text-gray-400" />
            }
            <input
              type="text"
              value={searchValue}
              disabled={routeLoading}
              onChange={(e) => {
                setSearchValue(e.target.value)
                if (!e.target.value.trim()) return;
                onDestinationChanged(e.target.value)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  handleDestinationClick(searchValue);
                }
              }}
              placeholder={routeLoading ? "Finding safest route..." : "Enter destination..."}
              className={`flex-1 outline-none bg-transparent ${nightMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
            {(searchValue || routeGenerated) && !routeLoading && (
              <button onClick={() => { onClearRoute(); setSearchValue(''); setShowSuggestions(false); }}
                className={`p-1 rounded-full ${nightMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {showSuggestions && !routeGenerated && suggestions.length > 0 && (
            <div className={`border-t ${nightMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDestinationClick(suggestion.description)}
                  className={`w-full text-left px-6 py-4 flex flex-col transition-colors ${nightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${idx === suggestions.length - 1 ? '' : `border-b ${nightMode ? 'border-gray-700' : 'border-gray-100'}`}`}
                >
                  <div className={`text-sm font-medium ${nightMode ? 'text-white' : 'text-gray-900'}`}>{suggestion.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>}
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <HerRouteMap
          nightMode={nightMode}
          routeGenerated={routeGenerated}
          route={route}
          onSegmentClick={(segmentId) => onNodeClick(segmentId)}
          onMapReady={(resetFn) => onResetView(resetFn)}
        />
      </div>
    </div>
  );
}