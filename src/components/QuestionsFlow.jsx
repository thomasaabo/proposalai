import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MessageSquare, AlertCircle, Lightbulb, SkipForward, CheckCircle2 } from 'lucide-react';
import { generateQuestions } from '../lib/api';

const priorityConfig = {
  critical: { label: 'Critical', class: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  high: { label: 'High Priority', class: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  medium: { label: 'Medium', class: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
};

export default function QuestionsFlow({ analysis, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQuestions(analysis).then(q => {
      setQuestions(q);
      setIsLoading(false);
    });
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center animate-fade-in py-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-gold-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-gold-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-gold-400 rounded-full typing-dot" />
        </div>
        <p className="text-navy-600 font-medium">Generating targeted questions based on your RFP analysis...</p>
      </div>
    );
  }

  const current = questions[currentIndex];
  const answeredCount = questions.filter(q => q.answer.trim()).length;
  const criticalUnanswered = questions.filter(q => q.priority === 'critical' && !q.answer.trim()).length;
  const config = priorityConfig[current.priority];

  const updateAnswer = (value) => {
    setQuestions(prev => prev.map((q, i) => i === currentIndex ? { ...q, answer: value } : q));
  };

  const canProceed = criticalUnanswered === 0 || answeredCount >= questions.length * 0.5;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Clarifying Questions</h2>
          <p className="text-navy-500 text-sm mt-1">
            Help us fill the gaps between the RFP requirements and your materials
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-navy-700">{answeredCount} of {questions.length} answered</p>
          {criticalUnanswered > 0 && (
            <p className="text-xs text-red-500">{criticalUnanswered} critical question{criticalUnanswered > 1 ? 's' : ''} remaining</p>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'w-8 bg-gold-400'
                : q.answer.trim()
                ? 'w-2 bg-emerald-400'
                : `w-2 ${priorityConfig[q.priority].dot} opacity-40`
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden mb-6 animate-slide-in" key={current.id}>
        <div className="px-8 py-6 border-b border-navy-50 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.class}`}>
            {config.label}
          </span>
          <span className="text-xs text-navy-400 bg-navy-50 px-2 py-0.5 rounded-full">
            {current.category}
          </span>
          <span className="text-xs text-navy-300 ml-auto">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-navy-500" />
            </div>
            <p className="text-navy-800 text-lg leading-relaxed">{current.question}</p>
          </div>

          {/* Hint */}
          <div className="flex items-start gap-3 bg-gold-400/8 border border-gold-400/20 rounded-xl p-4 mb-6">
            <Lightbulb className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-navy-600">{current.hint}</p>
          </div>

          {/* Answer input */}
          <textarea
            value={current.answer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here... Be as specific as possible. Names, numbers, and dates are particularly valuable."
            className="w-full h-36 border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-navy-300 resize-none focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Navigation */}
        <div className="px-8 py-4 bg-navy-50/50 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {current.answer.trim() ? 'Next' : 'Skip'}
            {current.answer.trim() ? <ChevronRight className="w-4 h-4" /> : <SkipForward className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Answered summary */}
      {answeredCount > 0 && (
        <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-navy-700">Answered Questions</span>
          </div>
          <div className="space-y-2">
            {questions.filter(q => q.answer.trim()).map(q => (
              <div key={q.id} className="flex items-start gap-3 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${priorityConfig[q.priority].dot}`} />
                <span className="text-navy-500 truncate flex-1">{q.question}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed button */}
      <div className="flex items-center justify-between">
        {criticalUnanswered > 0 && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>{criticalUnanswered} critical question{criticalUnanswered > 1 ? 's' : ''} unanswered — proposal quality may be affected</span>
          </div>
        )}
        <div className="ml-auto">
          <button
            onClick={() => onComplete(questions)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all active:scale-[0.98] ${
              canProceed
                ? 'bg-navy-900 hover:bg-navy-800 text-white'
                : 'bg-navy-200 text-navy-400 cursor-not-allowed'
            }`}
            disabled={!canProceed}
          >
            Generate Proposal Draft
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
