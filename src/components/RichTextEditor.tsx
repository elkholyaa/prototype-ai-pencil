import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import { type Editor } from '@tiptap/core';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string; // Add className prop
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 p-2 border-b border-gray-600 bg-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-600 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        title="Bold"
      >
        <span className="font-bold text-white">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-600 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        title="Italic"
      >
        <span className="italic text-white">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-600 transition-colors ${
          editor.isActive('underline') ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        title="Underline"
      >
        <span className="underline text-white">U</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-600 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        title="Bullet List"
      >
        <span className="text-white">•</span>
      </button>
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  className = '', // Default to empty string
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none focus:outline-none min-h-[200px] px-4 py-2 ${
          editable ? 'text-white' : 'text-gray-300'
        }`,
        'data-placeholder': placeholder,
      },
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!isMounted) {
    return (
      <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700 animate-pulse">
        <div className="h-[250px]"></div>
      </div>
    );
  }

  return (
    <div
      className={`border border-gray-600 rounded-lg overflow-hidden bg-gray-700 shadow-sm hover:shadow transition-shadow ${className}`}
    >
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}