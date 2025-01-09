'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

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

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children,
  title,
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  children: React.ReactNode,
  title?: string,
}) => (
  <button
    onClick={onClick}
    title={title}
    type="button"
    className={`p-1.5 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
  >
    {children}
  </button>
)

interface DraftEmailEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

const DraftEmailEditor: React.FC<DraftEmailEditorProps> = ({ content, onChange, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Type your reply here...',
      }),
    ],
    content: formatContent(content),
    onUpdate: ({ editor }) => {
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
      if (content !== editor.getHTML()) {
        editor.commands.setContent(formatContent(content))
      }
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 flex flex-wrap items-center gap-0.5">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8Z"/>
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z"/>
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2ZM4 20h16v2H4v-2Z"/>
          </svg>
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z"/>
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h3.25v1.5H4.75V13H3v-1h1v-.5H3v-1h2Zm0 7h3v1H4.75v1H6v1H3v-1h1v-1H3v-1Zm5 1h13v2H8v-2Zm0-7h13v2H8v-2Z"/>
          </svg>
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 4h18v2H3V4Zm0 15h14v2H3v-2Zm0-5h18v2H3v-2Zm0-5h14v2H3V9Z"/>
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 4h18v2H3V4Zm2 15h14v2H5v-2Zm-2-5h18v2H3v-2Zm2-5h14v2H5V9Z"/>
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 4h18v2H3V4Zm4 15h14v2H7v-2Zm-4-5h18v2H3v-2Zm4-5h14v2H7V9Z"/>
          </svg>
        </MenuButton>
      </div>

      <EditorContent 
        editor={editor}
        className="w-full [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 
                   [&_.ProseMirror]:text-gray-900 [&_.ProseMirror_p]:my-1 
                   [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-0
                   [&_.ProseMirror]:text-base [&_.ProseMirror]:leading-relaxed
                   [&_.ProseMirror:focus]:outline-none
                   [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-4
                   [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-4"
      />
    </div>
  )
}

export default DraftEmailEditor