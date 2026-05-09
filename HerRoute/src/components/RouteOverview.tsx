import { Navigation, Clock, MapPin, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { SafetyCard } from './SafetyCard';
import { SafetyBreakdown } from './SafetyBreakdown';
import { ReportIssueModal } from './ReportIssueModal';
import { EndNavigationModal } from './EndNavigationModal';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

interface RouteOverviewProps {
  nightMode: boolean;
  route: {
    coords: { lat: number; lng: number }[];
    polyline?: string;
    distance_m?: number;
    duration_s?: number;
    safetyScore?: number;
  } | null;
  origin?: string;
  destination?: string;
  onExit?: () => void;
}

function getSafetyDisplay(score: number): { label: string; color: 'green' | 'yellow' | 'orange' | 'red'; context: string } {
  if (score >= 80) return { label: 'SAFE', color: 'green', context: 'High safety rating for this route' };
  if (score >= 65) return { label: 'MOSTLY SAFE', color: 'yellow', context: 'Generally safe with some caution advised' };
  if (score >= 50) return { label: 'MODERATE', color: 'orange', context: 'Exercise caution on this route' };
  return { label: 'USE CAUTION', color: 'red', context: 'Low safety rating — consider alternatives' };
}

const routeNodes = [
  { id: 1, x: 15, y: 20, safety: 85, color: '#22C55E' },
  { id: 12, x: 78, y: 78, safety: 90, color: '#16A34A' },
];

export function RouteOverview(
  { nightMode,
    route,
    origin,
    destination,
    onExit,
  }: RouteOverviewProps) {
  const [navigationStatus, setNavigationStatus] = useState<'idle' | 'navigating'>('idle');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEndNavModal, setShowEndNavModal] = useState(false);

  const safetyPct = route?.safetyScore != null ? Math.round(route.safetyScore * 100) : null;
  const safetyDisplay = safetyPct != null ? getSafetyDisplay(safetyPct) : null;
  const handleStartNavigation = () => {
    setNavigationStatus('navigating');
  };

  const handleEndNavigation = () => {
    setShowEndNavModal(true);
  };

  const handleCompleteNavigation = () => {
    setNavigationStatus('idle');
  };

  const handleReportIssue = (issue: string) => {
    console.log('Reported issue:', issue);
    setShowReportModal(false);
  };

  return (
    <>
      <div className={`px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 relative ${nightMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Route Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xs sm:text-sm font-semibold ${nightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
              ROUTE OVERVIEW
            </h2>
            {onExit && (
              <button
                onClick={onExit}
                className={`p-1.5 rounded-full transition-colors ${nightMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                aria-label="Close route overview"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className={`flex items-center gap-2 ${nightMode ? 'text-white' : 'text-gray-900'} text-sm sm:text-base`}>
            <span className="font-medium truncate">{origin}</span>
            <span className={`flex-shrink-0 ${nightMode ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
            <span className="font-medium truncate">{destination}</span>
          </div>
        </div>

        {/* Safety Score Card */}
        {safetyPct != null && safetyDisplay && (
          <SafetyCard
            score={safetyPct}
            label={safetyDisplay.label}
            context={safetyDisplay.context}
            color={safetyDisplay.color}
            nightMode={nightMode}
          />
        )}

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
              {route?.duration_s != null
                ? `${Math.round(route.duration_s / 60)} min`
                : '—'}</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</div>
          </div>
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>{route?.distance_m != null ? Math.round((route.distance_m / 1000) * 10) / 10 : '-'} km</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</div>
          </div>
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>12</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Segments</div>
          </div>
        </div>

        {/* ACTION BUTTONS - SOLID AND STABLE */}
        <div className="flex flex-col gap-3 pt-2">
          {navigationStatus === 'idle' ? (
            <button
              className="w-full bg-[#ec4899] text-black font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
              onClick={handleStartNavigation}
            >
              <Navigation className="w-5 h-5 fill-black stroke-black" />
              <span className="uppercase tracking-wider">Start Navigation</span>
            </button>
          ) : (
            <button
              className="w-full bg-rose-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
              onClick={handleEndNavigation}
            >
              <Navigation className="w-5 h-5 fill-white" />
              <span className="uppercase tracking-wider">End Navigation</span>
            </button>
          )}

          <button className={`w-full bg-white border-2 border-[#ec4899] text-[#ec4899] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm ${nightMode ? 'bg-gray-800' : ''}`}>
            <RefreshCw className="w-5 h-5" />
            <span className="uppercase tracking-tight">Find Safer Route</span>
          </button>
        </div>

        {/* Safety Breakdown */}
        <div>
          <h3 className={`font-semibold ${nightMode ? 'text-white' : 'text-gray-900'} mb-4`}>Safety Breakdown</h3>
          <SafetyBreakdown nightMode={nightMode} />
        </div>

        {/* Things to Note */}
        <div className={`${nightMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${nightMode ? 'text-yellow-400' : 'text-yellow-600'} mt-0.5`} />
            <h4 className={`font-semibold ${nightMode ? 'text-yellow-300' : 'text-yellow-900'}`}>Things to Note</h4>
          </div>
          <ul className={`space-y-1 text-sm ${nightMode ? 'text-yellow-200' : 'text-yellow-800'} ml-7`}>
            <li>• One darker section between nodes 6-8</li>
            <li>• Main St has limited visibility at night</li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {showReportModal && (
          <ReportIssueModal
            nightMode={nightMode}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportIssue}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEndNavModal && (
          <EndNavigationModal
            nightMode={nightMode}
            onClose={() => setShowEndNavModal(false)}
            onComplete={handleCompleteNavigation}
            routeNodes={routeNodes}
          />
        )}
      </AnimatePresence>
    </>
  );
}