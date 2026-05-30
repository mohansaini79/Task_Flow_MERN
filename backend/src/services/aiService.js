/**
 * AI Task Enhancement Service
 *
 * Strategy:
 * 1. Try Gemini API if GEMINI_API_KEY is set
 * 2. Fall back to rule-based enhancement if API is unavailable
 */

// ─── Rule-Based Enhancement (Fallback) ─────────────────────────────────────────

const VERB_PATTERNS = [
  { pattern: /follow.?up|followup/i, category: 'Communication', verb: 'Follow Up With' },
  { pattern: /call|phone|ring/i, category: 'Communication', verb: 'Schedule Call With' },
  { pattern: /email|send|write/i, category: 'Communication', verb: 'Send Email Regarding' },
  { pattern: /meet|meeting|discuss/i, category: 'Meeting', verb: 'Schedule Meeting About' },
  { pattern: /review|check|verify|inspect/i, category: 'Review', verb: 'Review and Verify' },
  { pattern: /fix|bug|error|issue|problem/i, category: 'Development', verb: 'Investigate and Fix' },
  { pattern: /build|create|develop|implement/i, category: 'Development', verb: 'Build and Implement' },
  { pattern: /design|ui|ux|wireframe|mockup/i, category: 'Design', verb: 'Design and Finalize' },
  { pattern: /test|qa|quality/i, category: 'Testing', verb: 'Test and Validate' },
  { pattern: /deploy|release|publish|launch/i, category: 'DevOps', verb: 'Deploy and Monitor' },
  { pattern: /update|upgrade|migrate/i, category: 'Maintenance', verb: 'Update and Migrate' },
  { pattern: /document|docs|readme|wiki/i, category: 'Documentation', verb: 'Document and Update' },
  { pattern: /research|investigate|analyze|study/i, category: 'Research', verb: 'Research and Analyze' },
  { pattern: /plan|schedule|organize/i, category: 'Planning', verb: 'Plan and Organize' },
  { pattern: /report|summary|present/i, category: 'Reporting', verb: 'Prepare Report For' },
];

const CATEGORY_DESCRIPTIONS = {
  Communication: (subject) => `
Reach out to ${subject} to ensure alignment and address any pending items.

**Action Items:**
- Prepare a clear summary of discussion points before the conversation
- Document key outcomes and agreed next steps
- Set follow-up reminders if no response within 24–48 hours
- Update relevant team members on the outcomes

**Priority:** Medium | **Estimated Time:** 30–60 minutes`,

  Meeting: (subject) => `
Schedule and conduct a focused meeting about ${subject}.

**Action Items:**
- Send calendar invite with agenda at least 24 hours in advance
- Prepare meeting materials and talking points
- Take notes during the meeting
- Send a summary with action items within 2 hours of meeting completion

**Priority:** Medium | **Estimated Time:** 1–2 hours`,

  Review: (subject) => `
Conduct a thorough review of ${subject} to ensure quality and completeness.

**Action Items:**
- Define review criteria and checklist
- Identify issues, gaps, or improvements
- Document findings with specific recommendations
- Communicate results to stakeholders

**Priority:** High | **Estimated Time:** 1–3 hours`,

  Development: (subject) => `
Implement the development work for ${subject}.

**Action Items:**
- Break down the task into smaller subtasks
- Write clean, well-documented code
- Write or update unit tests
- Create a pull request with a clear description
- Request code review from peers

**Priority:** High | **Estimated Time:** 2–8 hours`,

  Design: (subject) => `
Create design assets and specifications for ${subject}.

**Action Items:**
- Gather requirements and reference materials
- Create initial wireframes or mockups
- Iterate based on feedback
- Deliver final assets in required formats
- Document design decisions

**Priority:** Medium | **Estimated Time:** 2–6 hours`,

  Testing: (subject) => `
Execute comprehensive testing for ${subject}.

**Action Items:**
- Define test cases covering happy path and edge cases
- Execute tests and document results
- Log any bugs with reproduction steps
- Verify fixes and perform regression testing
- Sign off on quality

**Priority:** High | **Estimated Time:** 2–4 hours`,

  DevOps: (subject) => `
Deploy and monitor ${subject} in the target environment.

**Action Items:**
- Prepare deployment checklist
- Create a rollback plan
- Deploy during low-traffic window
- Monitor logs and metrics post-deployment
- Notify stakeholders of successful deployment

**Priority:** Critical | **Estimated Time:** 1–3 hours`,

  Maintenance: (subject) => `
Update and maintain ${subject} to ensure continued reliability.

**Action Items:**
- Review changelog and breaking changes
- Test in staging environment first
- Schedule maintenance window
- Execute update with monitoring
- Verify functionality after update

**Priority:** Medium | **Estimated Time:** 1–4 hours`,

  Documentation: (subject) => `
Create or update documentation for ${subject}.

**Action Items:**
- Identify gaps in existing documentation
- Write clear, concise, and accurate content
- Add code examples where relevant
- Have documentation reviewed by a peer
- Publish to the appropriate location

**Priority:** Low | **Estimated Time:** 1–3 hours`,

  Research: (subject) => `
Research and analyze ${subject} to inform decision-making.

**Action Items:**
- Define research objectives and success criteria
- Gather data from reliable sources
- Analyze findings and identify key insights
- Document conclusions and recommendations
- Present findings to relevant stakeholders

**Priority:** Medium | **Estimated Time:** 2–6 hours`,

  Planning: (subject) => `
Plan and organize ${subject} for efficient execution.

**Action Items:**
- Define scope, objectives, and success criteria
- Break down into actionable milestones
- Assign responsibilities and deadlines
- Identify risks and mitigation strategies
- Communicate plan to all stakeholders

**Priority:** High | **Estimated Time:** 1–3 hours`,

  Reporting: (subject) => `
Prepare and deliver a comprehensive report about ${subject}.

**Action Items:**
- Collect and verify all relevant data
- Structure report with clear sections
- Include key metrics, findings, and recommendations
- Review for accuracy before sharing
- Present to stakeholders

**Priority:** Medium | **Estimated Time:** 2–4 hours`,

  General: (subject) => `
Complete the task related to ${subject}.

**Action Items:**
- Define clear objectives and success criteria
- Break down into smaller, manageable steps
- Track progress and address blockers promptly
- Review completed work against objectives
- Document outcomes and lessons learned

**Priority:** Medium | **Estimated Time:** 1–4 hours`,
};

