import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, FileText, ArrowRight, Loader2 } from 'lucide-react'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { login }     = useAuthStore()
  const navigate      = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.token, { fullName: res.fullName, email: res.email, userId: res.userId })
      toast.success(`Welcome back, ${res.fullName.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — Brand panel */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 relative overflow-hidden"
           style={{ background: 'var(--brand-gradient)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl text-white">CVBuilder</span>
          </div>
        </div>

        <div className="relative space-y-4">
          <h1 className="font-display text-4xl text-white leading-snug">
            Land your<br />dream job faster
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-xs">
            Build ATS-optimized CVs in minutes with professional templates and smart suggestions.
          </p>

          <div className="flex gap-6 pt-4">
            {[['500+', 'Templates'], ['98%', 'ATS Pass Rate'], ['10k+', 'Users']].map(([num, label]) => (
              <div key={label}>
                <p className="text-white font-display text-xl">{num}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">© 2024 CVBuilder. All rights reserved.</p>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md animate-fade-up">

          <div className="mb-8">
            <h2 className="font-display text-3xl text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to continue building your career</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', { required: 'Password is required' })}
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

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <><span>Sign in</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--primary)' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
