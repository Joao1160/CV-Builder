import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

/* ── Auth interceptor factory ── */
function withAuth(instance) {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
  return instance
}

/* ── Axios instances — كل service ليه baseURL منفصل ── */
const authApi = axios.create({ baseURL: '/api/auth' })   // → :8081
const cvApi   = withAuth(axios.create({ baseURL: '/api/cvs' }))  // → :8082
const atsApi  = withAuth(axios.create({ baseURL: '/api/ats' }))  // → :8083
const pdfApi  = withAuth(axios.create({ baseURL: '/api/pdf' }))  // → :8084

/* ── Auth Service ── */
export const authService = {
  register: (data) => authApi.post('/register', data).then(r => r.data),
  login:    (data) => authApi.post('/login',    data).then(r => r.data),
}

/* ── CV Service ── */
export const cvService = {
  getAll:  ()           => cvApi.get('').then(r => r.data),
  getById: (id)         => cvApi.get(`/${id}`).then(r => r.data),
  create:  (data)       => cvApi.post('', data).then(r => r.data),
  update:  (id, data)   => cvApi.put(`/${id}`, data).then(r => r.data),
  delete:  (id)         => cvApi.delete(`/${id}`).then(r => r.data),
}

/* ── ATS Service ── */
export const atsService = {
  analyze: (data) => atsApi.post('/analyze', data).then(r => r.data),
}

/* ── PDF Service ── */
export const pdfService = {
  download: async (cvData, template = 'classic') => {
    const res = await pdfApi.post('/generate', { ...cvData, template }, { responseType: 'blob' })
    const url  = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', `${cvData.fullName || 'CV'}_CV.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
