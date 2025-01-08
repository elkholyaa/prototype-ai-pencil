'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/core'

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

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
  editable,
  className,
}: {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: formatContent(content),
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className || ''}`,
      },
    },
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const formattedContent = formatContent(content)
      if (formattedContent !== editor.getHTML()) {
        editor.commands.setContent(formattedContent)
      }
    }
  }, [content, editor])

  return (
    <div className="relative w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="mx-auto w-full overflow-hidden">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          id="rich-text-editor"
          name="rich-text-editor"
          className="w-full [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 
                     [&_.ProseMirror]:text-gray-900 [&_.ProseMirror_p]:my-1 
                     [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-0
                     [&_.ProseMirror:focus]:outline-none [&_.ProseMirror]:leading-relaxed"
        />
      </div>
    </div>
  )
}