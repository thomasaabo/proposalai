import { useState, useEffect } from 'react';
import Header from './components/Header';
import DocumentIntake from './components/DocumentIntake';
import AnalysisView from './components/AnalysisView';
import QuestionsFlow from './components/QuestionsFlow';
import ProposalView from './components/ProposalView';
import { checkHealth } from './lib/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  const handleDocumentsComplete = (docs) => {
    setDocuments(docs);
    setError(null);
    setStep(2);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysis(result);
    setError(null);
    setStep(3);
  };

  const handleQuestionsComplete = (answeredQuestions) => {
    setAnswers(answeredQuestions);
    setError(null);
    setStep(4);
  };

  // Show connection error banner
  const showBanner = health && (health.status === 'error' || !health.hasApiKey);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentStep={step} />

      {/* Connection / API key warning */}
      {showBanner && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            {health.status === 'error' ? (
              <span className="text-red-700">
                <strong>Backend not running.</strong> Start it with <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">npm run dev:server</code> in another terminal.
              </span>
            ) : (
              <span className="text-red-700">
                <strong>API key not configured.</strong> Add your Anthropic API key to <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">.env</code> — see <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">.env.example</code>
              </span>
            )}
            <button
              onClick={() => checkHealth().then(setHealth)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-yellow-600 hover:text-yellow-800 text-xs">dismiss</button>
          </div>
        </div>
      )}

      <main className="flex-1 px-6 py-8">
        {step === 1 && <DocumentIntake onComplete={handleDocumentsComplete} />}
        {step === 2 && <AnalysisView documents={documents} onComplete={handleAnalysisComplete} />}
        {step === 3 && <QuestionsFlow analysis={analysis} onComplete={handleQuestionsComplete} />}
        {step === 4 && <ProposalView analysis={analysis} answers={answers} />}
      </main>

      <footer className="border-t border-navy-100 bg-white/80 backdrop-blur-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-navy-400">
          <span>ProposalAI — Government RFP Response Engine</span>
          <span>v0.2 — Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
