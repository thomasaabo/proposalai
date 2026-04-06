---
name: rfp-expert
description: "Expert RFP analysis, compliance mapping, and proposal generation for government procurement. Trigger for: RFP, request for proposal, solicitation, bid, proposal writing, government procurement, compliance matrix, evaluation criteria, past performance, technical volume, cost volume, NAICS, SAM.gov, FAR, DFAR, set-aside, IDIQ, BPA, task order, best value, LPTA, source selection, bid decision, win strategy, proposal review, or any mention of responding to or analyzing an RFP. Also trigger for ProposalAI tool references. When in doubt, trigger."
---

# RFP Expert Analysis & Response Skill

## Overview

This skill provides deep domain expertise for analyzing government Request for Proposals (RFPs) and generating winning proposals. It is the analytical backbone of ProposalAI, triggered whenever a user needs to:

- Analyze an RFP to understand requirements, evaluation criteria, and compliance obligations
- Extract structured data from RFP documents
- Generate gaps analysis between vendor capabilities and RFP requirements
- Create compliance matrices
- Develop clarifying questions
- Write proposal sections that address evaluation criteria
- Score proposals against stated evaluation criteria
- Identify win themes and differentiators

## When This Skill Activates

This skill should be invoked for any task involving:
- **Documents**: RFP, solicitation, statement of work (SOW), request for quote (RFQ), invitation for bid (IFB), notice of intent, amendment, vendor information, company capabilities, resume, past performance reference, incumbent history
- **Analysis**: requirement extraction, evaluation criteria analysis, compliance matrix, gap analysis, bid/no-bid decision, risk assessment, source selection simulation
- **Writing**: proposal section generation (technical, management, past performance, cost), executive summary, win themes, response to evaluation criteria, ghost proposal, past performance narratives
- **Planning**: proposal strategy, compliance roadmap, resource allocation, schedule, volume structure, graphics plan, affordability analysis

**Explicit trigger phrases (not exhaustive):**
RFP, request for proposal, solicitation, government procurement, federal acquisition, FAR, DFARS, set-aside, small business, SDVOSB, women-owned, evaluation criteria, compliance matrix, past performance, LPTA, best value, source selection, technical volume, management volume, cost volume, proposal writing, NAICS, SAM.gov, UEI, DUNS, certification, 508 accessibility, CMMC, FedRAMP, cybersecurity, task order, IDIQ, BPA, GSA, blanket purchase agreement, contractor teaming, subcontracting plan, labor category, bid decision, win strategy, proposal review, proposal scoring, proposal feedback.

## Core Capabilities

### 1. RFP Parsing & Analysis
- Identify RFP structure (parts, sections, evaluation criteria, compliance requirements)
- Extract key deadlines, submission formats, page limits, mandatory vs. optional volumes
- Recognize evaluation methods (Best Value Trade-Off, LPTA, Past Performance, Source Selection)
- Flag compliance requirements (SAM.gov registration, UEI, certifications, security clearances)
- Identify clause references and regulatory implications
- Parse attachments and appendices to understand supplemental requirements

### 2. Requirement Extraction
- Distinguish mandatory requirements from nice-to-have features
- Identify implicit requirements buried in evaluation criteria or past performance questions
- Extract technical specifications, performance metrics, and acceptance criteria
- Recognize capability requirements (certifications, clearances, past experience)
- Map requirements to evaluation criteria (where is each requirement scored?)
- Identify conflicting or ambiguous requirements for clarifying questions

### 3. Compliance & Gap Analysis
- Generate structured compliance matrix (requirement → response location → evidence)
- Identify gaps between vendor capabilities and RFP requirements
- Flag missing certifications, experience, or capacity constraints
- Assess bid/no-bid risk (win probability, reputational risk, resource commitment)
- Recommend gap-mitigation strategies (teaming, subcontracting, capability building)

### 4. Proposal Strategy
- Develop win themes based on RFP evaluation criteria and market context
- Identify differentiators and competitive advantages
- Map proposal strategy to evaluation criteria
- Recommend section structure and content allocation
- Suggest past performance examples and metrics alignment

### 5. Proposal Section Writing
- Write technical volumes that address evaluation criteria with proof points
- Craft management/organizational capability sections (team, experience, processes)
- Generate past performance narratives with quantified impact
- Write cost/pricing justification tied to technical approach
- Produce executive summaries that compel evaluation

### 6. Evaluation Simulation
- Score proposals against stated evaluation criteria
- Identify scoring gaps and vulnerability areas
- Simulate source selection panel dynamics
- Recommend strengthening strategies before submission

## Key Resources

For detailed guidance, consult these reference files:

