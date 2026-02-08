import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ReportIssueModalProps {
  nightMode: boolean;
  onClose: () => void;
  onSubmit: (issue: string) => void;
}

export function ReportIssueModal({ nightMode, onClose, onSubmit }: ReportIssueModalProps) {
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [customIssue, setCustomIssue] = useState('');

  const issues = [
    '💡 Broken street light',
    '🚧 Construction/Obstruction',
    '👥 Suspicious activity',
    '🌳 Poor visibility',
    '🚨 Safety concern',
    '📷 Camera not working',
    '✏️ Other (specify below)',
  ];

  const handleSubmit = () => {
    const issue = selectedIssue === '✏️ Other (specify below)' ? customIssue : selectedIssue;
    if (issue) {
      onSubmit(issue);
    }
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
        className={`${nightMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>
              Report Issue
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${nightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${nightMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Help make HerRoute safer for everyone. Select an issue:
          </p>

          {/* Issue Options */}
          <div className="space-y-2">
            {issues.map((issue) => (
              <button
                key={issue}
                onClick={() => setSelectedIssue(issue)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedIssue === issue
                    ? nightMode
                      ? 'bg-pink-900/30 border-pink-500'
                      : 'bg-pink-50 border-pink-500'
                    : nightMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`font-medium ${nightMode ? 'text-white' : 'text-gray-900'}`}>
                  {issue}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Issue Input */}
          {selectedIssue === '✏️ Other (specify below)' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
                placeholder="Describe the issue..."
                className={`w-full p-4 rounded-lg border-2 ${
                  nightMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } outline-none focus:border-pink-500 transition-colors resize-none`}
                rows={4}
              />
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 ${nightMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <button
            onClick={onClose}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
              nightMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedIssue || (selectedIssue === '✏️ Other (specify below)' && !customIssue)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              !selectedIssue || (selectedIssue === '✏️ Other (specify below)' && !customIssue)
                ? nightMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Submit Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
