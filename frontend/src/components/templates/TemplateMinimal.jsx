export default function TemplateMinimal({ cv }) {
  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',Arial,sans-serif", background:'#fff', padding:'32px 36px', minHeight:'100%' }}>

      {/* Name + title */}
      <h1 style={{ fontSize:28, fontWeight:300, color:'#111827', letterSpacing:-0.5, marginBottom:4 }}>
        {cv.fullName || <span style={{color:'#d1d5db'}}>Your Name</span>}
      </h1>
      {cv.jobTitle && <p style={{ fontSize:12, color:'#6b7280', marginBottom:10, fontWeight:500 }}>{cv.jobTitle}</p>}

      {/* Contact bar */}
      <div style={{ borderTop:'2px solid #111827', borderBottom:'1px solid #e5e7eb', padding:'6px 0', marginBottom:20, display:'flex', flexWrap:'wrap', gap:'4px 18px' }}>
        {[cv.email, cv.phone, cv.location, cv.linkedIn, cv.website].filter(Boolean).map((v,i) => (
          <span key={i} style={{ fontSize:11, color:'#6b7280' }}>{v}</span>
        ))}
      </div>

      {cv.summary && <Sec title="Summary">
        <p style={{ fontSize:12.5, color:'#374151', lineHeight:1.75, maxWidth:'90%' }}>{cv.summary}</p>
      </Sec>}

      {cv.experiences?.length > 0 && <Sec title="Experience">
        {cv.experiences.map((exp,i) => (
          <div key={i} style={{ marginBottom:14, display:'grid', gridTemplateColumns:'1fr auto', gap:'0 16px' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827', marginBottom:1 }}>{exp.position}</p>
              <p style={{ fontSize:12, color:'#6b7280', marginBottom:4, fontStyle:'italic' }}>{exp.company}</p>
              {exp.description && <p style={{ fontSize:11.5, color:'#6b7280', lineHeight:1.65 }}>{exp.description}</p>}
            </div>
            <p style={{ fontSize:11, color:'#9ca3af', whiteSpace:'nowrap', textAlign:'right', paddingTop:2 }}>
              {exp.startDate}<br/>{exp.current ? 'Present' : exp.endDate}
            </p>
          </div>
        ))}
      </Sec>}

      {cv.educations?.length > 0 && <Sec title="Education">
        {cv.educations.map((edu,i) => (
          <div key={i} style={{ marginBottom:12, display:'grid', gridTemplateColumns:'1fr auto', gap:'0 16px' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{edu.degree}{edu.field && `, ${edu.field}`}</p>
              <p style={{ fontSize:12, color:'#6b7280', fontStyle:'italic' }}>{edu.institution}</p>
              {edu.grade && <p style={{ fontSize:11, color:'#9ca3af' }}>GPA: {edu.grade}</p>}
            </div>
            <p style={{ fontSize:11, color:'#9ca3af', whiteSpace:'nowrap', textAlign:'right' }}>
              {edu.startDate}<br/>{edu.endDate}
            </p>
          </div>
        ))}
      </Sec>}

      {cv.projects?.length > 0 && <Sec title="Projects">
        {cv.projects.map((proj,i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{proj.name}</p>
              {proj.url && <p style={{ fontSize:10, color:'#9ca3af' }}>{proj.url}</p>}
            </div>
            {proj.description && <p style={{ fontSize:11.5, color:'#6b7280', lineHeight:1.65, margin:'3px 0' }}>{proj.description}</p>}
            {proj.techs?.length > 0 && (
              <p style={{ fontSize:11, color:'#9ca3af' }}>{proj.techs.join(' · ')}</p>
            )}
          </div>
        ))}
      </Sec>}

      {(cv.technicalSkills?.length > 0 || cv.softSkills?.length > 0) && <Sec title="Skills">
        {cv.technicalSkills?.length > 0 && (
          <div style={{ marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em' }}>Technical — </span>
            <span style={{ fontSize:12.5, color:'#374151' }}>{cv.technicalSkills.join(' · ')}</span>
          </div>
        )}
        {cv.softSkills?.length > 0 && (
          <div>
            <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em' }}>Soft Skills — </span>
            <span style={{ fontSize:12.5, color:'#374151' }}>{cv.softSkills.join(' · ')}</span>
          </div>
        )}
      </Sec>}

      {cv.certifications?.length > 0 && <Sec title="Certifications">
        {cv.certifications.map((cert,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, paddingBottom:8, borderBottom:i<cv.certifications.length-1?'1px solid #f3f4f6':'none' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{cert.name}</p>
              <p style={{ fontSize:11.5, color:'#6b7280', fontStyle:'italic' }}>{cert.issuer}</p>
            </div>
            <p style={{ fontSize:11, color:'#9ca3af', whiteSpace:'nowrap', marginLeft:8 }}>{cert.date}</p>
          </div>
        ))}
      </Sec>}

      {cv.languages?.length > 0 && <Sec title="Languages">
        <p style={{ fontSize:12.5, color:'#374151' }}>
          {cv.languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(' · ')}
        </p>
      </Sec>}

      {cv.achievements?.filter(Boolean).length > 0 && <Sec title="Achievements">
        {cv.achievements.filter(Boolean).map((ach,i) => (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:5, fontSize:12, color:'#4b5563', lineHeight:1.65 }}>
            <span style={{ color:'#9ca3af', flexShrink:0 }}>—</span>{ach}
          </div>
        ))}
      </Sec>}

    </div>
  )
}

function Sec({ title, children }) {
  return (
    <section style={{ marginBottom:20 }}>
      <h2 style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.16em', color:'#9ca3af', marginBottom:10, paddingBottom:5, borderBottom:'1px solid #f3f4f6' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
