// Mock AI engine - simulates Claude API responses for the prototype
// Replace with real Anthropic API calls in production

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate document classification
export async function classifyDocuments(files) {
  await delay(1500);

  return files.map(file => {
    const name = file.name.toLowerCase();
    let type = 'supporting';
    let confidence = 0.85;

    if (name.includes('rfp') || name.includes('solicitation') || name.includes('request for proposal')) {
      type = 'rfp';
      confidence = 0.95;
    } else if (name.includes('capability') || name.includes('vendor') || name.includes('company') || name.includes('about')) {
      type = 'vendor_summary';
      confidence = 0.92;
    } else if (name.includes('resume') || name.includes('bio') || name.includes('team')) {
      type = 'team_bios';
      confidence = 0.88;
    } else if (name.includes('past performance') || name.includes('experience') || name.includes('portfolio')) {
      type = 'past_performance';
      confidence = 0.90;
    } else if (name.includes('cert') || name.includes('license') || name.includes('registration')) {
      type = 'certifications';
      confidence = 0.91;
    }

    return {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type,
      confidence,
      file,
    };
  });
}

// Simulate RFP analysis
export async function analyzeRFP(documents, onProgress) {
  const steps = [
    { label: 'Parsing document structure...', duration: 1200 },
    { label: 'Extracting requirements and specifications...', duration: 1500 },
    { label: 'Identifying evaluation criteria and scoring...', duration: 1000 },
    { label: 'Building compliance checklist...', duration: 1300 },
    { label: 'Analyzing submission requirements...', duration: 800 },
    { label: 'Cross-referencing vendor capabilities...', duration: 1100 },
    { label: 'Identifying gaps and risk areas...', duration: 900 },
    { label: 'Generating strategic recommendations...', duration: 1000 },
  ];

  for (let i = 0; i < steps.length; i++) {
    onProgress?.({ step: i + 1, total: steps.length, label: steps[i].label });
    await delay(steps[i].duration);
  }

  return {
    rfpSummary: {
      title: "IT Infrastructure Modernization and Cloud Migration Services",
      agency: "U.S. Department of Health and Human Services (HHS)",
      solicitation: "HHS-2026-IT-0847",
      naics: "541512 — Computer Systems Design Services",
      setAside: "Small Business Set-Aside (Total)",
      dueDate: "May 15, 2026, 2:00 PM EST",
      estimatedValue: "$4.2M — $6.8M (IDIQ, 5-year base + 2 option years)",
      evaluationMethod: "Best Value Trade-Off",
      pageLimit: "Volume I: Technical (75 pages), Volume II: Management (30 pages), Volume III: Past Performance (20 pages), Volume IV: Cost/Price (no limit)",
      submissionMethod: "Electronic via SAM.gov",
    },
    requirements: [
      { id: 'R1', section: '3.1', text: 'Migrate existing on-premises infrastructure to FedRAMP-authorized cloud environment (AWS GovCloud or Azure Government)', priority: 'mandatory', status: 'addressable' },
      { id: 'R2', section: '3.2', text: 'Implement Zero Trust Architecture (ZTA) aligned with NIST SP 800-207 and OMB M-22-09', priority: 'mandatory', status: 'addressable' },
      { id: 'R3', section: '3.3', text: 'Provide 24/7/365 managed security operations center (SOC) with FedRAMP compliance monitoring', priority: 'mandatory', status: 'gap' },
      { id: 'R4', section: '3.4', text: 'Develop and execute data migration plan for 15+ legacy applications with zero data loss', priority: 'mandatory', status: 'addressable' },
      { id: 'R5', section: '3.5', text: 'Deliver staff augmentation: minimum 8 FTEs with active Secret clearance', priority: 'mandatory', status: 'gap' },
      { id: 'R6', section: '3.6', text: 'Implement DevSecOps pipeline with automated security scanning and continuous ATO', priority: 'desirable', status: 'addressable' },
      { id: 'R7', section: '3.7', text: 'Provide enterprise service management platform compatible with ServiceNow ITSM', priority: 'desirable', status: 'addressable' },
      { id: 'R8', section: '4.1', text: 'Contractor must hold ISO 27001 and SOC 2 Type II certifications', priority: 'mandatory', status: 'needs_verification' },
      { id: 'R9', section: '4.2', text: 'Prime contractor must have minimum 3 past performance references of similar scope ($3M+ federal IT modernization)', priority: 'mandatory', status: 'addressable' },
      { id: 'R10', section: '4.3', text: 'Key personnel must include: Program Manager (PMP, 10+ years), Technical Lead (cloud architect cert), Security Lead (CISSP)', priority: 'mandatory', status: 'needs_verification' },
    ],
    evaluationCriteria: [
      { factor: 'Technical Approach', weight: 35, description: 'Quality and feasibility of proposed technical solution, innovation, and risk mitigation' },
      { factor: 'Management Approach', weight: 25, description: 'Project management methodology, staffing plan, quality assurance, and transition plan' },
      { factor: 'Past Performance', weight: 25, description: 'Relevance, quality, and recency of past performance on similar contracts' },
      { factor: 'Cost/Price', weight: 15, description: 'Price reasonableness, realism, and completeness' },
    ],
    complianceChecklist: [
      { item: 'SAM.gov registration current and active', status: 'needs_verification', critical: true },
      { item: 'DUNS / UEI number provided', status: 'needs_verification', critical: true },
      { item: 'Small Business certification (SBA)', status: 'needs_verification', critical: true },
      { item: 'ISO 27001 certification', status: 'needs_verification', critical: true },
      { item: 'SOC 2 Type II report (within 12 months)', status: 'needs_verification', critical: true },
      { item: 'FedRAMP authorization or sponsorship', status: 'needs_verification', critical: true },
      { item: 'Key personnel resumes included', status: 'pending', critical: true },
      { item: 'Past performance questionnaires submitted', status: 'pending', critical: true },
      { item: 'Organizational conflict of interest statement', status: 'pending', critical: false },
      { item: 'Section 508 compliance plan', status: 'pending', critical: false },
      { item: 'Subcontracting plan (if applicable)', status: 'pending', critical: false },
      { item: 'Technical volume within 75-page limit', status: 'pending', critical: true },
    ],
    riskAreas: [
      { severity: 'high', area: 'SOC Operations', detail: 'RFP requires 24/7/365 SOC capability. Vendor materials do not mention existing SOC infrastructure. Consider teaming arrangement or subcontractor for this requirement.' },
      { severity: 'high', area: 'Cleared Personnel', detail: 'Minimum 8 FTEs with active Secret clearance required. Verify current cleared staff count and recruitment pipeline.' },
      { severity: 'medium', area: 'Certifications', detail: 'ISO 27001 and SOC 2 Type II are mandatory. Confirm these are current and audit dates are within the required window.' },
      { severity: 'low', area: 'ServiceNow Integration', detail: 'ITSM compatibility is desirable, not mandatory. Highlight any ServiceNow experience but do not over-invest proposal space here.' },
    ],
    strategicInsights: [
      'Best Value Trade-Off evaluation means technical excellence can overcome higher pricing — invest heavily in the Technical Approach volume.',
      'Past Performance is weighted equally with Management (25% each). Lead with your strongest, most recent federal IT modernization contract.',
      'The Zero Trust requirement signals this agency is under OMB compliance pressure — frame your approach as accelerating their compliance timeline.',
      'Consider a teaming arrangement for the 24/7 SOC requirement — this is likely a discriminator between bidders.',
      'The IDIQ structure with option years means emphasizing long-term partnership value and continuous improvement methodology.',
    ],
  };
}

