import { useCVStore } from '@/store/cvStore'
import TemplateClassic   from '@/components/templates/TemplateClassic'
import TemplateModern    from '@/components/templates/TemplateModern'
import TemplateMinimal   from '@/components/templates/TemplateMinimal'
import TemplateExecutive from '@/components/templates/TemplateExecutive'

const TEMPLATES = {
  classic:   TemplateClassic,
  modern:    TemplateModern,
  minimal:   TemplateMinimal,
  executive: TemplateExecutive,
}

export default function CVPreview({ template = 'classic' }) {
  const { currentCV: cv } = useCVStore()
  if (!cv) return null
  const Template = TEMPLATES[template] || TemplateClassic
  const hasContent = cv.fullName || cv.email || cv.summary

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md max-w-2xl mx-auto overflow-hidden">
        {hasContent
          ? <Template cv={cv}/>
          : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <p className="text-sm">Fill in the form to see your CV preview</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
