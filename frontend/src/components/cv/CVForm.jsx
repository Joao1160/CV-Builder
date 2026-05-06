import { useState } from 'react'
import {
  User, Briefcase, GraduationCap, Wrench,
  ChevronDown, ChevronUp, Plus, Trash2,
  Award, Globe2, FolderGit2, Trophy, Code2, Brain
} from 'lucide-react'
import { useCVStore } from '@/store/cvStore'

/* ── Collapsible Section ── */
function Section({ icon: Icon, title, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} style={{ color: 'var(--primary)' }} />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          {badge !== undefined && (
            <span className="badge text-xs" style={{ fontSize: 10 }}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

/* ── Field ── */
function Field({ label, children, full = false }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

/* ── Card wrapper for list items ── */
function ItemCard({ onRemove, children }) {
  return (
    <div className="card p-4 space-y-3 relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 size={14} />
      </button>
      {children}
    </div>
  )
}

/* ── Pill input (Enter to add) ── */
function PillInput({ items = [], onAdd, onRemove, placeholder, colorClass = '' }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[36px]">
        {items.map((item, i) => (
          <span
            key={i}
            onClick={() => onRemove(i)}
            className={`badge cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors group ${colorClass}`}
          >
            {typeof item === 'string' ? item : item.name}
            <span className="group-hover:inline hidden ml-1">×</span>
          </span>
        ))}
      </div>
      <input
        className="input-field"
        placeholder={placeholder}
        onKeyDown={e => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            onAdd(e.target.value.trim())
            e.target.value = ''
            e.preventDefault()
          }
        }}
      />
      <p className="text-xs text-gray-400">Press Enter to add · Click to remove</p>
    </div>
  )
}

/* ─────────────────────────────
   MAIN FORM
───────────────────────────── */
export default function CVForm() {
  const { currentCV, updateField } = useCVStore()
  if (!currentCV) return null

  const set = (field) => (e) => updateField(field, e.target.value)

  /* ── Generic list helpers ── */
  const listAdd = (field, item) => updateField(field, [...(currentCV[field] || []), item])
  const listRemove = (field, idx) => updateField(field, (currentCV[field] || []).filter((_, i) => i !== idx))
  const listUpdate = (field, idx, patch) => {
    const arr = [...(currentCV[field] || [])]
    arr[idx] = { ...arr[idx], ...patch }
    updateField(field, arr)
  }

  /* ── Skills: technical vs non-technical ── */
  const addTechSkill = (val) => {
    const list = currentCV.technicalSkills || []
    if (!list.includes(val)) updateField('technicalSkills', [...list, val])
  }
  const removeTechSkill = (i) => updateField('technicalSkills', (currentCV.technicalSkills || []).filter((_, j) => j !== i))

  const addSoftSkill = (val) => {
    const list = currentCV.softSkills || []
    if (!list.includes(val)) updateField('softSkills', [...list, val])
  }
  const removeSoftSkill = (i) => updateField('softSkills', (currentCV.softSkills || []).filter((_, j) => j !== i))

  /* ── Languages ── */
  const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']
  const addLang = () => listAdd('languages', { name: '', level: 'Fluent' })
  const updateLang = (i, patch) => listUpdate('languages', i, patch)
  const removeLang = (i) => listRemove('languages', i)

  /* ── Certifications ── */
  const addCert = () => listAdd('certifications', { name: '', issuer: '', date: '', url: '' })
  const updateCert = (i, patch) => listUpdate('certifications', i, patch)
  const removeCert = (i) => listRemove('certifications', i)

  /* ── Projects ── */
  const addProj = () => listAdd('projects', { name: '', description: '', url: '', techs: [] })
  const updateProj = (i, patch) => listUpdate('projects', i, patch)
  const removeProj = (i) => listRemove('projects', i)
  const addProjTech = (i, val) => {
    const proj = currentCV.projects?.[i] || {}
    const techs = proj.techs || []
    if (!techs.includes(val)) updateProj(i, { techs: [...techs, val] })
  }
  const removeProjTech = (i, ti) => {
    const proj = currentCV.projects?.[i] || {}
    updateProj(i, { techs: (proj.techs || []).filter((_, j) => j !== ti) })
  }

  /* ── Achievements ── */
  const addAch = (val) => listAdd('achievements', val)
  const removeAch = (i) => listRemove('achievements', i)

  /* ── Experience ── */
  const addExp = () => listAdd('experiences', { company: '', position: '', startDate: '', endDate: '', description: '', current: false })
  const updateExp = (i, patch) => listUpdate('experiences', i, patch)
  const removeExp = (i) => listRemove('experiences', i)

  /* ── Education ── */
  const addEdu = () => listAdd('educations', { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' })
  const updateEdu = (i, patch) => listUpdate('educations', i, patch)
  const removeEdu = (i) => listRemove('educations', i)

  return (
    <div className="divide-y divide-gray-100">

      {/* ══════════════════════════════════
          1. PERSONAL INFORMATION
      ══════════════════════════════════ */}
      <Section icon={User} title="Personal Information">
        {/* Job Title */}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name">
            <input className="input-field" placeholder="Ahmed Mohamed"
              value={currentCV.fullName || ''} onChange={set('fullName')} />
          </Field>
          <Field label="Email">
            <input className="input-field" type="email" placeholder="ahmed@email.com"
              value={currentCV.email || ''} onChange={set('email')} />
          </Field>
          <Field label="Job Title / Headline" full>
            <input
              className="input-field font-medium"
              placeholder="e.g. Senior Software Engineer · Full Stack Developer"
              value={currentCV.jobTitle || ''}
              onChange={set('jobTitle')}
            />
          </Field>
          <Field label="Phone">
            <input className="input-field" placeholder="+20 100 000 0000"
              value={currentCV.phone || ''} onChange={set('phone')} />
          </Field>
          <Field label="Location">
            <input className="input-field" placeholder="Cairo, Egypt"
              value={currentCV.location || ''} onChange={set('location')} />
          </Field>
          <Field label="LinkedIn">
            <input className="input-field" placeholder="linkedin.com/in/username"
              value={currentCV.linkedIn || ''} onChange={set('linkedIn')} />
          </Field>
          <Field label="Website / Portfolio">
            <input className="input-field" placeholder="myportfolio.com"
              value={currentCV.website || ''} onChange={set('website')} />
          </Field>
        </div>

        <Field label="Summary">
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="A passionate software engineer with 5+ years of experience building scalable web applications..."
            value={currentCV.summary || ''}
            onChange={set('summary')}
          />
        </Field>
      </Section>

      {/* ══════════════════════════════════
          2. WORK EXPERIENCE
      ══════════════════════════════════ */}
      <Section icon={Briefcase} title="Work Experience" badge={(currentCV.experiences || []).length || null}>
        {(currentCV.experiences || []).map((exp, idx) => (
          <ItemCard key={idx} onRemove={() => removeExp(idx)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company">
                <input className="input-field" placeholder="Google"
                  value={exp.company} onChange={e => updateExp(idx, { company: e.target.value })} />
              </Field>
              <Field label="Position / Title">
                <input className="input-field" placeholder="Senior Software Engineer"
                  value={exp.position} onChange={e => updateExp(idx, { position: e.target.value })} />
              </Field>
              <Field label="Start Date">
                <input className="input-field" placeholder="Jan 2021"
                  value={exp.startDate} onChange={e => updateExp(idx, { startDate: e.target.value })} />
              </Field>
              <Field label="End Date">
                <input className="input-field" placeholder="Present"
                  value={exp.endDate} disabled={exp.current}
                  onChange={e => updateExp(idx, { endDate: e.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={exp.current}
                onChange={e => updateExp(idx, { current: e.target.checked })}
                className="rounded" style={{ accentColor: 'var(--primary)' }}
              />
              Currently working here
            </label>
            <Field label="Description">
              <textarea className="input-field resize-none" rows={3}
                placeholder="Led a team of 5 engineers to build and ship a microservices platform that reduced load time by 40%..."
                value={exp.description} onChange={e => updateExp(idx, { description: e.target.value })} />
            </Field>
          </ItemCard>
        ))}
        <button onClick={addExp} className="btn-outline w-full justify-center">
          <Plus size={15} /> Add Experience
        </button>
      </Section>

      {/* ══════════════════════════════════
          3. EDUCATION
      ══════════════════════════════════ */}
      <Section icon={GraduationCap} title="Education" badge={(currentCV.educations || []).length || null}>
        {(currentCV.educations || []).map((edu, idx) => (
          <ItemCard key={idx} onRemove={() => removeEdu(idx)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Institution">
                <input className="input-field" placeholder="Cairo University"
                  value={edu.institution} onChange={e => updateEdu(idx, { institution: e.target.value })} />
              </Field>
              <Field label="Degree">
                <input className="input-field" placeholder="Bachelor of Science"
                  value={edu.degree} onChange={e => updateEdu(idx, { degree: e.target.value })} />
              </Field>
              <Field label="Field of Study">
                <input className="input-field" placeholder="Computer Science"
                  value={edu.field} onChange={e => updateEdu(idx, { field: e.target.value })} />
              </Field>
              <Field label="Grade / GPA">
                <input className="input-field" placeholder="3.8 / 4.0"
                  value={edu.grade} onChange={e => updateEdu(idx, { grade: e.target.value })} />
              </Field>
              <Field label="Start Date">
                <input className="input-field" placeholder="Sep 2017"
                  value={edu.startDate} onChange={e => updateEdu(idx, { startDate: e.target.value })} />
              </Field>
              <Field label="End Date">
                <input className="input-field" placeholder="Jun 2021"
                  value={edu.endDate} onChange={e => updateEdu(idx, { endDate: e.target.value })} />
              </Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={addEdu} className="btn-outline w-full justify-center">
          <Plus size={15} /> Add Education
        </button>
      </Section>

      {/* ══════════════════════════════════
          4. SKILLS — Technical & Soft
      ══════════════════════════════════ */}
      <Section icon={Code2} title="Skills">
        {/* Technical */}
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Code2 size={12} style={{ color: 'var(--primary)' }} />
            Technical Skills
          </p>
          <PillInput
            items={currentCV.technicalSkills || []}
            onAdd={addTechSkill}
            onRemove={removeTechSkill}
            placeholder="e.g. React, Java, Docker, AWS  (Enter to add)"
          />
        </div>

        <div className="border-t border-dashed border-gray-100 pt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Brain size={12} style={{ color: '#7c3aed' }} />
            Soft Skills
          </p>
          <PillInput
            items={currentCV.softSkills || []}
            onAdd={addSoftSkill}
            onRemove={removeSoftSkill}
            placeholder="e.g. Leadership, Communication, Teamwork  (Enter to add)"
            colorClass="bg-purple-50 text-purple-700"
          />
        </div>
      </Section>

      {/* ══════════════════════════════════
          5. LANGUAGES
      ══════════════════════════════════ */}
      <Section icon={Globe2} title="Languages" badge={(currentCV.languages || []).length || null} defaultOpen={false}>
        {(currentCV.languages || []).map((lang, idx) => (
          <ItemCard key={idx} onRemove={() => removeLang(idx)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Language">
                <input className="input-field" placeholder="Arabic"
                  value={lang.name} onChange={e => updateLang(idx, { name: e.target.value })} />
              </Field>
              <Field label="Proficiency Level">
                <select
                  className="input-field"
                  value={lang.level}
                  onChange={e => updateLang(idx, { level: e.target.value })}
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={addLang} className="btn-outline w-full justify-center">
          <Plus size={15} /> Add Language
        </button>
      </Section>

      {/* ══════════════════════════════════
          6. CERTIFICATIONS
      ══════════════════════════════════ */}
      <Section icon={Award} title="Certifications" badge={(currentCV.certifications || []).length || null} defaultOpen={false}>
        {(currentCV.certifications || []).map((cert, idx) => (
          <ItemCard key={idx} onRemove={() => removeCert(idx)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Certificate Name" full>
                <input className="input-field" placeholder="AWS Solutions Architect"
                  value={cert.name} onChange={e => updateCert(idx, { name: e.target.value })} />
              </Field>
              <Field label="Issuing Organization">
                <input className="input-field" placeholder="Amazon Web Services"
                  value={cert.issuer} onChange={e => updateCert(idx, { issuer: e.target.value })} />
              </Field>
              <Field label="Date">
                <input className="input-field" placeholder="Mar 2023"
                  value={cert.date} onChange={e => updateCert(idx, { date: e.target.value })} />
              </Field>
              <Field label="Credential URL" full>
                <input className="input-field" placeholder="https://credly.com/..."
                  value={cert.url} onChange={e => updateCert(idx, { url: e.target.value })} />
              </Field>
            </div>
          </ItemCard>
        ))}
        <button onClick={addCert} className="btn-outline w-full justify-center">
          <Plus size={15} /> Add Certification
        </button>
      </Section>

      {/* ══════════════════════════════════
          7. PROJECTS
      ══════════════════════════════════ */}
      <Section icon={FolderGit2} title="Projects" badge={(currentCV.projects || []).length || null} defaultOpen={false}>
        {(currentCV.projects || []).map((proj, idx) => (
          <ItemCard key={idx} onRemove={() => removeProj(idx)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Project Name">
                <input className="input-field" placeholder="CV Builder Platform"
                  value={proj.name} onChange={e => updateProj(idx, { name: e.target.value })} />
              </Field>
              <Field label="Project URL">
                <input className="input-field" placeholder="github.com/user/project"
                  value={proj.url} onChange={e => updateProj(idx, { url: e.target.value })} />
              </Field>
              <Field label="Description" full>
                <textarea className="input-field resize-none" rows={2}
                  placeholder="Built a full-stack CV builder with ATS optimization, live preview, and PDF export..."
                  value={proj.description} onChange={e => updateProj(idx, { description: e.target.value })} />
              </Field>
            </div>
            {/* Tech stack pills */}
            <div>
              <label className="label">Technologies Used</label>
              <PillInput
                items={proj.techs || []}
                onAdd={(val) => addProjTech(idx, val)}
                onRemove={(ti) => removeProjTech(idx, ti)}
                placeholder="React, Node.js, PostgreSQL  (Enter)"
              />
            </div>
          </ItemCard>
        ))}
        <button onClick={addProj} className="btn-outline w-full justify-center">
          <Plus size={15} /> Add Project
        </button>
      </Section>

      {/* ══════════════════════════════════
          8. ACHIEVEMENTS
      ══════════════════════════════════ */}
      <Section icon={Trophy} title="Achievements" badge={(currentCV.achievements || []).length || null} defaultOpen={false}>
        <div className="space-y-2">
          {(currentCV.achievements || []).map((ach, idx) => (
            <div key={idx} className="flex items-start gap-2 group">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--primary)' }} />
              <input
                className="input-field flex-1"
                placeholder="Reduced deployment time by 60% through CI/CD automation..."
                value={ach}
                onChange={e => {
                  const arr = [...(currentCV.achievements || [])]
                  arr[idx] = e.target.value
                  updateField('achievements', arr)
                }}
              />
              <button
                onClick={() => removeAch(idx)}
                className="mt-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addAch('')}
          className="btn-outline w-full justify-center"
        >
          <Plus size={15} /> Add Achievement
        </button>
        <p className="text-xs text-gray-400">
          Each achievement should be specific and quantified — numbers make a big impact!
        </p>
      </Section>

    </div>
  )
}
