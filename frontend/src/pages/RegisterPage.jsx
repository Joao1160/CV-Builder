import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, FileText, ArrowRight, Loader2, Check } from 'lucide-react'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const perks = [
  'ATS score & keyword analysis',
  'Professional CV templates',
  'PDF export in one click',
  'Real-time live preview',
]

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { login }     = useAuthStore()
  const navigate      = useNavigate()
  const password      = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.register({
        fullName: data.fullName,
        email:    data.email,
        password: data.password,
      })
      login(res.token, { fullName: res.fullName, email: res.email, userId: res.userId })
      toast.success(`Account created! Welcome, ${res.fullName.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — Brand panel */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 relative overflow-hidden"
           style={{ background: 'var(--brand-gradient)' }}>
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl text-white">CVBuilder</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-4xl text-white leading-snug">
            Start building<br />your future today
          </h1>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/40 text-xs">© 2024 CVBuilder. All rights reserved.</p>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md animate-fade-up">

          <div className="mb-8">
            <h2 className="font-display text-3xl text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-2 text-sm">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                placeholder="Ahmed Mohamed"
                className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.confirm ? 'border-red-400' : ''}`}
                {...register('confirm', {
                  required: 'Please confirm your password',
                  validate: v => v === password || 'Passwords do not match',
                })}
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <><span>Create account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
