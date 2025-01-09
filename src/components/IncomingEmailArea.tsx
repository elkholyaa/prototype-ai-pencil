'use client'

const formatContent = (content: string) => {
  // Convert markdown to HTML
  let html = content

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
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

interface IncomingEmailAreaProps {
  content: string
  className?: string
}

const IncomingEmailArea: React.FC<IncomingEmailAreaProps> = ({ content, className }) => {
  return (
    <div
      className={`prose prose-sm max-w-none ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  )
}

export default IncomingEmailArea