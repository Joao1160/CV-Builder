import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react'

export default function TemplateModern({ cv }) {
  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',Arial,sans-serif", display: 'flex', minHeight: '100%', background: '#fff' }}>

      {/* Sidebar */}
      <div style={{ width: 190, background: '#111827', padding: '28px 18px', flexShrink: 0 }}>

        {/* Avatar */}
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 700, margin: '0 auto 14px' }}>
          {cv.fullName?.[0]?.toUpperCase() || '?'}
        </div>
        <h1 style={{ fontSize: 14, color: '#fff', textAlign: 'center', lineHeight: 1.3, marginBottom: 4, fontWeight: 700 }}>
          {cv.fullName || 'Your Name'}
        </h1>
        {cv.jobTitle && <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 20 }}>{cv.jobTitle}</p>}

        {/* Contact */}
        <SideSec title="Contact">
          {[[Mail,cv.email],[Phone,cv.phone],[MapPin,cv.location],[Linkedin,cv.linkedIn],[Globe,cv.website]]
            .filter(([,v])=>v).map(([Icon,val],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:6, marginBottom:6 }}>
              <Icon size={10} style={{ color:'rgba(255,255,255,0.4)', marginTop:2, flexShrink:0 }}/>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', wordBreak:'break-all', lineHeight:1.5 }}>{val}</span>
            </div>
          ))}
        </SideSec>

        {/* Technical Skills */}
        {cv.technicalSkills?.length > 0 && <SideSec title="Technical Skills">
          {cv.technicalSkills.map(s => (
            <div key={s} style={{ marginBottom:6 }}>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>{s}</span>
              <div style={{ height:3, background:'rgba(255,255,255,0.1)', borderRadius:99, marginTop:3 }}>
                <div style={{ height:'100%', borderRadius:99, background:'rgba(255,255,255,0.5)', width:'75%' }}/>
              </div>
            </div>
          ))}
        </SideSec>}

        {/* Soft Skills */}
        {cv.softSkills?.length > 0 && <SideSec title="Soft Skills">
          <div style={{ display:'flex', flexWrap:'wrap', gap:'3px 4px' }}>
            {cv.softSkills.map(s => (
              <span key={s} style={{ fontSize:9, color:'rgba(255,255,255,0.65)', background:'rgba(255,255,255,0.08)', padding:'2px 7px', borderRadius:3 }}>{s}</span>
            ))}
          </div>
        </SideSec>}

        {/* Languages */}
        {cv.languages?.length > 0 && <SideSec title="Languages">
          {cv.languages.map((lang,i) => (
            <div key={i} style={{ marginBottom:6 }}>
              <p style={{ fontSize:10, color:'#fff', fontWeight:600 }}>{lang.name}</p>
              {lang.level && <p style={{ fontSize:9, color:'rgba(255,255,255,0.45)' }}>{lang.level}</p>}
            </div>
          ))}
        </SideSec>}

      </div>

      {/* Main */}
      <div style={{ flex:1, padding:'28px 22px', overflow:'hidden' }}>

        {cv.summary && <MainSec title="Summary">
          <p style={{ fontSize:12, color:'#4b5563', lineHeight:1.7 }}>{cv.summary}</p>
        </MainSec>}

        {cv.experiences?.length > 0 && <MainSec title="Experience">
          {cv.experiences.map((exp,i) => (
            <div key={i} style={{ marginBottom:13, paddingLeft:10, borderLeft:'2px solid #e5e7eb' }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:4 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{exp.position}</p>
                  <p style={{ fontSize:11.5, color:'#6b7280', fontWeight:600 }}>{exp.company}</p>
                </div>
                <span style={{ fontSize:10, color:'#9ca3af', background:'#f9fafb', padding:'2px 8px', borderRadius:3, height:'fit-content' }}>
                  {exp.startDate} – {exp.current ? 'Now' : exp.endDate}
                </span>
              </div>
              {exp.description && <p style={{ fontSize:11.5, color:'#6b7280', marginTop:5, lineHeight:1.6 }}>{exp.description}</p>}
            </div>
          ))}
        </MainSec>}

        {cv.educations?.length > 0 && <MainSec title="Education">
          {cv.educations.map((edu,i) => (
            <div key={i} style={{ marginBottom:12, paddingLeft:10, borderLeft:'2px solid #e5e7eb' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{edu.degree}{edu.field && ` · ${edu.field}`}</p>
              <p style={{ fontSize:11.5, color:'#6b7280' }}>{edu.institution}</p>
              <p style={{ fontSize:10, color:'#9ca3af' }}>{edu.startDate} – {edu.endDate}{edu.grade && ` · GPA ${edu.grade}`}</p>
            </div>
          ))}
        </MainSec>}

        {cv.projects?.length > 0 && <MainSec title="Projects">
          {cv.projects.map((proj,i) => (
            <div key={i} style={{ marginBottom:12, paddingLeft:10, borderLeft:'2px solid #e5e7eb' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{proj.name}</p>
              {proj.url && <p style={{ fontSize:10, color:'#9ca3af' }}>{proj.url}</p>}
              {proj.description && <p style={{ fontSize:11.5, color:'#6b7280', marginTop:4, lineHeight:1.6 }}>{proj.description}</p>}
              {proj.techs?.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'3px 5px', marginTop:4 }}>
                  {proj.techs.map(t=><span key={t} style={{ fontSize:10, background:'#f3f4f6', color:'#374151', padding:'1px 7px', borderRadius:3, fontWeight:600 }}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </MainSec>}

        {cv.certifications?.length > 0 && <MainSec title="Certifications">
          {cv.certifications.map((cert,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:7, paddingBottom:7, borderBottom: i<cv.certifications.length-1?'1px solid #f3f4f6':'none' }}>
              <div>
                <p style={{ fontSize:12.5, fontWeight:700, color:'#111827' }}>{cert.name}</p>
                <p style={{ fontSize:11, color:'#6b7280' }}>{cert.issuer}</p>
              </div>
              <span style={{ fontSize:10, color:'#9ca3af', whiteSpace:'nowrap', marginLeft:8 }}>{cert.date}</span>
            </div>
          ))}
        </MainSec>}

        {cv.achievements?.filter(Boolean).length > 0 && <MainSec title="Achievements">
          {cv.achievements.filter(Boolean).map((ach,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:5, fontSize:11.5, color:'#4b5563', lineHeight:1.6 }}>
              <span style={{ color:'#111827', fontWeight:700, flexShrink:0 }}>▸</span>{ach}
            </div>
          ))}
        </MainSec>}

      </div>
    </div>
  )
}

function SideSec({ title, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <p style={{ fontSize:8, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(255,255,255,0.35)', marginBottom:8, borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:4 }}>
        {title}
      </p>
      {children}
    </div>
  )
}
function MainSec({ title, children }) {
  return (
    <section style={{ marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <h2 style={{ fontSize:9, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.12em', whiteSpace:'nowrap' }}>{title}</h2>
        <div style={{ flex:1, height:1, background:'#e5e7eb' }}/>
      </div>
      {children}
    </section>
  )
}
