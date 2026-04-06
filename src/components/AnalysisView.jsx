import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Target, ListChecks, Shield, Lightbulb, BarChart3 } from 'lucide-react';
import { analyzeRFP } from '../lib/api';

function ProgressBar({ progress }) {
  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="w-20 h-20 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Analyzing Your RFP</h2>
      <p className="text-navy-500 mb-8">Our AI is deep-reading every section to build your compliance roadmap</p>

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

const statusBadge = {
  addressable: { label: 'Addressable', class: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  gap: { label: 'Gap Identified', class: 'bg-red-100 text-red-700', icon: XCircle },
  needs_verification: { label: 'Needs Verification', class: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
  pending: { label: 'Pending', class: 'bg-gray-100 text-gray-600', icon: null },
};

const severityColor = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-blue-500 bg-blue-50',
};

export default function AnalysisView({ documents, onComplete }) {
  const [analysis, setAnalysis] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 8, label: 'Starting...' });
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    analyzeRFP(documents, setProgress)
      .then(setAnalysis)
      .catch(err => setError(err.message));
  }, [documents]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in py-12">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Analysis Failed</h2>
        <p className="text-navy-500 mb-4">{error}</p>
        <button onClick={() => { setError(null); analyzeRFP(documents, setProgress).then(setAnalysis).catch(err => setError(err.message)); }}
          className="bg-navy-900 text-white px-6 py-2 rounded-lg text-sm font-medium">
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) {
    return <ProgressBar progress={progress} />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'requirements', label: 'Requirements', icon: ListChecks },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'risks', label: 'Risks & Strategy', icon: Target },
  ];

  const s = analysis.rfpSummary;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">RFP Analysis Complete</h2>
          <p className="text-navy-500 text-sm mt-1">{s.solicitation} — {s.agency}</p>
        </div>
        <button
          onClick={() => onComplete(analysis)}
          className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all"
        >
          Continue to Questions
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-navy-100 shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-navy-500 hover:text-navy-700 hover:bg-navy-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          {/* RFP Summary Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 shadow-sm p-6">
            <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
              <FileIcon /> RFP Summary
            </h3>
            <h4 className="text-lg font-bold text-navy-900 mb-4">{s.title}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Agency', s.agency],
                ['Solicitation #', s.solicitation],
                ['NAICS', s.naics],
                ['Set-Aside', s.setAside],
                ['Due Date', s.dueDate],
                ['Estimated Value', s.estimatedValue],
                ['Evaluation', s.evaluationMethod],
                ['Submission', s.submissionMethod],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-navy-400 text-xs font-medium uppercase tracking-wider">{label}</span>
                  <span className="text-navy-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-navy-100">
              <span className="text-navy-400 text-xs font-medium uppercase tracking-wider">Page Limits</span>
              <p className="text-navy-700 text-sm mt-1">{s.pageLimit}</p>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-6">
            <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-500" /> Evaluation Criteria
            </h3>
            <div className="space-y-3">
              {analysis.evaluationCriteria.map(c => (
                <div key={c.factor}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-navy-700">{c.factor}</span>
                    <span className="text-sm font-bold text-navy-900">{c.weight}%</span>
                  </div>
                  <div className="w-full bg-navy-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-gold-400 to-gold-500 h-2 rounded-full"
                      style={{ width: `${c.weight}%` }}
                    />
                  </div>
                  <p className="text-xs text-navy-400 mt-1">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-4 gap-4">
            {[
              { label: 'Requirements', value: analysis.requirements.length, sub: `${analysis.requirements.filter(r => r.status === 'addressable').length} addressable`, color: 'text-blue-600' },
              { label: 'Gaps Found', value: analysis.requirements.filter(r => r.status === 'gap').length, sub: 'Need resolution', color: 'text-red-600' },
              { label: 'Compliance Items', value: analysis.complianceChecklist.length, sub: `${analysis.complianceChecklist.filter(c => c.critical).length} critical`, color: 'text-yellow-600' },
              { label: 'Risk Areas', value: analysis.riskAreas.length, sub: `${analysis.riskAreas.filter(r => r.severity === 'high').length} high severity`, color: 'text-orange-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm font-medium text-navy-700">{stat.label}</p>
                <p className="text-xs text-navy-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements tab */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="font-semibold text-navy-800">Extracted Requirements</h3>
            <p className="text-xs text-navy-400 mt-1">AI-extracted from RFP with status assessment against your vendor materials</p>
          </div>
          <div className="divide-y divide-navy-50">
            {analysis.requirements.map(req => {
              const badge = statusBadge[req.status];
              const BadgeIcon = badge.icon;
              return (
                <div key={req.id} className="px-6 py-4 hover:bg-navy-50/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-navy-400 mt-1 whitespace-nowrap">§{req.section}</span>
                    <div className="flex-1">
                      <p className="text-sm text-navy-800">{req.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${badge.class}`}>
                          {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                          {badge.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          req.priority === 'mandatory' ? 'bg-navy-100 text-navy-700' : 'bg-navy-50 text-navy-400'
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compliance tab */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-navy-100">
            <h3 className="font-semibold text-navy-800">Compliance Checklist</h3>
            <p className="text-xs text-navy-400 mt-1">Items that must be verified or completed before submission</p>
          </div>
          <div className="divide-y divide-navy-50">
            {analysis.complianceChecklist.map((item, i) => {
              const badge = statusBadge[item.status];
              return (
                <div key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-navy-50/30">
                  <div className={`w-2 h-2 rounded-full ${item.critical ? 'bg-red-400' : 'bg-navy-300'}`} />
                  <span className="flex-1 text-sm text-navy-700">{item.item}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.class}`}>
                    {badge.label}
                  </span>
                  {item.critical && (
                    <span className="text-xs text-red-500 font-medium">Critical</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risks & Strategy tab */}
      {activeTab === 'risks' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-6">
            <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Risk Areas
            </h3>
            <div className="space-y-3">
              {analysis.riskAreas.map((risk, i) => (
                <div key={i} className={`border-l-4 rounded-r-lg p-4 ${severityColor[risk.severity]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase ${
                      risk.severity === 'high' ? 'text-red-600' : risk.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {risk.severity} risk
                    </span>
                    <span className="text-sm font-semibold text-navy-800">— {risk.area}</span>
                  </div>
                  <p className="text-sm text-navy-600">{risk.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-6">
            <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gold-500" /> Strategic Insights
            </h3>
            <div className="space-y-3">
              {analysis.strategicInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gold-400/5 rounded-lg border border-gold-400/20">
                  <span className="text-gold-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-navy-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon() {
  return <FileText className="w-4 h-4 text-navy-400" />;
}
