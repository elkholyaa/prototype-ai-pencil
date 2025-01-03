import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import { type Editor } from '@tiptap/core'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex gap-2 p-2 border-b border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <span className="underline">U</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        •
      </button>
    </div>
  )
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  editable = true,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-2',
        'data-placeholder': placeholder,
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    immediatelyRender: false,
  })

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!isMounted) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white animate-pulse">
        <div className="h-[250px]"></div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
} 