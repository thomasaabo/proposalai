# RFP Expert Integration Guide

## Overview

The RFP Expert skill provides the analytical backbone for ProposalAI. It consists of:

1. **SKILL.md** - Overview of capabilities and trigger conditions
2. **references/gov-procurement-guide.md** - Deep domain knowledge on government procurement
3. **references/proposal-writing-guide.md** - Expert proposal writing techniques
4. **references/analysis-prompts.md** - Production-ready Claude API prompts for backend integration

## Backend Integration

### Adding Analysis Endpoints

Each prompt in `analysis-prompts.md` maps to a backend endpoint:

```
POST /api/rfp/analyze
POST /api/documents/classify
POST /api/rfp/extract-requirements
POST /api/vendor/analyze-gaps
POST /api/rfp/generate-questions
POST /api/proposal/generate-section
POST /api/proposal/self-score
POST /api/proposal/strategic-recommendations
```

### Implementation Steps

1. **Load the prompt templates** from `analysis-prompts.md`
2. **Create endpoint handler** that:
   - Takes input parameters (RFP text, vendor materials, etc.)
   - Fills in the {{template}} variables
   - Calls Claude API with system + user message
   - Validates response against JSON schema
   - Returns structured JSON to frontend

3. **Example handler (pseudocode)**:
```javascript
async function analyzeRFP(rfpText) {
  const systemPrompt = loadFromFile('analysis-prompts.md', 'RFP Analysis Prompt', 'System Prompt');

  const userMessage = `
Please analyze this RFP:

RFP Title: ${rfpData.title}
Agency: ${rfpData.agency}
Solicitation Number: ${rfpData.solicitation}

---
[RFP CONTENT]
${rfpText}
---

Provide comprehensive analysis in JSON format.
  `;

  const response = await claude.messages.create({
    model: "claude-opus-4-1-20250805",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  // Parse and validate JSON
  const analysis = JSON.parse(response.content[0].text);
  validateAgainstSchema(analysis, 'rfp_metadata', 'evaluation_criteria', ...);

  return analysis;
}
```

4. **Error handling**:
   - Catch non-JSON responses
   - Validate all required fields present
   - Return helpful errors to frontend (don't expose internal API errors)
   - Log failures for debugging

5. **Caching**:
   - Cache RFP analysis by solicitation number (same RFP = reuse)
   - Cache document classification results
   - Re-run gap analysis when vendor materials change
   - Always re-run proposal scoring (documents change frequently)

### Frontend Integration

1. **Document Upload Flow**:
   - User uploads RFP or vendor document
   - Frontend calls `/api/documents/classify` with document text
   - Returns `classification` + `relevance_score`
   - If RFP: trigger `/api/rfp/analyze` automatically
   - If vendor material: add to vendor profile

2. **RFP Analysis Dashboard**:
   - Display key findings: deadline, evaluation criteria, mandatory requirements
   - Show compliance obligations with implementation timeline
   - Flag red flags and win strategy insights
   - Link to clarifying questions

3. **Proposal Development**:
   - `/api/vendor/analyze-gaps` → shows what you're missing
   - `/api/proposal/generate-section` → draft sections aligned to criteria
   - `/api/proposal/self-score` → identify weaknesses before submission
   - `/api/proposal/strategic-recommendations` → win theme development

## Reference Material

For questions on specific topics, reference:

- **Evaluation methods, contract types, compliance requirements**: `gov-procurement-guide.md`
- **Proposal structure, writing techniques, quality assurance**: `proposal-writing-guide.md`
- **Prompt implementation, JSON schemas, error handling**: `analysis-prompts.md`

## Performance Considerations

- **RFP Analysis**: 2-5K tokens input, 1-2K output. Expect 5-15 second latency.
- **Gap Analysis**: 3-7K tokens input, 1-2K output. Expect 10-20 second latency.
- **Proposal Section Generation**: 3-8K tokens input, 2-4K output. Expect 15-30 second latency.
- **Proposal Scoring**: 3-10K tokens input, 1-3K output. Expect 15-30 second latency.

## Billing Estimates

Each analysis uses approximately:
- RFP Classification: ~0.3M tokens → ~$0.01-0.02
- RFP Analysis: ~3-7K tokens → ~$0.10-0.30
- Gap Analysis: ~4-9K tokens → ~$0.15-0.40
- Proposal Scoring: ~5-13K tokens → ~$0.20-0.50

## Key Capabilities

The RFP expert skill enables ProposalAI to:

1. **Parse RFPs** - Extract requirements, evaluation criteria, deadlines, compliance obligations
2. **Assess feasibility** - Gap analysis between vendor capabilities and RFP requirements
3. **Generate proposals** - Draft sections aligned to evaluation criteria
4. **Self-evaluate** - Score proposals before submission; identify weaknesses
5. **Strategy development** - Win themes, competitive positioning, risk mitigation

## Maintenance

- **Update prompts** if Claude API changes (e.g., new output formats, model updates)
- **Validate schemas** if government procurement requirements change
- **Test with real RFPs** to ensure accuracy and relevance
- **Gather user feedback** on analysis quality and usefulness

## Support

For questions on specific analysis results, reference the prompts:
- Unclear output? Read the prompt's explanation of that analysis
- JSON parsing issues? Check the "Expected JSON Output" section
- Need to extend functionality? Add new prompt template following the same format
