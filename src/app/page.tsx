'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SAMPLE_EMAIL } from '@/data/sampleEmail'
import { SAMPLE_KEY_POINTS } from '@/data/sampleKeyPoints'
import { SAMPLE_QUESTIONS } from '@/data/sampleQuestions'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
})

export default function Home() {
  const [email, setEmail] = useState(SAMPLE_EMAIL.body)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [customAnswers, setCustomAnswers] = useState<string[]>([])
  const [isCustomAnswer, setIsCustomAnswer] = useState<boolean[]>([])
  const [reply, setReply] = useState('')

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const generateReply = () => {
    const answers = SAMPLE_QUESTIONS.map((_, index) => {
      if (isCustomAnswer[index] && customAnswers[index]?.trim()) {
        return customAnswers[index].trim()
      }
      return selectedAnswers[index] || ''
    })

    const answeredQuestions = SAMPLE_QUESTIONS.map((q, i) => ({
      question: q.question,
      answer: answers[i]
    })).filter(qa => qa.answer)

    if (answeredQuestions.length > 0) {
      const newReply = `Hi,\n\nThank you for your email. Here's my response:\n\n${answeredQuestions.map(qa => 
        `Regarding ${qa.question.toLowerCase()}: **${qa.answer}**`
      ).join('\n\n')}\n\nBest regards,\nAlex`
      setReply(newReply)
    } else {
      setReply('Please provide at least one answer to generate a reply.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-[1000px] mx-auto py-8 px-4 space-y-6">
        {/* Email Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <h2 className="text-sm font-medium text-gray-700">Incoming Email</h2>
            </div>
            <span className="text-xs text-gray-400">(Paste email here)</span>
          </div>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 w-full">
              <RichTextEditor
                content={email}
                onChange={setEmail}
                placeholder="Paste your email here..."
                editable={true}
                className="text-black leading-relaxed"
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">🛠️</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze
                </>
              )}
            </button>
          </div>
        </section>

        {showResults && (
          <>
            <div className="grid grid-cols-2 gap-6">
              {/* Key Points */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span>🔍</span>
                  <h2 className="text-sm font-medium text-gray-700">Key Points</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                    {SAMPLE_KEY_POINTS.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="p-3 bg-gray-50 rounded"
                      >
                        <p 
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Questions */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span>❓</span>
                  <h2 className="text-sm font-medium text-gray-700">Questions</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {SAMPLE_QUESTIONS.map((q, qIndex) => (
                      <motion.div
                        key={qIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: qIndex * 0.05 }}
                        className="space-y-2"
                      >
                        <p className="text-sm font-medium text-gray-700">{q.question}</p>
                        <div className="space-y-2">
                          {q.suggestions.map((suggestion, sIndex) => (
                            <button
                              key={sIndex}
                              onClick={() => {
                                const newAnswers = [...selectedAnswers]
                                newAnswers[qIndex] = suggestion
                                setSelectedAnswers(newAnswers)
                                const newIsCustom = [...isCustomAnswer]
                                newIsCustom[qIndex] = false
                                setIsCustomAnswer(newIsCustom)
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                selectedAnswers[qIndex] === suggestion && !isCustomAnswer[qIndex]
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                          <input
                            type="text"
                            placeholder="Or type a custom answer..."
                            value={customAnswers[qIndex] || ''}
                            onChange={(e) => {
                              const newCustomAnswers = [...customAnswers]
                              newCustomAnswers[qIndex] = e.target.value
                              setCustomAnswers(newCustomAnswers)
                              if (e.target.value) {
                                const newIsCustom = [...isCustomAnswer]
                                newIsCustom[qIndex] = true
                                setIsCustomAnswer(newIsCustom)
                              }
                            }}
                            className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReply}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span>✍️</span>
              Generate Reply
            </button>

            {/* Reply Section */}
            {reply && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span>✏️</span>
                    <h2 className="text-sm font-medium text-gray-700">Draft Reply</h2>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 w-full">
                    <RichTextEditor
                      content={reply}
                      onChange={setReply}
                      editable={true}
                      placeholder="Generated reply will appear here..."
                      className="text-black leading-relaxed"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(reply)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <span>📋</span>
                    Copy
                  </button>
                  <button
                    onClick={() => alert('Reply sent!')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <span>✉️</span>
                    Send
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}