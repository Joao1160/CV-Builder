import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, LayoutTemplate, Target, Eye, EyeOff, Download } from 'lucide-react'
import { cvService, pdfService } from '@/services/api'
import { useCVStore } from '@/store/cvStore'
import CVForm           from '@/components/cv/CVForm'
import CVPreview        from '@/components/cv/CVPreview'
import ATSPanel         from '@/components/ats/ATSPanel'
import TemplateSelector from '@/components/templates/TemplateSelector'
import toast from 'react-hot-toast'

const RIGHT_TABS = [
  { id: 'preview',   label: 'Preview',   icon: Eye },
  { id: 'ats',       label: 'ATS Score', icon: Target },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
]

/* ── Default empty CV — يتطابق مع CVRequest.java بالظبط ── */
const EMPTY_CV = {
  title:            'My CV',
  fullName:         '',
  jobTitle:         '',
  email:            '',
  phone:            '',
  location:         '',
  summary:          '',
  linkedIn:         '',
  website:          '',
  technicalSkills:  [],
  softSkills:       [],
  achievements:     [],
  experiences:      [],
  educations:       [],
  projects:         [],
  certifications:   [],
  languages:        [],
}

export default function CVEditorPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { currentCV, setCurrentCV, isDirty, markSaved, resetCV } = useCVStore()

  const [loading,     setLoading]     = useState(!!id)
  const [saving,      setSaving]      = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [rightTab,    setRightTab]    = useState('preview')
  const [template,    setTemplate]    = useState('classic')
  const [showRight,   setShowRight]   = useState(true)

  const isNew = !id

  useEffect(() => {
    if (id) {
      cvService.getById(id)
        .then(data => {
          // دمج الـ response مع الـ EMPTY_CV عشان نضمن كل الـ fields موجودة
          setCurrentCV({ ...EMPTY_CV, ...data })
        })
        .catch(() => { toast.error('CV not found'); navigate('/dashboard') })
        .finally(() => setLoading(false))
    } else {
      resetCV()
      setCurrentCV({ ...EMPTY_CV })
    }
    return () => resetCV()
  }, [id])

  /* ── تنظيف البيانات قبل الإرسال ── */
  const sanitizeCV = (cv) => ({
    ...cv,
    // تأكد إن كل list موجودة وليست null
    technicalSkills:  cv.technicalSkills  || [],
    softSkills:       cv.softSkills       || [],
    achievements:     cv.achievements     || [],
    experiences:      (cv.experiences     || []).map(e => ({
      company:     e.company     || '',
      position:    e.position    || '',
      startDate:   e.startDate   || '',
      endDate:     e.endDate     || '',
      description: e.description || '',
      current:     e.current     || false,
    })),
    educations:       (cv.educations      || []).map(e => ({
      institution: e.institution || '',
      degree:      e.degree      || '',
      field:       e.field       || '',
      startDate:   e.startDate   || '',
      endDate:     e.endDate     || '',
      grade:       e.grade       || '',
    })),
    projects:         (cv.projects        || []).map(p => ({
      name:        p.name        || '',
      description: p.description || '',
      url:         p.url         || '',
      techs:       p.techs       || [],
    })),
    certifications:   (cv.certifications  || []).map(c => ({
      name:   c.name   || '',
      issuer: c.issuer || '',
      date:   c.date   || '',
      url:    c.url    || '',
    })),
    languages:        (cv.languages       || []).map(l => ({
      name:  l.name  || '',
      level: l.level || 'Fluent',
    })),
  })

  const handleSave = async () => {
    if (!currentCV?.title?.trim()) {
      toast.error('Please add a CV title')
      return
    }
    setSaving(true)
    try {
      const payload = sanitizeCV(currentCV)
      console.log('📤 Saving CV payload:', JSON.stringify(payload, null, 2))

      if (isNew) {
        const saved = await cvService.create(payload)
        markSaved()
        toast.success('CV created successfully!')
        navigate(`/cv/${saved.id}/edit`, { replace: true })
      } else {
        await cvService.update(id, payload)
        markSaved()
        toast.success('CV saved!')
      }
    } catch (err) {
      console.error('❌ Save error:', err.response?.data || err.message)
      toast.error('Failed to save: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!currentCV?.fullName) {
      toast.error('Please fill in your name before downloading')
      return
    }
    setDownloading(true)
    try {
      await pdfService.download(sanitizeCV(currentCV), template)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('PDF Service error — make sure it\'s running on :8084')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 shrink-0 shadow-sm">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={currentCV?.title || ''}
            onChange={e => useCVStore.getState().updateField('title', e.target.value)}
            className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none w-full"
            placeholder="Untitled CV"
          />
          {isDirty && <span className="text-xs text-amber-400">● Unsaved changes</span>}
        </div>

        <button onClick={() => setShowRight(!showRight)} className="btn-ghost">
          {showRight ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        <button onClick={handleDownloadPDF} disabled={downloading} className="btn-outline text-sm px-4 py-2">
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          PDF
        </button>

        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isNew ? 'Create' : 'Save'}
        </button>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        <div className={`${showRight ? 'w-[46%]' : 'w-full'} overflow-y-auto bg-white border-r border-gray-100 transition-all duration-300`}>
          <CVForm />
        </div>

        {showRight && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-100 flex items-center px-4 gap-1 shrink-0">
              {RIGHT_TABS.map(({ id: tid, label, icon: Icon }) => (
                <button
                  key={tid}
                  onClick={() => setRightTab(tid)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-all ${
                    rightTab === tid ? '' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={rightTab === tid ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50">
              {rightTab === 'preview' && (
                <div className="h-full overflow-y-auto">
                  <CVPreview template={template} />
                </div>
              )}
              {rightTab === 'ats' && (
                <div className="h-full"><ATSPanel /></div>
              )}
              {rightTab === 'templates' && (
                <div className="p-6 overflow-y-auto h-full">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Choose Template</p>
                  <TemplateSelector selected={template} onSelect={(t) => { setTemplate(t); setRightTab('preview') }} />
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
                    <div className="rounded-xl overflow-hidden shadow border border-gray-100 bg-white">
                      <CVPreview template={template} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
