# RFP Expert Skill - ProposalAI Backend

This directory contains the expert domain knowledge and AI analysis prompts that power ProposalAI's government proposal response engine.

## Structure

```
rfp-expert/
├── SKILL.md                    # Skill definition and capabilities overview
├── INTEGRATION.md              # Backend integration guide for engineers
├── README.md                   # This file
└── references/
    ├── gov-procurement-guide.md       # Government procurement domain knowledge
    ├── proposal-writing-guide.md      # Proposal writing best practices
    └── analysis-prompts.md            # Production-ready Claude API prompts
```

## Files at a Glance

### SKILL.md (172 lines)
**For**: Product managers, architects, anyone understanding ProposalAI capabilities

Contains:
- What the RFP expert skill does
- When it's triggered
- Core capabilities (RFP parsing, gap analysis, proposal generation, etc.)
- Reference material pointers

### INTEGRATION.md (155 lines)
**For**: Backend engineers implementing API endpoints

Contains:
- Backend integration overview
- Implementation steps and pseudocode
- Frontend integration flow
- Performance considerations and billing estimates
- Caching strategy
- Error handling and validation

### references/gov-procurement-guide.md (732 lines)
**For**: Anyone needing deep government procurement knowledge

Contains:
- **FAR (Federal Acquisition Regulation)**: 15 key parts with proposal impact
- **DFARS (Defense FAR Supplement)**: DoD-specific rules, security requirements, CMMC
- **Evaluation Methods**: Best Value, LPTA, Past Performance, scoring mechanics
- **Set-Asides**: Small business, WOSB, VOSB, 8(a), HUBZone categories
- **Contract Types**: FFP, T&M, CPFF, CPAF, IDIQ, BPA with strategy implications
- **Compliance Requirements**: SAM.gov, UEI, NAICS, certifications, security
- **Terminology**: Detailed 30+ term glossary (offeror, contractor, responsive, etc.)

### references/proposal-writing-guide.md (639 lines)
**For**: Proposal writers, analysts, anyone drafting proposal sections

Contains:
- **Executive Summary Formula**: Opening statement that compels evaluators
- **Technical Volume Writing**: How to write proof points with impact
- **Management Volume**: Team, schedule, risk management, quality narratives
- **Past Performance Volume**: Reference selection and narrative strategy
- **Cost Volume**: Labor buildup, overhead, profit justification
- **Compliance Matrix Strategy**: Requirement tracking and coverage verification
- **Graphics & Action Captions**: Visual communication best practices
- **Quality Assurance**: Pre-submission review checklist
- **Common Mistakes**: Red flags and recovery tactics

### references/analysis-prompts.md (758 lines)
**For**: Backend engineers, prompt engineers, API integration specialists

Contains 8 production-ready analysis prompts:

1. **Document Classification**
   - Identifies document type (RFP, vendor material, resume, etc.)
   - Returns relevance score and recommended use

2. **RFP Analysis**
   - Extracts requirements, evaluation criteria, deadlines
   - Flags compliance obligations, regulatory references
   - Returns structured JSON with metadata

3. **Gap Analysis**
   - Compares vendor capabilities vs. RFP requirements
   - Identifies critical gaps and mitigation strategies
   - Provides bid/no-bid recommendation

4. **Clarifying Questions Generation**
   - Identifies ambiguous RFP language
   - Generates professional clarifying questions
   - Prioritizes by importance

5. **Compliance Matrix Generation**
   - Maps every RFP requirement to proposal sections
   - Identifies evidence needed for each requirement
   - Flags high-risk or difficult requirements

6. **Proposal Section Generation**
   - Drafts proposal sections (Technical, Management, Past Performance)
   - Aligns to evaluation criteria
   - Includes proof points and graphics

7. **Proposal Scoring/Self-Evaluation**
   - Scores draft proposal against evaluation criteria (0-100)
   - Identifies strengths, weaknesses, improvements
   - Provides win probability assessment

8. **Proactive Suggestions**
   - Develops win themes
   - Identifies competitive differentiation
   - Recommends strategic improvements

**For each prompt**:
- System Prompt (role definition, analysis approach)
- User Message Template (with {{variable}} placeholders)
- Expected JSON Output (exact schema for validation)
- Integration guidelines

## How to Use This Skill

### For Product/Leadership
1. Read **SKILL.md** to understand capabilities
2. Reference **gov-procurement-guide.md** for government procurement context
3. Use **INTEGRATION.md** to estimate engineering effort

### For Backend Engineers
1. Read **INTEGRATION.md** for implementation overview
2. Review **analysis-prompts.md** for each endpoint you're building
3. Reference **gov-procurement-guide.md** if you need to understand domain context

