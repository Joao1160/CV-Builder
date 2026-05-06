import { useMemo } from 'react'
import { useCVStore } from '@/store/cvStore'
import { scoreCV, scoreLabel } from '@/services/atsEngine'
import {
  CheckCircle2, XCircle, AlertCircle, Info,
  Zap, Tag, ChevronRight, TrendingUp
} from 'lucide-react'

/* ── Circular progress ── */
function ScoreRing({ score, color }) {
  const r   = 52
  const c   = 2 * Math.PI * r
  const pct = (score / 100) * c

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      {/* Track */}
      <circle cx="65" cy="65" r={r} fill="none" stroke="#f0f0f0" strokeWidth="10" />
      {/* Progress */}
      <circle
        cx="65" cy="65" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${pct} ${c}`}
        strokeDashoffset="0"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)' }}
      />
      {/* Score text */}
      <text x="65" y="60" textAnchor="middle" fontSize="26" fontWeight="700"
            fill={color} fontFamily="'DM Serif Display', serif">
        {score}
      </text>
      <text x="65" y="76" textAnchor="middle" fontSize="11" fill="#9ca3af"
            fontFamily="'DM Sans', sans-serif">
        / 100
      </text>
    </svg>
  )
}

/* ── Suggestion item ── */
const ICONS = {
  error:   { icon: XCircle,      color: '#dc2626', bg: '#fef2f2' },
  warning: { icon: AlertCircle,  color: '#d97706', bg: '#fffbeb' },
  info:    { icon: Info,         color: '#2563eb', bg: '#eff6ff' },
}

function SuggestionItem({ level, text }) {
  const { icon: Icon, color, bg } = ICONS[level] || ICONS.info
  return (
    <li className="flex gap-2.5 items-start p-2.5 rounded-lg" style={{ background: bg }}>
      <Icon size={15} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <span className="text-xs text-gray-700 leading-relaxed">{text}</span>
    </li>
  )
}

/* ── Keyword pills ── */
function KeywordGroup({ label, icon: Icon, words, color }) {
  if (!words?.length) return null
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
        <Icon size={12} style={{ color }} /> {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {words.map(w => (
          <span key={w} className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: `${color}18`, color }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Check row ── */
function CheckRow({ label, ok, pts }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        {ok
          ? <CheckCircle2 size={14} className="shrink-0" style={{ color: 'var(--primary)' }} />
          : <XCircle      size={14} className="shrink-0 text-gray-200" />
        }
        <span className={`text-xs ${ok ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
      </div>
      <span className={`text-xs font-mono font-medium shrink-0 ${ok ? '' : 'text-gray-300'}`}
            style={ok ? { color: 'var(--primary)' } : {}}>
        +{pts}
      </span>
    </div>
  )
}

/* ── Main Panel ── */
export default function ATSPanel() {
  const { currentCV: cv } = useCVStore()

  const result = useMemo(() => {
    if (!cv) return null
    return scoreCV(cv)
  }, [cv])

  if (!result) return null

  const { score, checks, suggestions, keywords } = result
  const { label, color } = scoreLabel(score)

  /* Group checks by category */
  const grouped = checks.reduce((acc, c) => {
    acc[c.category] = acc[c.category] || []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">

      {/* Score card */}
      <div className="card p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">ATS Score</p>

        <div className="flex justify-center">
          <ScoreRing score={score} color={color} />
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: `${color}18`, color }}>
            <TrendingUp size={13} />
            {label}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          {score >= 85
            ? 'Your CV is highly optimized for ATS systems!'
            : score >= 70
            ? 'Good CV! A few tweaks will make it excellent.'
            : score >= 50
            ? 'Your CV needs some improvements to pass ATS.'
            : 'Several important sections are missing or incomplete.'
          }
        </p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
            <Zap size={12} style={{ color: 'var(--primary)' }} />
            Improvements
          </p>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <SuggestionItem key={i} {...s} />
            ))}
          </ul>
        </div>
      )}

      {/* Keywords found */}
      <div className="card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
          <Tag size={12} style={{ color: 'var(--primary)' }} />
          Keywords Detected
        </p>
        <KeywordGroup label="Action Verbs"    icon={ChevronRight} words={keywords.powerVerbs}   color="#2E8B73" />
        <KeywordGroup label="Tech Keywords"   icon={ChevronRight} words={keywords.techKeywords}  color="#2563eb" />
        <KeywordGroup label="Soft Skills"     icon={ChevronRight} words={keywords.softSkills}    color="#7c3aed" />
        {!keywords.powerVerbs.length && !keywords.techKeywords.length && !keywords.softSkills.length && (
          <p className="text-xs text-gray-400 text-center py-2">
            No keywords detected yet. Fill in your CV!
          </p>
        )}
      </div>

      {/* Detailed checks */}
      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Score Breakdown</p>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-3 last:mb-0">
            <p className="text-xs font-semibold text-gray-600 mb-1">{cat}</p>
            {items.map((item, i) => <CheckRow key={i} {...item} />)}
          </div>
        ))}
      </div>

    </div>
  )
}
