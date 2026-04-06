// Real API client — calls Express backend which talks to Claude API
const API_BASE = '/api';

async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// Check if backend is running and API key is configured
export async function checkHealth() {
  try {
    const data = await apiCall('/health');
    return data;
  } catch {
    return { status: 'error', hasApiKey: false };
  }
}

// Upload files and get AI classification
export async function classifyDocuments(files) {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));

  const res = await fetch(`${API_BASE}/documents/classify`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Classification failed');
  }
  const data = await res.json();
  return data.documents;
}

// Analyze RFP documents with Claude
export async function analyzeRFP(documents, onProgress) {
  // Simulate progress steps for UX (real analysis happens server-side)
  const steps = [
    'Uploading documents to analysis engine...',
    'Parsing document structure...',
    'Extracting requirements and specifications...',
    'Identifying evaluation criteria...',
    'Building compliance checklist...',
    'Analyzing risk areas...',
    'Generating strategic insights...',
    'Finalizing analysis...',
  ];

  // Start progress animation
  let currentStep = 0;
  const progressInterval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      onProgress?.({ step: currentStep + 1, total: steps.length, label: steps[currentStep] });
    }
  }, 3000);

  onProgress?.({ step: 1, total: steps.length, label: steps[0] });

  try {
    // Send documents with extracted text to the backend
    const docPayload = documents.map(d => ({
      name: d.name,
      type: d.type,
      path: d.path || '',
      text: d.text || '',
    }));

    const analysis = await apiCall('/analyze', {
      method: 'POST',
      body: JSON.stringify({ documents: docPayload }),
    });

    clearInterval(progressInterval);
    onProgress?.({ step: steps.length, total: steps.length, label: 'Analysis complete!' });

    return analysis;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

// Generate clarifying questions
export async function generateQuestions(analysis) {
  const data = await apiCall('/questions', {
    method: 'POST',
    body: JSON.stringify({ analysis }),
  });
  // Normalize: ensure each question has an answer field
  const questions = Array.isArray(data.questions) ? data.questions : data;
  return questions.map((q, i) => ({
    ...q,
    id: q.id || `q${i + 1}`,
    answer: q.answer || '',
  }));
}

// Generate proposal draft
export async function generateProposal(analysis, answers, onProgress) {
  const steps = [
    'Crafting executive summary...',
    'Writing technical approach...',
    'Developing management approach...',
    'Structuring past performance...',
    'Building compliance matrix...',
    'Integrating vendor responses...',
    'Generating AI suggestions...',
    'Final quality check...',
  ];

  let currentStep = 0;
  const progressInterval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      onProgress?.({ step: currentStep + 1, total: steps.length, label: steps[currentStep] });
    }
  }, 4000);

  onProgress?.({ step: 1, total: steps.length, label: steps[0] });

  try {
    const proposal = await apiCall('/proposal', {
      method: 'POST',
      body: JSON.stringify({ analysis, answers }),
    });

    clearInterval(progressInterval);
    onProgress?.({ step: steps.length, total: steps.length, label: 'Proposal generated!' });

    return proposal;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}
