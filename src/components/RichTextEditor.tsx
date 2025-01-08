'use client'

export default function IncomingEmailArea({
  content,
  onChange,
  className,
}: {
  content: string
  onChange: (content: string) => void
  className?: string
}) {
  return (
    <textarea 
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-gray-200 bg-white shadow-sm 
                 px-4 py-3 min-h-[180px] resize-none focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent ${className || ''}`}
      placeholder="Paste or type email content here..."
    />
  )
}