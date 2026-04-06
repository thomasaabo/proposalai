import { FileText, Sparkles } from 'lucide-react';

export default function Header({ currentStep }) {
  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Analysis' },
    { num: 3, label: 'Questions' },
    { num: 4, label: 'Proposal' },
  ];

  return (
    <header className="bg-navy-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                ProposalAI
                <Sparkles className="w-4 h-4 text-gold-400" />
              </h1>
              <p className="text-navy-300 text-xs">Government RFP Response Engine</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  currentStep === step.num
                    ? 'bg-gold-400 text-navy-900 font-semibold'
                    : currentStep > step.num
                    ? 'bg-navy-700 text-emerald-400'
                    : 'text-navy-400'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep > step.num ? 'bg-emerald-400 text-navy-900' : ''
                  }`}>
                    {currentStep > step.num ? '✓' : step.num}
                  </span>
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step.num ? 'bg-emerald-400' : 'bg-navy-700'}`} />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
