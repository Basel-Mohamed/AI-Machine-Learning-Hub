import { CheckCircle2, Circle } from 'lucide-react';

interface StatusPanelProps {
  activeModel: 'oil-sales' | 'churn';
  extractedFields: Record<string, any>;
}

const OIL_SALES_FIELDS = [
  { key: 'city', label: 'City' },
  { key: 'store_name', label: 'Store Name' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'brand', label: 'Brand' },
  { key: 'class', label: 'Class' },
  { key: 'size', label: 'Size' },
  { key: 'price_bracket', label: 'Price Bracket' },
  { key: 'year', label: 'Year' },
  { key: 'month', label: 'Month' },
  { key: 'value_sales', label: 'Value Sales' },
  { key: 'average_price', label: 'Average Price' },
];

const CHURN_FIELDS = [
  // REMOVED customerID to match your sample JSON
  { key: 'gender', label: 'Gender' },
  { key: 'Senior_Citizen', label: 'Senior Citizen' },
  { key: 'Is_Married', label: 'Is Married' },
  { key: 'Dependents', label: 'Dependents' },
  { key: 'tenure', label: 'Tenure (Months)' },
  { key: 'Phone_Service', label: 'Phone Service' },
  { key: 'Dual', label: 'Multiple Lines' },
  { key: 'Internet_Service', label: 'Internet Service' },
  { key: 'Online_Security', label: 'Online Security' },
  { key: 'Online_Backup', label: 'Online Backup' },
  { key: 'Device_Protection', label: 'Device Protection' },
  { key: 'Tech_Support', label: 'Tech Support' },
  { key: 'Streaming_TV', label: 'Streaming TV' },
  { key: 'Streaming_Movies', label: 'Streaming Movies' },
  { key: 'Contract', label: 'Contract Type' },
  { key: 'Paperless_Billing', label: 'Paperless Billing' },
  { key: 'Payment_Method', label: 'Payment Method' },
  { key: 'Monthly_Charges', label: 'Monthly Charges' },
  { key: 'Total_Charges', label: 'Total Charges' },
];

export function StatusPanel({ activeModel, extractedFields }: StatusPanelProps) {
  const fields = activeModel === 'oil-sales' ? OIL_SALES_FIELDS : CHURN_FIELDS;
  const filledCount = fields.filter(f => extractedFields[f.key] !== undefined && extractedFields[f.key] !== null && extractedFields[f.key] !== '').length;
  const progress = (filledCount / fields.length) * 100;

  return (
    <div className="w-80 bg-white dark:bg-[#161b22] border-l border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#161b22] z-10">
        <h3 className="mb-2 text-gray-900 dark:text-white">Required Fields</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {filledCount}/{fields.length}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {fields.map((field) => {
          const isFilled = extractedFields[field.key] !== undefined && extractedFields[field.key] !== null && extractedFields[field.key] !== '';
          return (
            <div
              key={field.key}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all border ${
                isFilled
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              {isFilled ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isFilled ? 'text-green-900 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {field.label}
                </p>
                {isFilled && (
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1 truncate">
                    {String(extractedFields[field.key])}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}