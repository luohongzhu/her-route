import { Navigation, Clock, MapPin, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { SafetyCard } from './SafetyCard';
import { SafetyBreakdown } from './SafetyBreakdown';
import { ReportIssueModal } from './ReportIssueModal';
import { EndNavigationModal } from './EndNavigationModal';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

interface RouteOverviewProps {
  nightMode: boolean;
}

const routeNodes = [
  { id: 1, x: 15, y: 20, safety: 85, color: '#22C55E' },
  { id: 2, x: 18, y: 25, safety: 82, color: '#22C55E' },
  { id: 3, x: 22, y: 32, safety: 78, color: '#84CC16' },
  { id: 4, x: 28, y: 38, safety: 75, color: '#84CC16' },
  { id: 5, x: 35, y: 42, safety: 68, color: '#FACC15' },
  { id: 6, x: 42, y: 45, safety: 65, color: '#FACC15' },
  { id: 7, x: 48, y: 50, safety: 58, color: '#FB923C' },
  { id: 8, x: 52, y: 56, safety: 72, color: '#FACC15' },
  { id: 9, x: 58, y: 62, safety: 80, color: '#22C55E' },
  { id: 10, x: 65, y: 68, safety: 85, color: '#22C55E' },
  { id: 11, x: 72, y: 72, safety: 88, color: '#22C55E' },
  { id: 12, x: 78, y: 78, safety: 90, color: '#16A34A' },
];

export function RouteOverview({ nightMode }: RouteOverviewProps) {
  const [navigationStatus, setNavigationStatus] = useState<'idle' | 'navigating'>('idle');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEndNavModal, setShowEndNavModal] = useState(false);

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
    // You can add toast notification here
  };

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Route Title */}
        <div>
          <h2 className={`text-xs sm:text-sm font-semibold ${nightMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
            ROUTE OVERVIEW
          </h2>
          <div className={`flex items-center gap-2 ${nightMode ? 'text-white' : 'text-gray-900'} text-sm sm:text-base`}>
            <span className="font-medium truncate">McMaster University</span>
            <span className={`flex-shrink-0 ${nightMode ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
            <span className="font-medium truncate">36 Hunter St E</span>
          </div>
        </div>

        {/* Safety Score Card */}
        <SafetyCard
          score={78}
          label="SAFE"
          context="Better than 68% of routes"
          color="yellow"
          nightMode={nightMode}
        />

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>18 min</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</div>
          </div>
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>1.2 km</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</div>
          </div>
          <div className={`text-center p-2 sm:p-3 ${nightMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${nightMode ? 'text-gray-300' : 'text-gray-600'} mx-auto mb-1`} />
            <div className={`text-base sm:text-lg font-bold ${nightMode ? 'text-white' : 'text-gray-900'}`}>12</div>
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>Segments</div>
          </div>
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
            <li>• Construction zone near node 7 (temporary)</li>
          </ul>
        </div>

        {/* Route Highlights */}
        <div className={`${nightMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className={`w-5 h-5 ${nightMode ? 'text-green-400' : 'text-green-600'} mt-0.5`} />
            <h4 className={`font-semibold ${nightMode ? 'text-green-300' : 'text-green-900'}`}>Route Highlights</h4>
          </div>
          <ul className={`space-y-1 text-sm ${nightMode ? 'text-green-200' : 'text-green-800'} ml-7`}>
            <li>✓ Well-lit residential streets</li>
            <li>✓ Multiple security cameras on route</li>
            <li>✓ Two 24/7 businesses nearby</li>
            <li>✓ Popular walking path with regular foot traffic</li>
          </ul>
        </div>

        {/* Action Buttons */}
        {navigationStatus === 'idle' ? (
          <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors" 
            onClick={handleStartNavigation}
          >
            <Navigation className="w-5 h-5" />
            Start Navigation
          </button>
        ) : (
          <button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors animate-pulse" 
            onClick={handleEndNavigation}
          >
            <Navigation className="w-5 h-5" />
            End Navigation
          </button>
        )}

        <button className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <RefreshCw className="w-5 h-5" />
          Find Safer Route
        </button>

        {/* Additional Links */}
        <div className={`space-y-2 pt-2 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <button className="w-full text-left text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2">
            📍 View Segment Details
          </button>
          <button className="w-full text-left text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2">
            💬 Read Reviews (47)
          </button>
          <button className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium py-2" onClick={() => setShowReportModal(true)}>
            ⚠️ Report Issue on Route
          </button>
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