'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SAMPLE_EMAIL } from '@/data/sampleEmail'
import { SAMPLE_KEY_POINTS } from '@/data/sampleKeyPoints'
import { SAMPLE_QUESTIONS } from '@/data/sampleQuestions'
import IncomingEmailArea from '@/components/IncomingEmailArea'
import QuestionsSection from '@/components/QuestionsSection'
import KeyPointsSection from '@/components/KeyPointsSection'

const DraftEmailEditor = dynamic(() => import('@/components/DraftEmailEditor'), {
  ssr: false,
})

export default function HomePage() {
  const [email] = useState(SAMPLE_EMAIL.body)
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
      <style jsx>{`
        @keyframes write {
          0% { transform: translateX(-5px) rotate(-10deg); }
          50% { transform: translateX(5px) rotate(10deg); }
          100% { transform: translateX(-5px) rotate(-10deg); }
        }
        .animate-write {
          animation: write 1.5s infinite;
        }
      `}</style>

      {/* AI Pencil Title Section */}
      <div className="max-w-[1000px] mx-auto py-6 px-4">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Pencil
          </h1>
          <div className="flex justify-center mt-2">
            <span className="text-2xl animate-write">✍️</span>
          </div>
        </div>

        {/* Email Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <h2 className="text-sm font-medium text-gray-700">Incoming Email</h2>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 w-full">
              <IncomingEmailArea
                content={email}
                className="text-gray-700 leading-relaxed"
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
            <div className="grid grid-cols-2 gap-8 mt-6">
              {/* Key Points Container */}
              <div className="bg-white rounded-lg border-[4px] border-blue-500 shadow-2xl overflow-hidden">
                <div className="bg-blue-50 border-b-[3px] border-blue-500 px-4 py-2">
                  <h2 className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Key Points
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {SAMPLE_KEY_POINTS.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center"
                      >
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: point }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions Container */}
              <div className="bg-white rounded-lg border-[4px] border-purple-500 shadow-2xl overflow-hidden">
                <div className="bg-purple-50 border-b-[3px] border-purple-500 px-4 py-2">
                  <h2 className="text-sm font-medium text-purple-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Questions
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {SAMPLE_QUESTIONS.map((q, qIndex) => (
                      <div key={qIndex} className="bg-gray-50 rounded-lg border border-gray-200">
                        <button
                          onClick={() => {
                            const newIsCustom = [...isCustomAnswer]
                            newIsCustom[qIndex] = !newIsCustom[qIndex]
                            setIsCustomAnswer(newIsCustom)
                          }}
                          className="w-full text-left p-3 flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">{q.question}</span>
                          </div>
                          <svg className={`w-5 h-5 text-gray-500 transition-transform ${isCustomAnswer[qIndex] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isCustomAnswer[qIndex] && (
                          <div className="p-3 pt-0 space-y-2">
                            {q.suggestions.map((suggestion, sIndex) => (
                              <button
                                key={sIndex}
                                onClick={() => {
                                  const newAnswers = [...selectedAnswers]
                                  newAnswers[qIndex] = suggestion
                                  setSelectedAnswers(newAnswers)
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                  selectedAnswers[qIndex] === suggestion
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                            <div className="mt-3 pt-3 border-t border-gray-200">
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
                                    const newAnswers = [...selectedAnswers]
                                    newAnswers[qIndex] = ''
                                    setSelectedAnswers(newAnswers)
                                  }
                                }}
                                className="w-full px-3 py-2 text-sm bg-white text-gray-700 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReply}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-6"
            >
              <span>✍️</span>
              Generate Reply
            </button>

            {/* Reply Section */}
            {reply && (
              <section className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span>✏️</span>
                    <h2 className="text-sm font-medium text-gray-700">Draft Reply</h2>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <DraftEmailEditor
                    content={reply}
                    onChange={setReply}
                  />
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