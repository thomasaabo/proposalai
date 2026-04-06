import { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertTriangle, TrendingUp, Database, Lightbulb, FileText, Download, ChevronDown, ChevronUp, Paperclip, BookOpen } from 'lucide-react';
import { generateProposal } from '../lib/api';

const suggestionIcons = {
  enhancement: { icon: TrendingUp, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  data_point: { icon: Database, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  compliance: { icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  risk: { icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-200' },
  critical: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
};

function ProgressOverlay({ progress }) {
  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="w-20 h-20 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Drafting Your Proposal</h2>
      <p className="text-navy-500 mb-8">
        Building a structured, compliance-mapped proposal tailored to the evaluation criteria
      </p>
      <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-navy-700">{progress.label}</span>
          <span className="text-xs text-navy-400">Step {progress.step} of {progress.total}</span>
        </div>
        <div className="w-full bg-navy-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-gold-400 to-gold-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(progress.step / progress.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden animate-fade-in">
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-navy-50/50 transition-colors text-left"
      >
        <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-navy-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-navy-800">{section.title}</h3>
          <p className="text-xs text-navy-400">{section.volume}</p>
        </div>
        {section.suggestions.length > 0 && (
          <span className="flex items-center gap-1 text-xs bg-gold-400/10 text-gold-600 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            {section.suggestions.length} suggestions
          </span>
        )}
        {isExpanded ? <ChevronUp className="w-5 h-5 text-navy-400" /> : <ChevronDown className="w-5 h-5 text-navy-400" />}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-navy-100">
          {/* Proposal content */}
          <div className="px-8 py-6 prose" dangerouslySetInnerHTML={{ __html: section.content }} />

          {/* Section suggestions */}
          {section.suggestions.length > 0 && (
            <div className="px-6 py-4 bg-navy-50/50 border-t border-navy-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-semibold text-navy-700">AI Suggestions for This Section</span>
              </div>
              <div className="space-y-2">
                {section.suggestions.map((sug, i) => {
                  const config = suggestionIcons[sug.type] || suggestionIcons.enhancement;
                  const Icon = config.icon;
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${config.color}`}>
                      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-navy-700">{sug.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProposalView({ analysis, answers }) {
  const [proposal, setProposal] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 8, label: 'Starting...' });
  const [expandedSections, setExpandedSections] = useState(new Set(['exec-summary']));
  const [showInsights, setShowInsights] = useState(true);

  useEffect(() => {
    generateProposal(analysis, answers, setProgress).then(setProposal);
  }, [analysis, answers]);

  if (!proposal) {
    return <ProgressOverlay progress={progress} />;
  }

  const toggleSection = (id) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(proposal.sections.map(s => s.id)));
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            Draft Proposal Ready
            <Sparkles className="w-5 h-5 text-gold-400" />
          </h2>
          <p className="text-navy-500 text-sm mt-1">{proposal.solicitation} — {proposal.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700 border border-navy-200 px-3 py-2 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Expand All
          </button>
          <button className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all">
            <Download className="w-4 h-4" />
            Export DOCX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main proposal content */}
        <div className="lg:col-span-2 space-y-4">
          {proposal.sections.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Right sidebar - AI insights */}
        <div className="space-y-4">
          {/* Active AI Partner panel */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h3 className="font-bold">Active AI Partner</h3>
            </div>
            <p className="text-navy-200 text-sm mb-4">
              Proactive recommendations to strengthen your proposal based on market intelligence and best practices.
            </p>
            <div className="flex items-center gap-2 text-xs text-navy-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Continuously analyzing...
            </div>
          </div>

          {/* Proactive suggestions */}
          {proposal.overallSuggestions.map((sug, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 animate-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{sug.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-navy-800">{sug.title}</h4>
                  <p className="text-xs text-navy-500 mt-1 leading-relaxed">{sug.text}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Upload more docs suggestion */}
          <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Paperclip className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-navy-800">Need Stronger Content?</h4>
                <p className="text-xs text-navy-500 mt-1">Upload additional documents (resumes, certifications, past performance reports) and re-generate specific sections for a more complete proposal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
