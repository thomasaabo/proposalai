# ProposalAI — Product Brief

**Product Name**: ProposalAI (working title)
**Author**: Thomas Aabo / Aabo Advisory
**Date**: April 3, 2026

---

## Problem

Responding to government RFPs is a high-stakes, labor-intensive process. Vendors spend 40–80 hours per proposal, manually parsing compliance requirements, cross-referencing evaluation criteria, formatting to strict specifications, and ensuring no section is missed. A single omission — a missing certification, an unanswered requirement, a formatting error — can disqualify an otherwise winning bid. Small and mid-size vendors are disproportionately hurt because they lack dedicated proposal teams.

## Target User

**Primary**: A small-to-mid-size vendor (1–50 employees) responding to government RFPs. They might be a consulting firm, IT services provider, construction company, or professional services firm. They know their capabilities but dread the proposal process. They're currently using Word templates, copying from past proposals, and manually checking compliance matrices.

**User Persona — "Sarah"**: Director of Business Development at a 20-person IT consulting firm. She responds to 3–5 federal/state RFPs per month. Each one takes her team 2–3 weeks. She wins about 20% of the time and suspects better proposals would push that to 30%+.

## Solution Hypothesis

We believe building an AI-powered RFP analysis and response drafting tool will reduce proposal preparation time by 60%+ and improve win rates for government contractors. We will know this worked when users complete a draft proposal in under 4 hours that scores 80%+ on compliance completeness.

## MVP Scope (Must Have)

1. **Document Intake** — Upload RFP document, vendor capability summary, and optional supporting docs (past performance, certifications, team bios). Intelligent sorting understands what each document is.
2. **RFP Analysis Engine** — AI parses the RFP to extract: requirements, evaluation criteria, submission format, deadlines, compliance checklist, and scoring methodology.
3. **Clarifying Questions** — AI identifies gaps between RFP requirements and vendor materials, asks targeted questions, and suggests additional data points to strengthen the response.
4. **Proposal Draft Generation** — Produces a structured draft proposal matching the RFP's required format, with content mapped to evaluation criteria and compliance requirements.
5. **Active AI Partner** — Proactively suggests improvements: data points to include, statistics to cite, strengths to emphasize, weaknesses to address, and sourced/validated data to strengthen claims.

## Explicitly NOT in MVP

- RFP issuer portal / marketplace functionality
- Multi-user collaboration / social features
- Integration with SAM.gov or procurement databases
- Automated submission to procurement portals
- Historical win/loss analytics
- Template library management
- Payment/billing system

## Success Metric

**Time-to-draft**: A user with an RFP and vendor materials produces a compliance-complete first draft in under 4 hours (vs. 40–80 hours manually).

## Key Risks

1. **Document parsing quality** — Government RFPs come in wildly different formats (PDF tables, scanned docs, appendices). Parsing accuracy is critical.
2. **Hallucination risk** — AI must never fabricate vendor capabilities, certifications, or past performance. Everything in the proposal must be grounded in provided materials.
3. **Format compliance** — Government RFPs have strict formatting requirements (page limits, font sizes, section ordering). The output must respect these.
4. **Domain knowledge depth** — Different government agencies have different conventions and expectations. The tool needs to handle this variance.

---

## Technical Architecture (MVP)

### Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **AI Engine**: Claude API (Anthropic) for document analysis and generation
- **Document Processing**: PDF.js for parsing, mammoth for DOCX
- **Output**: Generated proposals as structured HTML → exportable to DOCX/PDF

### Core Data Model
- `projects` — A single RFP response effort
- `documents` — Uploaded files linked to a project (typed: rfp, vendor_summary, supporting)
- `analyses` — AI-generated analysis of the RFP (requirements, criteria, compliance checklist)
- `questions` — AI-generated clarifying questions + user answers
- `proposals` — Generated draft proposals with sections mapped to RFP requirements
- `suggestions` — Proactive AI suggestions for strengthening the response

### User Flow
```
Upload Documents → AI Classifies & Analyzes → Review Analysis
    → Answer Clarifying Questions → AI Generates Draft
    → Review Draft with AI Suggestions → Refine → Export
```
