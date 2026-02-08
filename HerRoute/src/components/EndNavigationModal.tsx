import { X, ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface EndNavigationModalProps {
  nightMode: boolean;
  onClose: () => void;
  onComplete: () => void;
  routeNodes: Array<{ id: number; x: number; y: number; safety: number; color: string }>;
}

export function EndNavigationModal({ nightMode, onClose, onComplete, routeNodes }: EndNavigationModalProps) {
  const [step, setStep] = useState<'rating' | 'thumbsUp' | 'thumbsDown' | 'segments'>('rating');
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);

  const handleThumbsUp = () => {
    setStep('thumbsUp');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2500);
  };

  const handleThumbsDown = () => {
    setStep('thumbsDown');
  };

  const toggleSegment = (segmentId: number) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleSubmitBadSegments = () => {
    setStep('segments');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2500);
  };

  const handleRateEntireRoute = () => {
    setStep('segments');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2500);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`${nightMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rating Step */}
        {step === 'rating' && (
          <>
            <div className={`p-6 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                  How was your walk?
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${nightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className={`w-5 h-5 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
              <p className={`text-sm mt-2 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your feedback helps keep HerRoute safe for everyone
              </p>
            </div>

            <div className="p-6 flex gap-4 justify-center">
              <button
                onClick={handleThumbsUp}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  nightMode
                    ? 'bg-gray-700 border-gray-600 hover:border-green-500 hover:bg-green-900/30'
                    : 'bg-gray-50 border-gray-200 hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                </div>
                <span className={`font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                  Good Route
                </span>
              </button>

              <button
                onClick={handleThumbsDown}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  nightMode
                    ? 'bg-gray-700 border-gray-600 hover:border-red-500 hover:bg-red-900/30'
                    : 'bg-gray-50 border-gray-200 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <ThumbsDown className="w-8 h-8 text-red-600" />
                </div>
                <span className={`font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                  Bad Route
                </span>
              </button>
            </div>
          </>
        )}

        {/* Thumbs Up Success */}
        {step === 'thumbsUp' && (
          <motion.div 
            className="p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div 
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <ThumbsUp className="w-12 h-12 text-green-600" />
            </motion.div>
            <h3 className={`text-2xl font-bold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>
              Thanks for your feedback!
            </h3>
            <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We're constantly working to improve route safety based on user feedback like yours. Your input helps keep our community safe! 💖
            </p>
          </motion.div>
        )}

        {/* Thumbs Down - Select Segments */}
        {step === 'thumbsDown' && (
          <>
            <div className={`p-6 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                  What went wrong?
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${nightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className={`w-5 h-5 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
              <p className={`text-sm mt-2 ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select specific segments or rate the entire route
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Segment Selection */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Problem Segments:
                </h3>
                {routeNodes.slice(0, -1).map((node, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleSegment(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedSegments.includes(idx)
                        ? nightMode
                          ? 'bg-red-900/30 border-red-500'
                          : 'bg-red-50 border-red-500'
                        : nightMode
                        ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${selectedSegments.includes(idx) ? 'text-red-500' : nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                      Segment {idx + 1}
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full ml-auto"
                      style={{ backgroundColor: node.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`flex flex-col gap-3 p-6 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <button
                onClick={handleSubmitBadSegments}
                disabled={selectedSegments.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  selectedSegments.length === 0
                    ? nightMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Submit Selected Segments ({selectedSegments.length})
              </button>
              <button
                onClick={handleRateEntireRoute}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  nightMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rate Entire Route as Bad
              </button>
            </div>
          </>
        )}

        {/* Submission Success */}
        {step === 'segments' && (
          <motion.div 
            className="p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div 
              className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <MapPin className="w-12 h-12 text-pink-600" />
            </motion.div>
            <h3 className={`text-2xl font-bold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>
              Report Submitted
            </h3>
            <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Thank you for helping us improve. We'll review your feedback and work to make this route safer for everyone! 💪
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
