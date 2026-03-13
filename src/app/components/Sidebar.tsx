import { Brain, BarChart3, Users, RefreshCw } from 'lucide-react';

interface SidebarProps {
  activeModel: 'oil-sales' | 'churn';
  onModelChange: (model: 'oil-sales' | 'churn') => void;
  onReset: () => void;
}

export function Sidebar({ activeModel, onModelChange, onReset }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white mb-0">AI ML Hub</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Prediction Systems</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onModelChange('oil-sales')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeModel === 'oil-sales'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <div className="flex-1 text-left">
            <div className="font-medium">Oil Sales</div>
            <div className="text-xs opacity-70">Volume Forecast</div>
          </div>
        </button>

        <button
          onClick={() => onModelChange('churn')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeModel === 'churn'
              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Users className="w-5 h-5" />
          <div className="flex-1 text-left">
            <div className="font-medium">Churn Analysis</div>
            <div className="text-xs opacity-70">Customer Retention</div>
          </div>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Session</span>
        </button>
      </div>
    </div>
  );
}
