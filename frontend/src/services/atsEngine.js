/**
 * ATS Scoring Engine
 * Analyzes CV data and returns a score + suggestions
 */

/* ── Common ATS keywords by category ── */
const POWER_VERBS = [
  'achieved','built','created','designed','developed','delivered','drove',
  'engineered','established','executed','founded','generated','implemented',
  'improved','increased','launched','led','managed','optimized','reduced',
  'resolved','scaled','shipped','streamlined','transformed'
]

const SOFT_SKILLS = [
  'leadership','communication','collaboration','problem-solving','teamwork',
  'analytical','strategic','innovative','adaptable','detail-oriented'
]

const TECH_KEYWORDS = [
  'agile','scrum','ci/cd','api','rest','microservices','cloud','aws','azure','gcp',
  'docker','kubernetes','devops','sql','nosql','git','tdd','oop','saas','b2b'
]

/* ── Helpers ── */
const textOf = (cv) => [
  cv.summary || '',
  ...(cv.experiences || []).map(e => `${e.position} ${e.company} ${e.description}`),
  ...(cv.educations  || []).map(e => `${e.degree} ${e.field} ${e.institution}`),
  ...(cv.skills      || []),
].join(' ').toLowerCase()

const countMatches = (text, words) =>
  words.filter(w => text.includes(w.toLowerCase()))

/* ── Main scorer ── */
export function scoreCV(cv) {
  const text     = textOf(cv)
  const checks   = []
  let   total    = 0

  /* 1. Contact completeness (20 pts) */
  const contactFields = [
    { key: 'fullName', label: 'Full name',    pts: 4 },
    { key: 'email',    label: 'Email',         pts: 4 },
    { key: 'phone',    label: 'Phone number',  pts: 4 },
    { key: 'location', label: 'Location',      pts: 4 },
    { key: 'linkedIn', label: 'LinkedIn URL',  pts: 4 },
  ]
  contactFields.forEach(({ key, label, pts }) => {
    const ok = !!(cv[key]?.trim())
    total += ok ? pts : 0
    checks.push({ category: 'Contact', label, ok, pts })
  })

  /* 2. Summary (15 pts) */
  const hasSummary   = !!(cv.summary?.trim())
  const summaryLong  = (cv.summary || '').split(' ').length >= 30
  total += hasSummary ? 8 : 0
  total += summaryLong ? 7 : 0
  checks.push({ category: 'Summary', label: 'Has professional summary', ok: hasSummary, pts: 8 })
  checks.push({ category: 'Summary', label: 'Summary is 30+ words',     ok: summaryLong, pts: 7 })

  /* 3. Experience (25 pts) */
  const expCount    = (cv.experiences || []).length
  const hasExp      = expCount >= 1
  const hasDesc     = (cv.experiences || []).every(e => e.description?.split(' ').length >= 10)
  const hasDates    = (cv.experiences || []).every(e => e.startDate)
  const powerCount  = countMatches(text, POWER_VERBS).length
  total += hasExp   ? 8  : 0
  total += hasDesc  ? 8  : 0
  total += hasDates ? 4  : 0
  total += Math.min(powerCount * 1, 5)
  checks.push({ category: 'Experience', label: 'Has work experience',           ok: hasExp,   pts: 8  })
  checks.push({ category: 'Experience', label: 'Descriptions are detailed',     ok: hasDesc,  pts: 8  })
  checks.push({ category: 'Experience', label: 'Dates included',                ok: hasDates, pts: 4  })
  checks.push({ category: 'Experience', label: `Action verbs (${powerCount} found)`, ok: powerCount >= 3, pts: 5 })

  /* 4. Education (10 pts) */
  const hasEdu = (cv.educations || []).length >= 1
  const hasEduDetails = (cv.educations || []).every(e => e.degree && e.institution)
  total += hasEdu        ? 5 : 0
  total += hasEduDetails ? 5 : 0
  checks.push({ category: 'Education', label: 'Has education entry',   ok: hasEdu,        pts: 5 })
  checks.push({ category: 'Education', label: 'Degree & school filled', ok: hasEduDetails, pts: 5 })

  /* 5. Skills (20 pts) */
  const skillCount  = (cv.skills || []).length
  const hasSkills   = skillCount >= 5
  const hasManySkills = skillCount >= 10
  const techMatches = countMatches(text, TECH_KEYWORDS)
  total += hasSkills     ? 8 : skillCount >= 1 ? 4 : 0
  total += hasManySkills ? 4 : 0
  total += Math.min(techMatches.length * 2, 8)
  checks.push({ category: 'Skills', label: `${skillCount} skills listed (need 5+)`, ok: hasSkills,     pts: 8 })
  checks.push({ category: 'Skills', label: '10+ skills for strong profile',          ok: hasManySkills, pts: 4 })
  checks.push({ category: 'Skills', label: `Tech keywords (${techMatches.length} found)`, ok: techMatches.length >= 2, pts: 8 })

  /* 6. Soft skills (10 pts) */
  const softMatches = countMatches(text, SOFT_SKILLS)
  total += Math.min(softMatches.length * 2, 10)
  checks.push({ category: 'Keywords', label: `Soft skills (${softMatches.length} found)`, ok: softMatches.length >= 2, pts: 10 })

  /* ── Build suggestions ── */
  const suggestions = []

  if (!hasSummary)
    suggestions.push({ level: 'error', text: 'Add a professional summary — it\'s the first thing ATS scans.' })
  else if (!summaryLong)
    suggestions.push({ level: 'warning', text: 'Expand your summary to 30+ words for better ATS ranking.' })

  if (!hasExp)
    suggestions.push({ level: 'error', text: 'Add at least one work experience entry.' })
  else if (!hasDesc)
    suggestions.push({ level: 'warning', text: 'Add detailed descriptions (10+ words) to each job entry.' })

  if (powerCount < 3)
    suggestions.push({ level: 'warning', text: `Use more action verbs. Try: ${POWER_VERBS.slice(0,5).join(', ')}...` })

  if (!hasSkills)
    suggestions.push({ level: 'error', text: 'Add at least 5 skills to pass ATS keyword matching.' })
  else if (!hasManySkills)
    suggestions.push({ level: 'info', text: 'Add more skills (aim for 10+) to increase keyword density.' })

  if (techMatches.length < 2)
    suggestions.push({ level: 'info', text: `Include industry keywords like: ${TECH_KEYWORDS.slice(0,6).join(', ')}.` })

  if (!cv.linkedIn)
    suggestions.push({ level: 'info', text: 'Add your LinkedIn URL — many recruiters verify profiles.' })

  if (softMatches.length < 2)
    suggestions.push({ level: 'info', text: `Mention soft skills in your summary: ${SOFT_SKILLS.slice(0,4).join(', ')}.` })

  /* ── Found keywords highlight ── */
  const foundVerbs = countMatches(text, POWER_VERBS)
  const foundTech  = countMatches(text, TECH_KEYWORDS)
  const foundSoft  = countMatches(text, SOFT_SKILLS)

  return {
    score:       Math.min(Math.round(total), 100),
    checks,
    suggestions,
    keywords: {
      powerVerbs: foundVerbs,
      techKeywords: foundTech,
      softSkills: foundSoft,
    },
  }
}

/* ── Score label ── */
export function scoreLabel(score) {
  if (score >= 85) return { label: 'Excellent',   color: '#16a34a' }
  if (score >= 70) return { label: 'Good',         color: '#2E8B73' }
  if (score >= 50) return { label: 'Fair',         color: '#d97706' }
  return                  { label: 'Needs Work',   color: '#dc2626' }
}
