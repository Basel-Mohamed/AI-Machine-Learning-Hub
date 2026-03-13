import { Brain, BarChart3, Users, RefreshCw } from 'lucide-react';
import { Link } from 'react-router'; // Importing for semantic links if preferred

interface SidebarProps {
  activeModel: 'oil-sales' | 'churn';
  onModelChange: (model: 'oil-sales' | 'churn') => void;
  onReset: () => void;
}

export function Sidebar({ activeModel, onModelChange, onReset }: SidebarProps) {
  return (
    <div className="w-72 bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-gray-800 h-full flex flex-col relative z-20 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-4 group cursor-pointer no-underline">
          <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#0D1117] border border-gray-100 dark:border-gray-700 group-hover:border-blue-500/50 transition-colors shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 group-hover:opacity-40 blur-md transition-opacity rounded-xl"></div>
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-0 tracking-tight group-hover:text-blue-500 transition-colors">AI ML Hub</h1>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prediction Engine</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-3 mt-2">
        <button
          onClick={() => onModelChange('oil-sales')}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group border ${
            activeModel === 'oil-sales'
              ? 'bg-blue-50 dark:bg-[#0D1117] border-blue-200 dark:border-blue-500/50 shadow-md shadow-blue-500/5'
              : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-[#0D1117] hover:border-gray-200 dark:hover:border-gray-800'
          }`}
        >
          <div className={`p-2 rounded-xl transition-colors ${activeModel === 'oil-sales' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <div className={`font-semibold ${activeModel === 'oil-sales' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>Oil Sales</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Volume Forecast</div>
          </div>
        </button>

        <button
          onClick={() => onModelChange('churn')}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group border ${
            activeModel === 'churn'
              ? 'bg-purple-50 dark:bg-[#0D1117] border-purple-200 dark:border-purple-500/50 shadow-md shadow-purple-500/5'
              : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-[#0D1117] hover:border-gray-200 dark:hover:border-gray-800'
          }`}
        >
          <div className={`p-2 rounded-xl transition-colors ${activeModel === 'churn' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white'}`}>
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <div className={`font-semibold ${activeModel === 'churn' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>Churn Analysis</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Customer Retention</div>
          </div>
        </button>
      </nav>

      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0D1117] hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Session</span>
        </button>
      </div>
    </div>
  );
}