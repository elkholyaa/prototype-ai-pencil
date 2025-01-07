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
    extensions: [
      StarterKit,
    ],
    content: formatContent(content),
    editable,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm focus:outline-none w-full min-h-[100px] ${className || ''}`,
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
    <div className="w-full [&_.ProseMirror]:w-full [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:p-0">
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}