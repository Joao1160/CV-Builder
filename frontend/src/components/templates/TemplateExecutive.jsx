export default function TemplateExecutive({ cv }) {
  return (
    <div style={{ fontFamily:"'Segoe UI','Helvetica Neue',Arial,sans-serif", background:'#fff', minHeight:'100%' }}>

      {/* Top accent bar */}
      <div style={{ height:6, background:'#111827' }}/>

      {/* Header */}
      <div style={{ padding:'20px 28px 16px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#111827', letterSpacing:0.3, marginBottom:4 }}>
            {cv.fullName || 'Full Name'}
          </h1>
          {cv.jobTitle && <p style={{ fontSize:12, color:'#6b7280', fontWeight:500 }}>{cv.jobTitle}</p>}
        </div>
        <div style={{ textAlign:'right', fontSize:10.5, color:'#6b7280', lineHeight:1.9 }}>
          {cv.email    && <div><strong style={{color:'#111827'}}>Email:</strong> {cv.email}</div>}
          {cv.phone    && <div><strong style={{color:'#111827'}}>Phone:</strong> {cv.phone}</div>}
          {cv.location && <div><strong style={{color:'#111827'}}>Location:</strong> {cv.location}</div>}
          {cv.linkedIn && <div><strong style={{color:'#111827'}}>LinkedIn:</strong> {cv.linkedIn}</div>}
          {cv.website  && <div><strong style={{color:'#111827'}}>Web:</strong> {cv.website}</div>}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display:'flex' }}>

        {/* Left — main content */}
        <div style={{ flex:3, padding:'18px 20px 18px 28px', borderRight:'1px solid #f3f4f6' }}>

          {cv.summary && <Sec title="Profile">
            <p style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>{cv.summary}</p>
          </Sec>}

          {cv.experiences?.length > 0 && <Sec title="Experience">
            {cv.experiences.map((exp,i) => (
              <div key={i} style={{ marginBottom:13 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{exp.position}</p>
                    <p style={{ fontSize:11.5, color:'#4b5563', fontStyle:'italic' }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize:10, color:'#9ca3af', whiteSpace:'nowrap', marginLeft:8, paddingTop:2 }}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p style={{ fontSize:11.5, color:'#6b7280', marginTop:5, lineHeight:1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </Sec>}

          {cv.educations?.length > 0 && <Sec title="Education">
            {cv.educations.map((edu,i) => (
              <div key={i} style={{ marginBottom:10, display:'flex', justifyContent:'space-between' }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{edu.degree}{edu.field && `, ${edu.field}`}</p>
                  <p style={{ fontSize:11.5, color:'#4b5563', fontStyle:'italic' }}>{edu.institution}</p>
                  {edu.grade && <p style={{ fontSize:10, color:'#9ca3af' }}>GPA: {edu.grade}</p>}
                </div>
                <span style={{ fontSize:10, color:'#9ca3af', whiteSpace:'nowrap', marginLeft:8 }}>{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </Sec>}

          {cv.projects?.length > 0 && <Sec title="Projects">
            {cv.projects.map((proj,i) => (
              <div key={i} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{proj.name}</p>
                  {proj.url && <p style={{ fontSize:10, color:'#9ca3af' }}>{proj.url}</p>}
                </div>
                {proj.description && <p style={{ fontSize:11.5, color:'#6b7280', lineHeight:1.6, marginTop:3 }}>{proj.description}</p>}
                {proj.techs?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'3px 5px', marginTop:5 }}>
                    {proj.techs.map(t=><span key={t} style={{ fontSize:10, background:'#f3f4f6', color:'#374151', padding:'1px 7px', borderRadius:3, fontWeight:600 }}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </Sec>}

        </div>

        {/* Right — sidebar */}
        <div style={{ flex:2, padding:'18px 28px 18px 18px' }}>

          {cv.technicalSkills?.length > 0 && <Sec title="Technical Skills">
            {cv.technicalSkills.map(s => (
              <div key={s} style={{ marginBottom:7 }}>
                <p style={{ fontSize:11.5, color:'#374151', marginBottom:3 }}>{s}</p>
                <div style={{ height:4, background:'#f3f4f6', borderRadius:99 }}>
                  <div style={{ height:'100%', borderRadius:99, background:'#374151', width:'80%' }}/>
                </div>
              </div>
            ))}
          </Sec>}

          {cv.softSkills?.length > 0 && <Sec title="Soft Skills">
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 5px' }}>
              {cv.softSkills.map(s=>(
                <span key={s} style={{ fontSize:10, border:'1px solid #d1d5db', color:'#374151', padding:'2px 8px', borderRadius:3 }}>{s}</span>
              ))}
            </div>
          </Sec>}

          {cv.languages?.length > 0 && <Sec title="Languages">
            {cv.languages.map((lang,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'#111827' }}>{lang.name}</span>
                {lang.level && <span style={{ fontSize:10, color:'#9ca3af' }}>{lang.level}</span>}
              </div>
            ))}
          </Sec>}

          {cv.certifications?.length > 0 && <Sec title="Certifications">
            {cv.certifications.map((cert,i) => (
              <div key={i} style={{ marginBottom:9, paddingBottom:9, borderBottom:i<cv.certifications.length-1?'1px solid #f3f4f6':'none' }}>
                <p style={{ fontSize:12, fontWeight:700, color:'#111827' }}>{cert.name}</p>
                <p style={{ fontSize:11, color:'#6b7280' }}>{cert.issuer}</p>
                <p style={{ fontSize:10, color:'#9ca3af' }}>{cert.date}</p>
              </div>
            ))}
          </Sec>}

          {cv.achievements?.filter(Boolean).length > 0 && <Sec title="Achievements">
            {cv.achievements.filter(Boolean).map((ach,i) => (
              <div key={i} style={{ display:'flex', gap:7, marginBottom:6, fontSize:11, color:'#4b5563', lineHeight:1.6 }}>
                <span style={{ color:'#9ca3af', flexShrink:0 }}>✦</span>{ach}
              </div>
            ))}
          </Sec>}

        </div>
      </div>
    </div>
  )
}

function Sec({ title, children }) {
  return (
    <section style={{ marginBottom:16 }}>
      <h2 style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:'#9ca3af', marginBottom:9, paddingBottom:4, borderBottom:'1.5px solid #111827' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