// Generate clarifying questions based on analysis
export async function generateQuestions(analysis) {
  await delay(1000);

  return [
    {
      id: 'q1',
      category: 'Capability Gap',
      question: 'The RFP requires a 24/7/365 Security Operations Center (SOC). Do you currently operate a SOC, or would you plan to subcontract this capability? If subcontracting, do you have an existing teaming partner in mind?',
      priority: 'critical',
      hint: 'This is a mandatory requirement and likely a key discriminator. Your answer will shape the Management Approach volume.',
      answer: '',
    },
    {
      id: 'q2',
      category: 'Personnel',
      question: 'How many staff members currently hold active Secret (or higher) security clearances? The RFP requires a minimum of 8 cleared FTEs.',
      priority: 'critical',
      hint: 'If below 8, we should address your clearance sponsorship process and timeline in the staffing plan.',
      answer: '',
    },
    {
      id: 'q3',
      category: 'Certifications',
      question: 'Please confirm the status and expiration dates of your ISO 27001 certification and most recent SOC 2 Type II audit report.',
      priority: 'critical',
      hint: 'These are mandatory compliance requirements. If either is expired or pending, we need to address this directly.',
      answer: '',
    },
    {
      id: 'q4',
      category: 'Past Performance',
      question: 'Can you identify 3-5 federal IT modernization contracts you have performed in the last 5 years that are $3M+ in value? For each, provide: agency, contract number, value, and a one-line description.',
      priority: 'high',
      hint: 'Past Performance is 25% of evaluation. We need your strongest references that most closely match this scope.',
      answer: '',
    },
    {
      id: 'q5',
      category: 'Technical',
      question: 'Which FedRAMP-authorized cloud platform(s) do you have the deepest experience with — AWS GovCloud, Azure Government, or both? Do you hold any cloud partner certifications (e.g., AWS Advanced Consulting Partner)?',
      priority: 'high',
      hint: 'This drives the entire technical approach narrative. We want to lead with your strongest platform.',
      answer: '',
    },
    {
      id: 'q6',
      category: 'Key Personnel',
      question: 'Please identify your proposed key personnel for: (1) Program Manager (needs PMP, 10+ years), (2) Technical Lead (needs cloud architect cert), (3) Security Lead (needs CISSP). Are these individuals currently on staff?',
      priority: 'high',
      hint: 'Key personnel are typically evaluated individually. Strong bios with quantified achievements are essential.',
      answer: '',
    },
    {
      id: 'q7',
      category: 'Pricing Strategy',
      question: 'What is your target loaded labor rate range for this engagement? Do you have GSA Schedule or other government-wide contract pricing you can leverage?',
      priority: 'medium',
      hint: 'Cost is only 15% of evaluation, but unrealistic pricing can trigger a "price realism" flag. Existing schedule pricing strengthens your position.',
      answer: '',
    },
    {
      id: 'q8',
      category: 'Differentiator',
      question: 'What do you consider your single strongest differentiator for this opportunity? (e.g., proprietary methodology, unique tool, specific agency relationship, niche expertise)',
      priority: 'medium',
      hint: 'This will be woven throughout the proposal as your win theme — the evaluator\'s takeaway.',
      answer: '',
    },
  ];
}