### `references/gov-procurement-guide.md`
Deep knowledge of:
- FAR/DFARS regulatory frameworks and their impact on proposals
- Evaluation methods and scoring dynamics
- Set-aside types (8(a), HUBZone, VOSB, SDVOSB, women-owned)
- Contract types (FFP, T&M, CPFF, IDIQ, BPA) and their cost implications
- Compliance requirements (SAM.gov, UEI, certifications, security standards)
- Government procurement terminology

### `references/proposal-writing-guide.md`
Expert techniques for:
- Volume-by-volume writing strategy (Technical, Management, Past Performance, Cost/Price)
- Executive summary formulas that win
- How to write proof points that align with evaluation criteria
- Action caption methodology for graphics
- Compliance matrix structure and maintenance
- Ghost proposal and counter-ghost strategies
- How to handle weaknesses and gaps honestly
- Page count management and prioritization
- Common proposal mistakes and recovery strategies

### `references/analysis-prompts.md`
**Production-ready Claude API prompts** that power ProposalAI's backend:
- Document classification (identify document type and relevance)
- RFP analysis prompt (extract structured data from RFPs)
- Gap analysis prompt (compare vendor materials against RFP)
- Clarifying questions generation (identify ambiguities to resolve)
- Proposal section generation (write sections aligned to evaluation criteria)
- Compliance matrix generation (map requirements to responses)
- Proposal scoring/review (self-evaluate against evaluation criteria)
- Proactive suggestions (market insights, win themes, strengthening recommendations)

**All analysis prompts are formatted as complete system + user message templates with JSON output schemas.** These are designed to be called directly by the ProposalAI backend API as system prompts for the Claude API.

## How to Use This Skill

### For ProposalAI Backend Integration
The analysis prompts in `references/analysis-prompts.md` are designed to be integrated directly into the ProposalAI backend. Each prompt:
1. Provides a system prompt defining Claude's expert role and output format
2. Includes a user message template with `{{variable}}` placeholders for dynamic content
3. Specifies the JSON output schema that the backend should expect

To integrate a prompt:
1. Read the full prompt from `analysis-prompts.md`
2. Replace all `{{placeholders}}` with actual data from the RFP, vendor materials, etc.
3. Call the Claude API with the system + user message
4. Parse the JSON response according to the schema provided

### For Standalone RFP Analysis
When analyzing an RFP or proposal materials directly:
1. Start with **RFP analysis prompt** to extract structure and requirements
2. Use **gap analysis prompt** to identify capability gaps
3. Generate **clarifying questions** for ambiguous requirements
4. Use **compliance matrix prompt** to map requirements to proposal sections
5. Use **proposal scoring prompt** to evaluate your draft against evaluation criteria
6. Iteratively refine with **proactive suggestions prompt** for win themes

### Theory & Best Practices
Reference `gov-procurement-guide.md` for:
- Understanding regulatory frameworks (why requirements exist)
- Negotiation and teaming strategies
- Risk assessment frameworks
- How evaluation panels work (panel dynamics, scoring psychology)

Reference `proposal-writing-guide.md` for:
- Structural best practices
- Writing techniques that resonate with government evaluators
- How to handle constraints (page limits, classification, format)
- Quality assurance before submission

## Important Notes

**Government RFPs are highly structured documents.** Each RFP follows specific regulations (FAR, DFARS) and includes:
- Mandatory compliance requirements (you fail to address these, you fail the bid)
- Evaluation criteria (your proposal is scored 0-100 against these)
- Proposal instructions (violate these, your proposal may be rejected as non-responsive)
- Regulatory clauses and flow-down requirements

**Winning proposals require three things:**
1. **Compliance**: Every mandatory requirement is addressed; no evaluation criteria are left blank
2. **Clarity**: Evaluators find your answer without hunting; section numbers match RFP references
3. **Persuasion**: You provide proof points (past performance, case studies, metrics) that differentiate you from competitors

This skill helps you achieve all three.

## Integration Checklist

- [ ] RFP document uploaded and classified (is it actually an RFP?)
- [ ] RFP analysis completed (structure, timeline, key compliance items identified)
- [ ] Vendor materials reviewed (capabilities document, resumes, past performance)
- [ ] Gap analysis completed (which requirements might we struggle to address?)
- [ ] Bid/no-bid decision made (is this a winnable opportunity?)
- [ ] Compliance matrix created (have we mapped every requirement?)
- [ ] Win themes developed (what's our competitive advantage?)
- [ ] Proposal sections drafted (have we addressed all evaluation criteria?)
- [ ] Self-scoring completed (would we get a passing score?)
- [ ] Peer review completed (independent reviewer eyes before submission)
