import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ChevronRight, Loader2, Shield, Building2, Users, Award, FolderOpen } from 'lucide-react';
import { classifyDocuments } from '../lib/api';

const docTypeConfig = {
  rfp: { label: 'RFP Document', icon: FileText, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  vendor_summary: { label: 'Vendor Summary', icon: Building2, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  team_bios: { label: 'Team Bios', icon: Users, color: 'bg-green-100 text-green-700 border-green-200' },
  past_performance: { label: 'Past Performance', icon: Award, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  certifications: { label: 'Certifications', icon: Shield, color: 'bg-teal-100 text-teal-700 border-teal-200' },
  supporting: { label: 'Supporting Document', icon: FolderOpen, color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DocumentIntake({ onComplete }) {
  const [documents, setDocuments] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsClassifying(true);
    setError(null);
    try {
      const classified = await classifyDocuments(acceptedFiles);
      setDocuments(prev => [...prev, ...classified]);
      setIsReady(true);
    } catch (err) {
      setError(err.message || 'Failed to classify documents. Is the backend running?');
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const changeType = (id, newType) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, type: newType } : d));
  };

  const hasRFP = documents.some(d => d.type === 'rfp');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Hero section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-3">Upload Your RFP Documents</h2>
        <p className="text-navy-500 text-lg max-w-2xl mx-auto">
          Drop everything in — the RFP, your company overview, team bios, past performance, certifications.
          Our AI will classify, analyze, and start building your winning proposal.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
          isDragActive
            ? 'border-gold-400 bg-gold-400/10 scale-[1.01]'
            : 'border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/50'
        }`}
      >
        <input {...getInputProps()} />
        {isClassifying ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
            <p className="text-navy-700 font-medium">Classifying documents with AI...</p>
            <p className="text-navy-400 text-sm">Identifying document types and extracting metadata</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center">
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-gold-500' : 'text-navy-400'}`} />
            </div>
            <div>
              <p className="text-navy-700 font-semibold text-lg">
                {isDragActive ? 'Drop files here...' : 'Drag & drop all your documents'}
              </p>
              <p className="text-navy-400 text-sm mt-1">
                PDF, DOC, DOCX, TXT, XLS, XLSX — or click to browse
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['RFP', 'Company Profile', 'Team Bios', 'Past Performance', 'Certifications'].map(tag => (
                <span key={tag} className="text-xs bg-navy-100 text-navy-500 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-red-500 text-lg">!</span>
          <div>
            <p className="text-sm font-medium text-red-800">Classification Failed</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Classified documents */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
            <h3 className="font-semibold text-navy-800">
              Classified Documents ({documents.length})
            </h3>
            {!hasRFP && (
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                No RFP detected — please upload or reclassify
              </span>
            )}
          </div>
          <div className="divide-y divide-navy-50">
            {documents.map((doc, i) => {
              const config = docTypeConfig[doc.type];
              const Icon = config.icon;
              return (
                <div key={doc.id} className="px-6 py-3 flex items-center gap-4 hover:bg-navy-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.color} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{doc.name}</p>
                    <p className="text-xs text-navy-400">{formatFileSize(doc.size)}</p>
                  </div>
                  <select
                    value={doc.type}
                    onChange={(e) => changeType(doc.id, e.target.value)}
                    className="text-xs border border-navy-200 rounded-lg px-2 py-1.5 text-navy-600 bg-white focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                  >
                    {Object.entries(docTypeConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <span className="text-xs text-navy-300">{Math.round(doc.confidence * 100)}% confident</span>
                  <button onClick={() => removeDocument(doc.id)} className="text-navy-300 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI hint */}
      {documents.length > 0 && documents.length < 3 && (
        <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-navy-800">Tip: More documents = stronger proposals</p>
            <p className="text-xs text-navy-500 mt-0.5">
              Upload your capability statement, key personnel resumes, past performance summaries, and relevant certifications.
              The AI uses all materials to build a comprehensive, winning response.
            </p>
          </div>
        </div>
      )}

      {/* Proceed button */}
      {isReady && hasRFP && (
        <div className="flex justify-end">
          <button
            onClick={() => onComplete(documents)}
            className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Analyze RFP
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
