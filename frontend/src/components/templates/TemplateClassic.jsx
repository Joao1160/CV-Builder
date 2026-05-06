import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink } from 'lucide-react'

export default function TemplateClassic({ cv }) {
  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',Arial,sans-serif", background: '#fff', minHeight: '100%' }}>

      {/* Header — dark bar */}
      <div style={{ background: '#111827', padding: '22px 28px 18px' }}>
        {cv.fullName && (
          <h1 style={{ fontSize: 22, color: '#fff', fontWeight: 700, marginBottom: 3, letterSpacing: 0.3 }}>
            {cv.fullName}
          </h1>
        )}
        {cv.jobTitle && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontWeight: 400 }}>
            {cv.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px' }}>
          {[[Mail, cv.email],[Phone, cv.phone],[MapPin, cv.location],[Linkedin, cv.linkedIn],[Globe, cv.website]]
            .filter(([,v]) => v).map(([Icon, val], i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={10}/> {val}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {cv.summary && <Sec title="Summary">
          <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>{cv.summary}</p>
        </Sec>}

        {cv.experiences?.length > 0 && <Sec title="Work Experience">
          {cv.experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < cv.experiences.length-1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{exp.position}</p>
                  <p style={{ fontSize: 11.5, color: '#4b5563', fontWeight: 600 }}>{exp.company}</p>
                </div>
                <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p style={{ fontSize: 11.5, color: '#6b7280', marginTop: 5, lineHeight: 1.6 }}>{exp.description}</p>}
            </div>
          ))}
        </Sec>}

        {cv.educations?.length > 0 && <Sec title="Education">
          {cv.educations.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                <p style={{ fontSize: 11.5, color: '#4b5563' }}>{edu.institution}</p>
                {edu.grade && <p style={{ fontSize: 10, color: '#9ca3af' }}>GPA: {edu.grade}</p>}
              </div>
              <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: 8 }}>{edu.startDate} — {edu.endDate}</span>
            </div>
          ))}
        </Sec>}

        {cv.projects?.length > 0 && <Sec title="Projects">
          {cv.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                {proj.url && <ExternalLink size={11} style={{ color: '#9ca3af' }}/>}
              </div>
              {proj.description && <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.6, marginBottom: 4 }}>{proj.description}</p>}
              {proj.techs?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 6px' }}>
                  {proj.techs.map(t => <span key={t} style={{ fontSize: 10, background: '#f3f4f6', color: '#374151', padding: '1px 7px', borderRadius: 3, fontWeight: 600 }}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </Sec>}

        {(cv.technicalSkills?.length > 0 || cv.softSkills?.length > 0) && <Sec title="Skills">
          {cv.technicalSkills?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Technical</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 6px' }}>
                {cv.technicalSkills.map(s => <Pill key={s} label={s} bg="#f3f4f6" text="#111827"/>)}
              </div>
            </div>
          )}
          {cv.softSkills?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Soft Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 6px' }}>
                {cv.softSkills.map(s => <Pill key={s} label={s} bg="#f9fafb" text="#374151" border="1px solid #e5e7eb"/>)}
              </div>
            </div>
          )}
        </Sec>}

        {cv.certifications?.length > 0 && <Sec title="Certifications">
          {cv.certifications.map((cert, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, paddingBottom: 7, borderBottom: i < cv.certifications.length-1 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{cert.name}</p>
                <p style={{ fontSize: 11, color: '#4b5563' }}>{cert.issuer}</p>
              </div>
              <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: 8 }}>{cert.date}</span>
            </div>
          ))}
        </Sec>}

        {cv.languages?.length > 0 && <Sec title="Languages">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
            {cv.languages.map((lang, i) => (
              <span key={i} style={{ fontSize: 12, color: '#374151' }}>
                <strong>{lang.name}</strong>
                {lang.level && <span style={{ color: '#9ca3af' }}> — {lang.level}</span>}
              </span>
            ))}
          </div>
        </Sec>}

        {cv.achievements?.filter(Boolean).length > 0 && <Sec title="Achievements">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cv.achievements.filter(Boolean).map((ach, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 11.5, color: '#4b5563', lineHeight: 1.6 }}>
                <span style={{ color: '#111827', fontWeight: 700, flexShrink: 0 }}>▸</span>
                {ach}
              </li>
            ))}
          </ul>
        </Sec>}

      </div>
    </div>
  )
}

function Sec({ title, children }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#9ca3af', whiteSpace: 'nowrap' }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}/>
      </div>
      {children}
    </section>
  )
}

function Pill({ label, bg, text, border }) {
  return (
    <span style={{ background: bg, color: text, fontSize: 11, fontWeight: 500, padding: '2px 9px', borderRadius: 3, border: border || 'none' }}>
      {label}
    </span>
  )
}