/**
 * Rule-based task enhancement
 */
const ruleBasedEnhancement = (input) => {
  const trimmed = input.trim();

  // Try to detect verb/category
  let detectedCategory = 'General';
  let detectedVerb = 'Complete Task:';
  let subject = trimmed;

  for (const { pattern, category, verb } of VERB_PATTERNS) {
    if (pattern.test(trimmed)) {
      detectedCategory = category;
      detectedVerb = verb;
      // Extract subject: remove the matched verb from the beginning
      subject = trimmed.replace(pattern, '').trim();
      // Clean up common prepositions at the start
      subject = subject.replace(/^(with|the|a|an|for|to|about|on|in|at)\s+/i, '').trim();
      if (!subject) subject = trimmed;
      break;
    }
  }

  // Capitalize subject
  const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

  const title = `${detectedVerb} ${capitalizedSubject}`;
  const descriptionTemplate = CATEGORY_DESCRIPTIONS[detectedCategory] || CATEGORY_DESCRIPTIONS['General'];
  const description = descriptionTemplate(capitalizedSubject).trim();

  return { title, description, enhanced: true, method: 'rule-based' };
};

// ─── Gemini API Enhancement ─────────────────────────────────────────────────────

const enhanceWithGemini = async (input) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini API key');

  const prompt = `You are a professional project manager. A user has entered a quick task note. 
Transform it into a structured task with an improved title and detailed description.

User input: "${input}"

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "title": "Professional, action-oriented title (max 10 words)",
  "description": "Detailed description with action items, context, and estimated effort (150-300 words in markdown format)"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('Empty response from Gemini');

  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemini');

  const result = JSON.parse(jsonMatch[0]);
  return { ...result, enhanced: true, method: 'gemini' };
};

// ─── Main Export ────────────────────────────────────────────────────────────────

/**
 * Enhance a task input using AI or fallback rule-based system
 * @param {string} input - Raw user input
 * @returns {Promise<{title: string, description: string, enhanced: boolean, method: string}>}
 */
const enhanceTask = async (input) => {
  try {
    // Attempt Gemini enhancement
    const result = await enhanceWithGemini(input);
    return result;
  } catch (err) {
    // Silently fall back to rule-based system
    console.warn(`[AI Service] Falling back to rule-based: ${err.message}`);
    return ruleBasedEnhancement(input);
  }
};

module.exports = { enhanceTask, ruleBasedEnhancement };
