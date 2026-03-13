import { useState } from 'react';
import { X } from 'lucide-react';

interface ManualFormProps {
  activeModel: 'oil-sales' | 'churn';
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
}

export function ManualForm({ activeModel, onSubmit, onClose }: ManualFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const oilSalesFields = [
    { key: 'city', label: 'City', type: 'text' },
    { key: 'store_name', label: 'Store Name', type: 'text' },
    { key: 'manufacturer', label: 'Manufacturer', type: 'text' },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'class', label: 'Class', type: 'text' },
    // FIXED: Changed size to text since the model expects strings like "1.5L"
    { key: 'size', label: 'Size (e.g., 1.5L)', type: 'text' }, 
    { key: 'price_bracket', label: 'Price Bracket', type: 'text' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'month', label: 'Month', type: 'number' },
    { key: 'value_sales', label: 'Value Sales ($)', type: 'number' },
    { key: 'average_price', label: 'Average Price ($)', type: 'number' },
  ];

  const churnFields = [
    // REMOVED customerID to match your sample JSON payload
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'Senior_Citizen', label: 'Senior Citizen (0 or 1)', type: 'number' },
    { key: 'Is_Married', label: 'Is Married (Yes/No)', type: 'text' },
    { key: 'Dependents', label: 'Dependents (Yes/No)', type: 'text' },
    { key: 'tenure', label: 'Tenure (Months)', type: 'number' },
    { key: 'Phone_Service', label: 'Phone Service (Yes/No)', type: 'text' },
    { key: 'Dual', label: 'Multiple Lines (Yes/No/No phone service)', type: 'text' },
    { key: 'Internet_Service', label: 'Internet Service (DSL/Fiber optic/No)', type: 'text' },
    { key: 'Online_Security', label: 'Online Security (Yes/No)', type: 'text' },
    { key: 'Online_Backup', label: 'Online Backup (Yes/No)', type: 'text' },
    { key: 'Device_Protection', label: 'Device Protection (Yes/No)', type: 'text' },
    { key: 'Tech_Support', label: 'Tech Support (Yes/No)', type: 'text' },
    { key: 'Streaming_TV', label: 'Streaming TV (Yes/No)', type: 'text' },
    { key: 'Streaming_Movies', label: 'Streaming Movies (Yes/No)', type: 'text' },
    { key: 'Contract', label: 'Contract Type', type: 'text' },
    { key: 'Paperless_Billing', label: 'Paperless Billing (Yes/No)', type: 'text' },
    { key: 'Payment_Method', label: 'Payment Method', type: 'text' },
    { key: 'Monthly_Charges', label: 'Monthly Charges ($)', type: 'number' },
    { key: 'Total_Charges', label: 'Total Charges ($)', type: 'number' },
  ];

  const fields = activeModel === 'oil-sales' ? oilSalesFields : churnFields;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#161b22] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 dark:text-white">Manual Data Entry</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter all required fields to generate prediction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Generate Prediction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}