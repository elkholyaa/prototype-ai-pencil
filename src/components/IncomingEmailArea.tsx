'use client'

const formatContent = (content: string) => {
  // First convert markdown to HTML
  let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Convert line breaks to paragraphs if content isn't already HTML
  if (!html.includes('</p>')) {
    html = html
      .split(/\n\s*\n/) // Split on empty lines
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }
  
  return html
}

export default function IncomingEmailArea({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div 
      className={`w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-auto
                  prose prose-sm max-w-none px-4 py-3 min-h-[400px] text-base leading-relaxed ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  )
} 