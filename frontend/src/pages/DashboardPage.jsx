import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Trash2, Edit3, Clock, Loader2, Sparkles } from 'lucide-react'
import { cvService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useCVStore } from '@/store/cvStore'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user }                     = useAuthStore()
  const { cvList, setCVList }        = useCVStore()
  const [loading, setLoading]        = useState(true)
  const [deletingId, setDeletingId]  = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      const data = await cvService.getAll()
      setCVList(data)
    } catch {
      toast.error('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this CV?')) return
    setDeletingId(id)
    try {
      await cvService.delete(id)
      setCVList(cvList.filter(c => c.id !== id))
      toast.success('CV deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-gray-900">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {cvList.length === 0
              ? "You haven't created any CVs yet. Start now!"
              : `You have ${cvList.length} CV${cvList.length > 1 ? 's' : ''}. Keep them updated!`
            }
          </p>
        </div>
        <button onClick={() => navigate('/cv/new')} className="btn-primary">
          <Plus size={16} />
          New CV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8 stagger">
        {[
          { label: 'Total CVs',    value: cvList.length,    icon: FileText,  color: 'var(--primary)' },
          { label: 'ATS Ready',    value: 0,                icon: Sparkles,  color: '#f59e0b' },
          { label: 'Last Updated', value: cvList.length ? formatDate(cvList[0]?.updatedAt || cvList[0]?.createdAt) : '—', icon: Clock, color: '#6366f1' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 animate-fade-up flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-display text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CV Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : cvList.length === 0 ? (
        <div className="card p-16 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
               style={{ background: 'var(--brand-soft)' }}>
            <FileText size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="font-display text-xl text-gray-800 mb-2">No CVs yet</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Create your first professional CV and get noticed by recruiters.
          </p>
          <button onClick={() => navigate('/cv/new')} className="btn-primary mx-auto">
            <Plus size={16} />
            Create my first CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              onClick={() => navigate(`/cv/${cv.id}/edit`)}
              className="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-up group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--brand-soft)' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/cv/${cv.id}/edit`) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(cv.id, e)}
                    disabled={deletingId === cv.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    {deletingId === cv.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />
                    }
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 truncate mb-1">{cv.title}</h3>
              {cv.fullName && <p className="text-sm text-gray-500 truncate">{cv.fullName}</p>}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {cv.skills?.slice(0, 2).map(s => (
                    <span key={s} className="badge text-xs">{s}</span>
                  ))}
                  {cv.skills?.length > 2 && (
                    <span className="badge">+{cv.skills.length - 2}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  {formatDate(cv.updatedAt || cv.createdAt)}
                </span>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <button
            onClick={() => navigate('/cv/new')}
            className="card p-5 border-dashed border-2 border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all duration-200 min-h-[160px] animate-fade-up"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Plus size={18} />
            </div>
            <span className="text-sm font-medium">New CV</span>
          </button>
        </div>
      )}
    </div>
  )
}
