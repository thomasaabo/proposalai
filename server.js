import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dotenvDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dotenvDir, '.env'), override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// File upload config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error(`File type ${ext} not supported`));
  }
});

// Clients
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://fgbehzxrkbqiqrzcwxph.supabase.co',
  process.env.SUPABASE_ANON_KEY || ''
);

// ============ PROMPT TEMPLATES ============

const SYSTEM_CLASSIFY = `You are a government proposal analyst. Classify each document and determine its relevance to an RFP response workflow.

Types: rfp, vendor_summary, team_bios, past_performance, certifications, supporting

For each document, provide:
- type: one of the types above
- confidence: 0.0-1.0
- summary: one-line description of content

Respond ONLY with valid JSON array.`;

const SYSTEM_ANALYZE = `You are an expert government RFP analyst with 20 years of federal procurement experience. Parse this RFP document and extract ALL critical information for proposal response.

You must extract:
1. RFP Summary (title, agency, solicitation number, NAICS, set-aside, due date, estimated value, evaluation method, page limits, submission method)
2. Requirements (each with: id, section reference, full text, priority as mandatory/desirable, and status assessment)
3. Evaluation Criteria (each factor with weight percentage and description)
4. Compliance Checklist (items that must be verified before submission, flagged as critical or not)
5. Risk Areas (severity: high/medium/low, area name, and detailed explanation)
6. Strategic Insights (5-8 actionable recommendations for winning)

Be exhaustive. Every requirement matters. Flag ambiguous language. Note evaluation weightings precisely.

Respond ONLY with valid JSON matching the schema provided.`;

const SYSTEM_QUESTIONS = `You are a senior proposal manager preparing clarifying questions for an RFP response team. Based on the RFP analysis and any vendor materials provided, identify gaps and generate targeted questions.

For each question:
- category: Capability Gap, Personnel, Certifications, Past Performance, Technical, Key Personnel, Pricing Strategy, or Differentiator
- question: specific, detailed question with context
- priority: critical (blocks proposal), high (significantly impacts quality), or medium (nice to have)
- hint: explain WHY this matters for the proposal and how the answer will be used

Generate 6-10 questions, ordered by priority. Focus on information that will most impact proposal quality and compliance.

Respond ONLY with valid JSON array.`;

const SYSTEM_PROPOSAL = `You are an elite government proposal writer. You have won billions in federal contracts. Generate a structured proposal draft that:

1. Directly addresses every evaluation criterion
2. Maps content to RFP section requirements
3. Uses the "PROOF POINT" formula: Claim → Evidence → Impact → Differentiator
4. Writes in active voice, uses specific metrics, avoids vague language
5. Embeds compliance matrix references throughout
6. Leads each section with a theme statement tied to evaluation criteria

For each section, also provide AI suggestions:
- enhancement: ways to strengthen the content
- data_point: specific data/statistics to add
- compliance: compliance items to verify
- risk: areas of concern

Generate proposal sections with rich HTML content (h2, h3, p, ul, li, strong, table tags).

Respond ONLY with valid JSON matching the schema provided.`;

const SYSTEM_SUGGESTIONS = `You are a proposal strategist and market intelligence analyst. Based on the RFP analysis and proposal draft, proactively suggest:

1. Market data and statistics that would strengthen claims
2. Regulatory deadlines or compliance pressures the agency faces
3. Win rate research and best practices
4. Pricing intelligence for the relevant NAICS code
5. Additional documents the vendor should provide

Each suggestion should include a source or rationale. Be specific and actionable.

Respond ONLY with valid JSON array.`;

// ============ HELPER: Call Claude ============

async function callClaude(systemPrompt, userMessage, options = {}) {
  const { maxTokens = 8000, temperature = 0.3 } = options;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].text;

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch (e) {
    // Try parsing the whole response
    try {
      return JSON.parse(text.trim());
    } catch (e2) {
      console.error('Failed to parse Claude response as JSON:', text.substring(0, 200));
      throw new Error('AI response was not valid JSON');
    }
  }
}

// ============ HELPER: Extract text from file ============

