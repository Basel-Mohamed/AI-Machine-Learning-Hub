import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { StatusPanel } from './components/StatusPanel';
import { PredictionResult } from './components/PredictionResult';
import { ManualForm } from './components/ManualForm';
import { FileText, Sparkles } from 'lucide-react';

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
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  
  // Fallback to oil-sales if an invalid URL is entered
  const activeModel = (modelId === 'churn') ? 'churn' : 'oil-sales';

  const [messages, setMessages] = useState<Message[]>([]);
  const [extractedFields, setExtractedFields] = useState<Record<string, any>>({});
  const [prediction, setPrediction] = useState<any>(null);
  
  // Separate loading states
  const [isLoading, setIsLoading] = useState(false); // For chat messages
  const [isInitializing, setIsInitializing] = useState(true); // For route/model switching

  const [showManualForm, setShowManualForm] = useState(false);
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(7));

  // Set initial welcome message and trigger the loading screen when the route changes
  useEffect(() => {
    handleReset(true);
  }, [activeModel]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URLS[activeModel]}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, session_id: sessionId }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      let aiMessageContent = data.response || "I didn't receive a valid response.";

      if (data.prediction_data) {
        if (activeModel === 'oil-sales') {
          const actualVolume = data.prediction_data.predicted_volume_sales || 0;
          aiMessageContent = aiMessageContent.replace(
            /Predicted Volume Sales: 0\.00 units/,
            `Predicted Volume Sales: ${actualVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units`
          );
          setPrediction({ predicted_volume_sales: actualVolume, confidence: 100 });
        } else {
          setPrediction({
            churn_probability: data.prediction_data.data?.churn_probability || data.prediction_data.probability,
            will_churn: data.prediction_data.data?.churn_prediction === "Yes" || data.prediction_data.data?.risk_level === "High"
          });
        }
      }

      const aiMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiMessageContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

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
    // Show the full-page initialization screen
    setIsInitializing(true);

    try {
      await fetch(`${API_BASE_URLS[activeModel]}/chat/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error("Reset API Error:", error);
    } finally {
      // Small delay for a smooth UI transition
      setTimeout(() => setIsInitializing(false), 400);
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
    navigate(`/model/${model}`);
    setSessionId(Math.random().toString(36).substring(7));
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

      if (activeModel === 'oil-sales') {
        setPrediction({ predicted_volume_sales: data.prediction, confidence: 100 });
      } else {
        setPrediction({ churn_probability: data.data?.churn_probability, will_churn: data.data?.churn_prediction === "Yes" });
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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeModel={activeModel}
          onModelChange={handleModelChange}
          onReset={() => handleReset()}
        />

        <div className="flex-1 flex flex-col relative">
          <header className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {activeModel === 'oil-sales' ? 'Oil Sales Forecast' : 'Customer Churn Analysis'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                <Sparkles size={14} className="text-blue-500" /> Conversational AI Agent
              </p>
            </div>

            <button
              onClick={() => setShowManualForm(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Manual Entry</span>
            </button>
          </header>

          <div className="flex-1 overflow-hidden relative">
            {isInitializing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0D1117] z-20">
                <div className="w-14 h-14 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-blue-600 dark:border-t-blue-500 animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Loading {activeModel === 'oil-sales' ? 'Oil Sales' : 'Churn'} Engine...
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium animate-pulse">
                  Initializing AI components
                </p>
              </div>
            ) : (
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col w-80 bg-white dark:bg-[#161b22] border-l border-gray-200 dark:border-gray-800">
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