// Generate proposal draft
export async function generateProposal(analysis, answers, onProgress) {
  const sections = [
    { label: 'Crafting executive summary...', duration: 1500 },
    { label: 'Writing technical approach (Section 3.1-3.7)...', duration: 2000 },
    { label: 'Developing management approach...', duration: 1500 },
    { label: 'Structuring past performance narratives...', duration: 1200 },
    { label: 'Building staffing plan and org chart...', duration: 1000 },
    { label: 'Compiling compliance matrix...', duration: 800 },
    { label: 'Integrating win themes and differentiators...', duration: 1000 },
    { label: 'Running compliance verification...', duration: 700 },
  ];

  for (let i = 0; i < sections.length; i++) {
    onProgress?.({ step: i + 1, total: sections.length, label: sections[i].label });
    await delay(sections[i].duration);
  }

  return {
    title: "Technical and Management Proposal — IT Infrastructure Modernization and Cloud Migration Services",
    solicitation: "HHS-2026-IT-0847",
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        volume: 'Volume I: Technical',
        content: `<h2>Executive Summary</h2>
<p><strong>[Vendor Name]</strong> is pleased to submit this proposal in response to Solicitation HHS-2026-IT-0847 for IT Infrastructure Modernization and Cloud Migration Services. We bring a proven track record of delivering complex federal IT transformation programs on time, within budget, and in full compliance with federal security mandates.</p>

<p><strong>Our Understanding:</strong> HHS requires a trusted partner to execute a comprehensive migration of on-premises infrastructure to a FedRAMP-authorized cloud environment while simultaneously implementing a Zero Trust Architecture aligned with NIST SP 800-207 and OMB M-22-09. This is not merely a "lift and shift" — it is a strategic modernization that must maintain operational continuity, ensure zero data loss across 15+ legacy applications, and establish a security posture that meets evolving federal compliance requirements.</p>

<p><strong>Our Approach:</strong> We propose a phased, risk-mitigated approach built on three pillars:</p>
<ul>
<li><strong>Assess-Migrate-Optimize (AMO) Methodology</strong> — Our proprietary framework for federal cloud migration that has been successfully deployed across [X] federal agencies, reducing migration timelines by an average of 30% while maintaining 100% data integrity.</li>
<li><strong>Zero Trust by Design</strong> — Rather than retrofitting security controls, we embed Zero Trust principles into every layer of the architecture from Day 1, accelerating HHS's compliance with OMB M-22-09.</li>
<li><strong>Continuous Authority to Operate (cATO)</strong> — Our DevSecOps pipeline delivers automated security scanning and continuous compliance monitoring, reducing the ATO maintenance burden by 60%.</li>
</ul>

<p><strong>Win Theme:</strong> [Vendor differentiator to be inserted based on clarifying question responses — e.g., "We are the only small business bidder with an existing FedRAMP-authorized SOC and 12 cleared personnel ready to deploy within 30 days of award."]</p>`,
        suggestions: [
          { type: 'enhancement', text: 'Add a specific dollar value or percentage for cost savings achieved on past similar projects. Evaluators respond to quantified claims.' },
          { type: 'data_point', text: 'Consider citing the GAO report on federal cloud migration (GAO-23-105894) to demonstrate awareness of government-wide modernization challenges.' },
          { type: 'compliance', text: 'Ensure the executive summary explicitly acknowledges all mandatory requirements (Section 3.1-3.5) to demonstrate full understanding of scope.' },
        ],
      },
      {
        id: 'technical-approach',
        title: 'Technical Approach',
        volume: 'Volume I: Technical',
        content: `<h2>3.0 Technical Approach</h2>

<h3>3.1 Cloud Migration Strategy</h3>
<p>Our approach to migrating HHS's on-premises infrastructure to a FedRAMP-authorized cloud environment follows our proven Assess-Migrate-Optimize (AMO) methodology, tailored specifically for federal workloads requiring FedRAMP High authorization.</p>

<p><strong>Phase 1: Assessment & Planning (Months 1-3)</strong></p>
<ul>
<li>Comprehensive discovery of all 15+ legacy applications, dependencies, and data flows using automated scanning tools</li>
<li>Application disposition analysis: Rehost, Replatform, Refactor, or Retire (4R Framework)</li>
<li>Risk assessment and migration sequencing based on business criticality and technical complexity</li>
<li>Development of detailed runbook for each application migration with rollback procedures</li>
</ul>

<p><strong>Phase 2: Foundation & Migration (Months 3-12)</strong></p>
<ul>
<li>Establish cloud landing zone with security guardrails, networking, and identity management</li>
<li>Execute phased migration waves (4-6 applications per wave) with parallel validation</li>
<li>Implement automated testing gates: functional, performance, security, and compliance</li>
<li>Zero-downtime cutover strategy with DNS-based traffic shifting and automatic failback</li>
</ul>

<p><strong>Phase 3: Optimization & Steady State (Months 12-18)</strong></p>
<ul>
<li>Right-sizing analysis and cost optimization (targeting 25-30% infrastructure cost reduction)</li>
<li>Performance tuning based on production workload patterns</li>
<li>Knowledge transfer to HHS staff with hands-on training program</li>
</ul>

<h3>3.2 Zero Trust Architecture Implementation</h3>
<p>Our Zero Trust implementation follows the CISA Zero Trust Maturity Model and directly addresses each pillar:</p>
<ul>
<li><strong>Identity:</strong> Phishing-resistant MFA (FIDO2/PIV), continuous authentication, and risk-based access policies</li>
<li><strong>Devices:</strong> Endpoint Detection and Response (EDR) with compliance posture checks before resource access</li>
<li><strong>Networks:</strong> Micro-segmentation, encrypted east-west traffic, software-defined perimeter</li>
<li><strong>Applications:</strong> Application-level access controls, API security gateway, SASE integration</li>
<li><strong>Data:</strong> Data classification, DLP policies, encryption at rest and in transit (FIPS 140-2 validated)</li>
</ul>

<h3>3.3 Managed Security Operations</h3>
<p>[This section will detail the 24/7/365 SOC capability — content dependent on teaming/subcontracting approach per clarifying questions.]</p>

<h3>3.4 Data Migration</h3>
<p>Our zero-data-loss guarantee is backed by our Triple Verification Protocol:</p>
<ul>
<li><strong>Pre-migration:</strong> Automated data inventory with row counts, checksums, and schema validation</li>
<li><strong>During migration:</strong> Real-time replication monitoring with automated pause on any integrity check failure</li>
<li><strong>Post-migration:</strong> Comprehensive reconciliation report comparing source and target with cryptographic hash verification</li>
</ul>

<h3>3.6 DevSecOps Pipeline</h3>
<p>Our continuous ATO approach integrates security into every stage of the development lifecycle:</p>
<ul>
<li>Infrastructure as Code (IaC) with automated compliance scanning (Terraform + Open Policy Agent)</li>
<li>Container security scanning, SBOM generation, and vulnerability management</li>
<li>Automated STIG compliance checking and remediation</li>
<li>Continuous monitoring dashboard with real-time compliance status for all NIST 800-53 controls</li>
</ul>`,
        suggestions: [
          { type: 'enhancement', text: 'Add a technical architecture diagram showing the target cloud environment, security boundaries, and data flows. Evaluators expect visual aids in technical volumes.' },
          { type: 'data_point', text: 'Reference specific AWS GovCloud or Azure Government services by name (e.g., "AWS GovCloud EC2, S3, and RDS") to demonstrate platform depth.' },
          { type: 'risk', text: 'Section 3.3 (SOC) is currently a placeholder. This is a mandatory requirement — ensure this is fully addressed before submission.' },
          { type: 'enhancement', text: 'For the DevSecOps section, consider mentioning specific tools (e.g., Prisma Cloud, Aqua Security, Twistlock) to demonstrate technical specificity.' },
        ],
      },
      {
        id: 'management-approach',
        title: 'Management Approach',
        volume: 'Volume II: Management',
        content: `<h2>4.0 Management Approach</h2>

<h3>4.1 Program Management Methodology</h3>
<p>We employ a hybrid Agile-Waterfall methodology optimized for federal IT programs. Strategic milestones and contractual deliverables follow a waterfall cadence for predictability and oversight, while technical execution operates in 2-week Agile sprints for adaptability and rapid delivery.</p>

<p><strong>Governance Structure:</strong></p>
<ul>
<li>Executive Steering Committee: Quarterly strategic reviews with HHS leadership</li>
<li>Program Management Office: Weekly status reporting, risk management, and resource allocation</li>
<li>Technical Working Groups: Bi-weekly deep dives on architecture, security, and migration execution</li>
<li>Daily Standups: 15-minute syncs during active migration waves</li>
</ul>

<h3>4.2 Staffing Plan</h3>
<p><strong>Key Personnel:</strong></p>
<ul>
<li><strong>Program Manager</strong> — [Name, PMP, 10+ years experience] — Single point of accountability for all contract deliverables, schedule, and budget</li>
<li><strong>Technical Lead / Cloud Architect</strong> — [Name, AWS/Azure certified] — Responsible for architecture decisions, migration execution, and technical quality</li>
<li><strong>Security Lead</strong> — [Name, CISSP] — Oversees Zero Trust implementation, SOC operations, and continuous ATO</li>
</ul>

<p><strong>Team Composition:</strong> [X] FTEs with active Secret clearance, organized into functional teams: Cloud Engineering (4), Security Operations (3), DevSecOps (2), Program Management (2).</p>

<h3>4.3 Quality Assurance</h3>
<p>Our QA framework includes: independent code review, automated testing (95%+ coverage target), monthly security audits, and quarterly contract performance reviews aligned with CPARS reporting requirements.</p>

<h3>4.4 Transition Plan</h3>
<p>We provide a 90-day transition-in plan and a comprehensive transition-out plan ensuring zero disruption to HHS operations at contract conclusion, including full documentation, knowledge transfer, and data/access handover.</p>`,
        suggestions: [
          { type: 'enhancement', text: 'Include an organizational chart showing reporting relationships between key personnel, HHS COR, and functional teams.' },
          { type: 'compliance', text: 'Verify the staffing plan meets the "minimum 8 FTEs with Secret clearance" requirement. Current draft uses [X] as placeholder.' },
          { type: 'data_point', text: 'Add retention rate statistics for your key personnel. Government evaluators value low turnover as a risk mitigator.' },
        ],
      },
      {
        id: 'past-performance',
        title: 'Past Performance',
        volume: 'Volume III: Past Performance',
        content: `<h2>5.0 Past Performance</h2>

<p>The following past performance references demonstrate [Vendor Name]'s proven capability to deliver IT infrastructure modernization and cloud migration services of similar scope, complexity, and value to the requirements of this solicitation.</p>

<p><strong>[Past performance entries to be populated based on vendor-provided contract references from clarifying questions.]</strong></p>

<p><strong>Reference Template (for each):</strong></p>
<ul>
<li><strong>Contract Title:</strong> [Title]</li>
<li><strong>Agency/Client:</strong> [Agency]</li>
<li><strong>Contract Number:</strong> [Number]</li>
<li><strong>Contract Value:</strong> [Value]</li>
<li><strong>Period of Performance:</strong> [Dates]</li>
<li><strong>Relevance:</strong> [2-3 sentences explaining how this contract is relevant to HHS requirements]</li>
<li><strong>Key Achievements:</strong> [Quantified outcomes — e.g., "migrated 22 applications to AWS GovCloud with zero downtime, achieving $1.2M annual cost savings"]</li>
<li><strong>CPARS Rating:</strong> [If available]</li>
<li><strong>Reference Contact:</strong> [Name, Title, Phone, Email]</li>
</ul>`,
        suggestions: [
          { type: 'critical', text: 'Past Performance is 25% of the evaluation. This section needs real contract references populated urgently — it is currently a template.' },
          { type: 'enhancement', text: 'For each reference, lead with the quantified outcome (e.g., "$X saved", "Y applications migrated") before the narrative. Evaluators skim.' },
          { type: 'data_point', text: 'If you have CPARS ratings of "Exceptional" or "Very Good," feature them prominently. These are the most trusted performance indicators for federal evaluators.' },
        ],
      },
      {
        id: 'compliance-matrix',
        title: 'Compliance Matrix',
        volume: 'Appendix',
        content: `<h2>Compliance Traceability Matrix</h2>

<table>
<tr><th>RFP Section</th><th>Requirement</th><th>Proposal Section</th><th>Status</th></tr>
<tr><td>3.1</td><td>Cloud migration to FedRAMP environment</td><td>3.1</td><td>✅ Addressed</td></tr>
<tr><td>3.2</td><td>Zero Trust Architecture (NIST 800-207)</td><td>3.2</td><td>✅ Addressed</td></tr>
<tr><td>3.3</td><td>24/7/365 SOC with FedRAMP monitoring</td><td>3.3</td><td>⚠️ Pending (teaming decision)</td></tr>
<tr><td>3.4</td><td>Data migration, zero data loss</td><td>3.4</td><td>✅ Addressed</td></tr>
<tr><td>3.5</td><td>8+ FTEs with Secret clearance</td><td>4.2</td><td>⚠️ Pending (staffing verification)</td></tr>
<tr><td>3.6</td><td>DevSecOps pipeline with continuous ATO</td><td>3.6</td><td>✅ Addressed</td></tr>
<tr><td>3.7</td><td>ServiceNow ITSM compatibility</td><td>3.7</td><td>🔵 Desirable — to address</td></tr>
<tr><td>4.1</td><td>ISO 27001 + SOC 2 Type II</td><td>Appendix</td><td>⚠️ Pending (certification verification)</td></tr>
<tr><td>4.2</td><td>3+ past performance references ($3M+)</td><td>5.0</td><td>⚠️ Pending (references needed)</td></tr>
<tr><td>4.3</td><td>Key personnel (PMP, Cloud Arch, CISSP)</td><td>4.2</td><td>⚠️ Pending (personnel identification)</td></tr>
</table>

<p><strong>Compliance Score: 4/10 mandatory requirements fully addressed.</strong> 6 items require vendor input to complete.</p>`,
        suggestions: [
          { type: 'critical', text: 'Only 4 of 10 mandatory requirements are fully addressed. The 6 pending items must be resolved before submission to avoid disqualification.' },
          { type: 'enhancement', text: 'Add a "Discriminator" column to this matrix showing which requirements you plan to exceed (not just meet). This signals confidence to evaluators.' },
        ],
      },
    ],
    overallSuggestions: [
      { type: 'proactive_data', icon: '📊', title: 'Federal Cloud Migration Market Data', text: 'According to the Federal IT Dashboard (itdashboard.gov), HHS spent $6.2B on IT in FY2025, with 43% allocated to O&M of legacy systems. Citing this data in your executive summary demonstrates market awareness and positions your solution as addressing a documented agency priority.' },
      { type: 'proactive_data', icon: '📋', title: 'OMB M-22-09 Compliance Deadline', text: 'The OMB Zero Trust mandate requires full implementation by FY2027. HHS is behind schedule based on recent FISMA audit reports. Framing your approach as "accelerating compliance before the deadline" creates urgency and aligns with agency leadership priorities.' },
      { type: 'proactive_data', icon: '🏆', title: 'Win Rate Enhancement', text: 'Research from Lohfeld Consulting shows that proposals with specific, quantified past performance examples win at 2.3x the rate of those with generic descriptions. Ensure every past performance reference includes at least 3 quantified outcomes.' },
      { type: 'proactive_data', icon: '⚖️', title: 'Pricing Intelligence', text: 'For similar IDIQ contracts in the 541512 NAICS code, loaded rates for cloud architects on federal contracts typically range $165-$225/hour. Pricing significantly outside this band will trigger price realism concerns during evaluation.' },
      { type: 'additional_input', icon: '📎', title: 'Suggested Additional Documents', text: 'To strengthen this proposal, consider uploading: (1) Your GSA Schedule price list, (2) Key personnel resumes, (3) ISO 27001 and SOC 2 certificates, (4) Past performance CPARS reports or client letters, (5) Any existing teaming agreements for SOC capabilities.' },
    ],
  };
}