async function extractText(filePath, mimeType) {
  if (mimeType === 'text/plain' || filePath.endsWith('.txt') || filePath.endsWith('.csv')) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (mimeType === 'application/pdf' || filePath.endsWith('.pdf')) {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (e) {
      console.error('PDF parse error:', e.message);
      return '[PDF text extraction failed — please provide text content]';
    }
  }

  // For .doc/.docx, try reading as text (basic fallback)
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '[Document text extraction not available for this format — please provide text content]';
  }
}

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.ANTHROPIC_API_KEY });
});

// Upload and classify documents
app.post('/api/documents/classify', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileData = await Promise.all(files.map(async (f) => {
      const text = await extractText(f.path, f.mimetype);
      return {
        name: f.originalname,
        size: f.size,
        text: text.substring(0, 5000), // First 5000 chars for classification
      };
    }));

    const userMessage = `Classify these ${fileData.length} documents:\n\n${fileData.map((f, i) =>
      `--- Document ${i + 1}: "${f.name}" (${f.size} bytes) ---\n${f.text}\n`
    ).join('\n')}

Respond with a JSON array where each element has: name, type, confidence, summary`;

    const classifications = await callClaude(SYSTEM_CLASSIFY, userMessage);

    // Merge classification data with file info
    const results = files.map((f, i) => ({
      id: crypto.randomUUID(),
      name: f.originalname,
      size: f.size,
      path: f.path,
      type: classifications[i]?.type || 'supporting',
      confidence: classifications[i]?.confidence || 0.5,
      summary: classifications[i]?.summary || '',
    }));

    res.json({ documents: results });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze RFP
app.post('/api/analyze', async (req, res) => {
  try {
    const { documents } = req.body; // Array of { path, name, type, text? }

    // Extract text from all uploaded docs
    const docTexts = await Promise.all(documents.map(async (doc) => {
      let text = doc.text;
      if (!text && doc.path) {
        text = await extractText(doc.path, '');
      }
      return { ...doc, text: text || '' };
    }));

    const rfpDoc = docTexts.find(d => d.type === 'rfp');
    const vendorDocs = docTexts.filter(d => d.type !== 'rfp');

    if (!rfpDoc || !rfpDoc.text) {
      return res.status(400).json({ error: 'No RFP document found or text extraction failed' });
    }

    const userMessage = `Analyze this RFP document:

--- RFP DOCUMENT ---
${rfpDoc.text.substring(0, 80000)}
---

${vendorDocs.length > 0 ? `\nVendor materials provided for cross-reference:\n${vendorDocs.map(d =>
  `--- ${d.type}: ${d.name} ---\n${d.text.substring(0, 10000)}\n`
).join('\n')}` : ''}

Provide comprehensive analysis as JSON with these top-level keys:
- rfpSummary: { title, agency, solicitation, naics, setAside, dueDate, estimatedValue, evaluationMethod, pageLimit, submissionMethod }
- requirements: array of { id, section, text, priority (mandatory/desirable), status (addressable/gap/needs_verification) }
- evaluationCriteria: array of { factor, weight (number), description }
- complianceChecklist: array of { item, status (needs_verification/pending), critical (boolean) }
- riskAreas: array of { severity (high/medium/low), area, detail }
- strategicInsights: array of strings`;

    const analysis = await callClaude(SYSTEM_ANALYZE, userMessage, { maxTokens: 12000 });

    // Save to Supabase
    if (process.env.SUPABASE_ANON_KEY) {
      const { data: project } = await supabase.from('projects').insert({
        title: analysis.rfpSummary?.title || 'Untitled RFP',
        status: 'analyzing',
        rfp_summary: analysis.rfpSummary,
      }).select().single();

      if (project) {
        await supabase.from('analyses').insert({
          project_id: project.id,
          requirements: analysis.requirements,
          evaluation_criteria: analysis.evaluationCriteria,
          compliance_checklist: analysis.complianceChecklist,
          risk_areas: analysis.riskAreas,
          strategic_insights: analysis.strategicInsights,
        });
        analysis._projectId = project.id;
      }
    }

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate clarifying questions
app.post('/api/questions', async (req, res) => {
  try {
    const { analysis, vendorContext } = req.body;

    const userMessage = `Based on this RFP analysis, generate clarifying questions for the proposal team.

RFP Summary:
${JSON.stringify(analysis.rfpSummary, null, 2)}

Requirements with gaps or verification needs:
${JSON.stringify(analysis.requirements?.filter(r => r.status !== 'addressable'), null, 2)}

Risk Areas:
${JSON.stringify(analysis.riskAreas, null, 2)}

${vendorContext ? `Vendor Context:\n${vendorContext}` : 'No vendor materials provided yet.'}

Generate 6-10 targeted questions as a JSON array where each element has:
- id: "q1", "q2", etc.
- category: string
- question: string (detailed, specific)
- priority: "critical" | "high" | "medium"
- hint: string (explains why this matters and how the answer will be used)
- answer: "" (empty string placeholder)`;

    const questions = await callClaude(SYSTEM_QUESTIONS, userMessage);

    // Save to Supabase if we have a project
    if (process.env.SUPABASE_ANON_KEY && analysis._projectId) {
      const questionRows = (Array.isArray(questions) ? questions : questions.questions || []).map(q => ({
        project_id: analysis._projectId,
        category: q.category,
        question: q.question,
        priority: q.priority,
        hint: q.hint,
      }));
      await supabase.from('questions').insert(questionRows);
    }

    res.json({ questions: Array.isArray(questions) ? questions : questions.questions || questions });
  } catch (error) {
    console.error('Questions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate proposal draft
app.post('/api/proposal', async (req, res) => {
  try {
    const { analysis, answers } = req.body;

    const answeredQs = (answers || []).filter(a => a.answer?.trim());

    const userMessage = `Generate a structured proposal draft based on this RFP analysis and vendor inputs.

RFP Analysis:
${JSON.stringify(analysis, null, 2)}

Vendor Answers to Clarifying Questions:
${answeredQs.length > 0
  ? answeredQs.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')
  : 'No answers provided — generate with placeholders.'}

Generate a proposal as JSON with:
- title: string
- solicitation: string
- sections: array of objects, each with:
  - id: kebab-case string
  - title: string
  - volume: string (e.g., "Volume I: Technical")
  - content: HTML string with h2, h3, p, ul, li, strong, table tags
  - suggestions: array of { type: "enhancement"|"data_point"|"compliance"|"risk"|"critical", text: string }
- overallSuggestions: array of { type: string, icon: emoji, title: string, text: string }

Include these sections at minimum:
1. Executive Summary
2. Technical Approach
3. Management Approach
4. Past Performance
5. Compliance Matrix

Make content specific to the RFP. Use vendor answers to fill details. Mark gaps with [PLACEHOLDER: description] brackets.`;

    const proposal = await callClaude(SYSTEM_PROPOSAL, userMessage, { maxTokens: 16000 });

    // Generate proactive suggestions
    const suggestionsMessage = `Based on this RFP analysis and proposal draft, provide proactive recommendations:

RFP: ${analysis.rfpSummary?.title || 'Unknown'}
NAICS: ${analysis.rfpSummary?.naics || 'Unknown'}
Estimated Value: ${analysis.rfpSummary?.estimatedValue || 'Unknown'}

Provide 4-6 proactive suggestions as a JSON array where each has:
- type: "proactive_data" | "additional_input"
- icon: relevant emoji
- title: short title (5-8 words)
- text: detailed recommendation with specific data points or sources`;

    const suggestions = await callClaude(SYSTEM_SUGGESTIONS, suggestionsMessage, { maxTokens: 4000 });

    const result = {
      ...proposal,
      overallSuggestions: [
        ...(proposal.overallSuggestions || []),
        ...(Array.isArray(suggestions) ? suggestions : suggestions.suggestions || []),
      ],
    };

    // Save to Supabase
    if (process.env.SUPABASE_ANON_KEY && analysis._projectId) {
      await supabase.from('proposals').insert({
        project_id: analysis._projectId,
        title: result.title || 'Draft Proposal',
        solicitation: result.solicitation,
        sections: result.sections,
        overall_suggestions: result.overallSuggestions,
      });
      await supabase.from('projects').update({ status: 'review' }).eq('id', analysis._projectId);
    }

    res.json(result);
  } catch (error) {
    console.error('Proposal error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 ProposalAI server running on http://localhost:${PORT}`);
  console.log(`   API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ configured' : '❌ missing — set ANTHROPIC_API_KEY in .env'}`);
  console.log(`   Supabase: ${process.env.SUPABASE_ANON_KEY ? '✅ connected' : '⚠️  not configured (running without persistence)'}\n`);
});
