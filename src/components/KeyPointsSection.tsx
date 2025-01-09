import React from 'react'
import { motion } from 'framer-motion'

const formatContent = (content: string) => {
  // Convert markdown to HTML
  let html = content

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  return html
}

interface KeyPointsSectionProps {
  keyPoints: string[]
}

const KeyPointsSection: React.FC<KeyPointsSectionProps> = ({ keyPoints }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-sm font-medium text-gray-700">Key Points</h2>
      </div>
      <div className="space-y-3">
        {keyPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center"
          >
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: formatContent(point) }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default KeyPointsSection