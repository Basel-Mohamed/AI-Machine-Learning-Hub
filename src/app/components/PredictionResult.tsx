import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface PredictionResultProps {
  activeModel: 'oil-sales' | 'churn';
  prediction: any;
}

export function PredictionResult({ activeModel, prediction }: PredictionResultProps) {
  if (!prediction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="mx-6 mb-6"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/30">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-blue-600/50 animate-gradient bg-300% opacity-50" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-white">Prediction Complete</h3>
            </div>
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>

          {activeModel === 'oil-sales' ? (
            <div>
              <p className="text-blue-100 text-sm mb-2">Predicted Volume Sales</p>
              <p className="text-4xl mb-4">
                {typeof prediction.predicted_volume_sales === 'number'
                  ? prediction.predicted_volume_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : prediction.predicted_volume_sales} units
              </p>
              {prediction.confidence && (
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span>{prediction.confidence}% confidence</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-purple-100 text-sm mb-2">Churn Prediction</p>
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-4xl">
                  {prediction.churn_probability
                    ? `${(prediction.churn_probability * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
                <span className="text-purple-100">probability</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
                prediction.will_churn ? 'bg-red-500' : 'bg-green-500'
              }`}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {prediction.will_churn ? 'High Risk - Action Recommended' : 'Low Risk - Customer Stable'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
