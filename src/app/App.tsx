import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { StatusPanel } from './components/StatusPanel';
import { PredictionResult } from './components/PredictionResult';
import { ManualForm } from './components/ManualForm';
import { FileText } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_BASE_URLS = {
  'oil-sales': 'https://oil-sales-regression-model.vercel.app',
  'churn': 'https://churn-classification-ensemble.vercel.app'
};

export default function App() {
  const [activeModel, setActiveModel] = useState<'oil-sales' | 'churn'>('oil-sales');
  const [messages, setMessages] = useState<Message[]>([]);
  const [extractedFields, setExtractedFields] = useState<Record<string, any>>({});
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(7));

  // Set initial welcome message
  useEffect(() => {
    handleReset(true);
  }, [activeModel]);

  const handleSendMessage = async (content: string) => {
    // 1. Add User Message
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Call the Real Chat API
      const response = await fetch(`${API_BASE_URLS[activeModel]}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          session_id: sessionId 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      let aiMessageContent = data.response || "I didn't receive a valid response.";

      // 3. Update Prediction and fix the Chat Text
      if (data.prediction_data) {
        if (activeModel === 'oil-sales') {
          const actualVolume = data.prediction_data.predicted_volume_sales || 0;
          
          // FRONTEND FIX: Replace the "0.00" in the backend's chat string with the real formatted value
          aiMessageContent = aiMessageContent.replace(
            /Predicted Volume Sales: 0\.00 units/,
            `Predicted Volume Sales: ${actualVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units`
          );

          // Update the UI Card
          setPrediction({
            predicted_volume_sales: actualVolume,
            confidence: 100 
          });
        } else {
          // Churn model logic
          setPrediction({
            churn_probability: data.prediction_data.data?.churn_probability || data.prediction_data.probability,
            will_churn: data.prediction_data.data?.churn_prediction === "Yes" || data.prediction_data.data?.risk_level === "High"
          });
        }
      }

      // 4. Add AI Message (now containing the fixed text)
      const aiMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiMessageContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // 5. Update extracted fields progress bar
      if (data.extracted_data) {
        setExtractedFields(data.extracted_data);
      }

    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error connecting to the model.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (isInitialLoad = false) => {
    setIsLoading(true);
    try {
      // Call reset endpoint to clear session on backend
      await fetch(`${API_BASE_URLS[activeModel]}/chat/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error("Reset API Error:", error);
    } finally {
      setIsLoading(false);
    }

    setMessages([]);
    setExtractedFields({});
    setPrediction(null);

    const welcomeMessage: Message = {
      id: Math.random().toString(),
      role: 'assistant',
      content: activeModel === 'oil-sales'
        ? 'Hello! I\'m here to help you predict oil sales. Tell me about the product, location, and time period, and I\'ll gather the data needed for an accurate forecast.'
        : 'Hello! I\'m your Customer Churn Analysis assistant. Share customer details with me, and I\'ll help predict their likelihood of churning.',
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  };

  const handleModelChange = (model: 'oil-sales' | 'churn') => {
    setActiveModel(model);
    setSessionId(Math.random().toString(36).substring(7)); // Generate new session ID for new model
  };

  const handleManualSubmit = async (formData: Record<string, any>) => {
    setExtractedFields(formData);
    setShowManualForm(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URLS[activeModel]}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // Format prediction for UI
      if (activeModel === 'oil-sales') {
        setPrediction({
          predicted_volume_sales: data.prediction,
          confidence: 100
        });
      } else {
        setPrediction({
          churn_probability: data.data?.churn_probability,
          will_churn: data.data?.churn_prediction === "Yes"
        });
      }

      const confirmMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: '✅ Manual data received! Prediction generated successfully.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);

    } catch (error) {
      console.error("Manual Prediction Error:", error);
      alert("Failed to generate prediction from API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0D1117]">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeModel={activeModel}
          onModelChange={handleModelChange}
          onReset={() => handleReset()}
        />

        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 dark:text-white">
                {activeModel === 'oil-sales' ? 'Oil Sales Prediction' : 'Customer Churn Prediction'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conversational AI Assistant
              </p>
            </div>

            <button
              onClick={() => setShowManualForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
          </header>

          <div className="flex-1 overflow-hidden">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <StatusPanel
            activeModel={activeModel}
            extractedFields={extractedFields}
          />

          {prediction && (
            <PredictionResult
              activeModel={activeModel}
              prediction={prediction}
            />
          )}
        </div>

        {showManualForm && (
          <ManualForm
            activeModel={activeModel}
            onSubmit={handleManualSubmit}
            onClose={() => setShowManualForm(false)}
          />
        )}
      </div>
    </div>
  );
}