### For Proposal Writers
1. Reference **proposal-writing-guide.md** for writing best practices
2. Reference **gov-procurement-guide.md** for compliance requirements
3. Use backend API endpoints to generate proposal sections

### For RFP Analysts
1. Use RFP Analysis endpoint to extract requirements
2. Use Gap Analysis to assess vendor capability alignment
3. Use Clarifying Questions to identify ambiguities
4. Reference **gov-procurement-guide.md** for compliance context

## Backend API Endpoints

Each analysis prompt maps to a backend API endpoint:

```
POST /api/documents/classify              # Document Classification
POST /api/rfp/analyze                     # RFP Analysis
POST /api/vendor/analyze-gaps             # Gap Analysis
POST /api/rfp/generate-questions          # Clarifying Questions
POST /api/proposal/compliance-matrix      # Compliance Matrix
POST /api/proposal/generate-section       # Section Generation
POST /api/proposal/self-score             # Proposal Scoring
POST /api/proposal/strategic-recommendations  # Proactive Suggestions
```

For implementation details, see **INTEGRATION.md**.

## Key Capabilities

### RFP Parsing
- Extract structured data (requirements, criteria, deadlines)
- Classify evaluation methods (Best Value, LPTA, etc.)
- Identify compliance obligations (SAM.gov, CMMC, clearances)
- Flag ambiguous requirements

### Feasibility Assessment
- Compare vendor capabilities vs. RFP requirements
- Identify gaps and risk areas
- Recommend bid/no-bid decisions
- Assess timeline and cost impact

### Proposal Development
- Generate sections aligned to evaluation criteria
- Create compliance matrices (requirement → section mapping)
- Draft executive summaries and detailed sections
- Provide specific proof points from past performance

### Quality Assurance
- Self-score proposals against evaluation criteria
- Identify scoring weaknesses
- Recommend pre-submission improvements
- Verify compliance completeness

### Strategy Development
- Develop win themes
- Identify competitive differentiation
- Select past performance references strategically
- Recommend risk mitigation approaches

## Domain Knowledge Highlights

### Government Procurement Framework
- **FAR/DFARS**: Clause-by-clause breakdown with proposal impact
- **Evaluation Methods**: Best Value scoring mechanics, LPTA strategy, Past Performance weighting
- **Compliance**: SAM.gov registration, CMMC Level 2, security clearances, NIST 800-171
- **Set-Asides**: Small business, WOSB, VOSB, 8(a), HUBZone categories and advantages

### Proposal Writing Expertise
- **Proof Point Formula**: Situation → Action → Quantified Result (with examples)
- **Weakness Strategy**: How to acknowledge gaps and provide credible mitigation
- **Page Allocation**: Match page count to evaluation criteria weights
- **Quality Assurance**: Pre-submission checklist preventing common mistakes

### Regulatory Knowledge
- **FAR Parts** 1-42: Which parts affect proposals and how
- **DFARS Additions**: DoD-specific rules, security requirements, flowdown obligations
- **Government Terminology**: 30+ terms (offeror, responsive, compliant, responsible, etc.)

## Integration with ProposalAI

The RFP Expert skill is the analytical engine of ProposalAI. Every feature in the platform flows through these prompts:

1. **Document Management**: Upload RFP → Classify → Extract
2. **Requirement Tracking**: Create compliance matrix → Map requirements → Identify gaps
3. **Proposal Development**: Draft section → Score → Improve
4. **Strategy**: Identify win themes → Develop differentiation → Assess probability

## Performance Notes

- **RFP Analysis**: 2-5K tokens in, 1-2K out, 5-15 seconds
- **Gap Analysis**: 3-7K tokens in, 1-2K out, 10-20 seconds
- **Proposal Section**: 3-8K tokens in, 2-4K out, 15-30 seconds
- **Proposal Scoring**: 3-10K tokens in, 1-3K out, 15-30 seconds

All prompts are optimized for Claude Opus 4.1 or latest model.

## Support & Maintenance

- **Questions on government procurement**: See gov-procurement-guide.md
- **Questions on proposal writing**: See proposal-writing-guide.md
- **Questions on implementation**: See analysis-prompts.md and INTEGRATION.md
- **Questions on capabilities**: See SKILL.md

## License & Attribution

This skill was created as part of ProposalAI, an AI-powered government RFP response tool.

The government procurement knowledge is based on:
- Federal Acquisition Regulation (FAR) - public domain
- Defense FAR Supplement (DFARS) - public domain
- NIST Cybersecurity Framework - public domain
- Expert proposal writing best practices - original content
- Production API prompts - original content designed for Claude

All content is original or properly attributed to government sources. No proprietary information is included.
