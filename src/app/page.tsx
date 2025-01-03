'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RichTextEditor from '@/components/RichTextEditor'

// Sample data for demo
const SAMPLE_EMAIL = `Hi, let's discuss the project timeline and budget. The deadline is next Friday, and we need approval for the $10,000 budget.`

const SAMPLE_KEY_POINTS = [
  'Discuss project timeline',
  'Budget approval required',
]

const SAMPLE_QUESTIONS = [
  {
    question: 'What is the expected project deadline?',
    suggestions: [
      'The deadline is next Friday.',
      'We are targeting the end of this month.',
      'The timeline is still being finalized.',
    ],
  },
  {
    question: 'Has the budget been approved?',
    suggestions: [
      'Yes, the budget has been approved.',
      'No, we are still waiting for approval.',
      'The budget is under review.',
    ],
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
}

export default function Home() {
  const [email, setEmail] = useState(SAMPLE_EMAIL)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [customAnswers, setCustomAnswers] = useState<string[]>([])
  const [isCustomAnswer, setIsCustomAnswer] = useState<boolean[]>([])
  const [reply, setReply] = useState('')

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Reset states
    setSelectedAnswers([])
    setCustomAnswers([])
    setIsCustomAnswer([])
    setReply('')
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const generateReply = () => {
    console.log('Generating reply...')
    setIsGeneratingReply(true)
    
    // Get all answers (either custom or selected)
    const answers = SAMPLE_QUESTIONS.map((_, index) => {
      if (isCustomAnswer[index] && customAnswers[index]?.trim()) {
        return customAnswers[index].trim()
      }
      return selectedAnswers[index] || ''
    })
    console.log('Answers:', answers)

    // Get answered questions
    const answeredQuestions = SAMPLE_QUESTIONS.map((q, i) => ({
      question: q.question,
      answer: answers[i]
    })).filter(qa => qa.answer)
    console.log('Answered questions:', answeredQuestions)

    // Simulate AI processing
    setTimeout(() => {
      if (answeredQuestions.length > 0) {
        const newReply = `<p>Thank you for your email. Here's my response:</p>
${answeredQuestions.map(qa => `<p>Regarding ${qa.question.toLowerCase()}: ${qa.answer}</p>`).join('')}
<p>Best regards</p>`
        console.log('Generated reply:', newReply)
        setReply(newReply)
      } else {
        const errorReply = '<p>Please provide at least one answer to generate a reply.</p>'
        console.log('Error reply:', errorReply)
        setReply(errorReply)
      }
      setIsGeneratingReply(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          AI-Pencil <span className="text-blue-600 inline-block hover:scale-110 transition-transform">✍️</span>
        </h1>
        <p className="text-gray-600">Your AI-powered email assistant</p>
      </motion.header>

      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          Incoming Email <span className="text-gray-400 hover:scale-110 transition-transform">📧</span>
        </h2>
        <RichTextEditor
          content={email}
          onChange={setEmail}
          placeholder="Paste or type your email here..."
        />
        <motion.button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 hover:shadow-lg"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">🤖</span> Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🔍</span> Analyze Email
            </span>
          )}
        </motion.button>
      </motion.section>

      <AnimatePresence mode="wait">
        {showResults && (
          <motion.div
            {...fadeInUp}
            className="space-y-8"
          >
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Key Points <span className="text-gray-400 hover:scale-110 transition-transform">🔍</span>
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {SAMPLE_KEY_POINTS.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="hover:text-blue-600 transition-colors cursor-default"
                  >
                    {point}
                  </motion.li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Questions <span className="text-gray-400 hover:scale-110 transition-transform">❓</span>
              </h2>
              <div className="space-y-6">
                {SAMPLE_QUESTIONS.map((q, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.2 }}
                    className="space-y-2"
                  >
                    <p className="font-medium">{q.question}</p>
                    <div className="grid gap-2">
                      {q.suggestions.map((suggestion, sIndex) => (
                        <motion.button
                          key={sIndex}
                          onClick={() => {
                            const newAnswers = [...selectedAnswers]
                            newAnswers[qIndex] = suggestion
                            setSelectedAnswers(newAnswers)
                            // Reset custom answer when selecting a suggestion
                            const newIsCustom = [...isCustomAnswer]
                            newIsCustom[qIndex] = false
                            setIsCustomAnswer(newIsCustom)
                          }}
                          className={`p-3 text-left border rounded-lg transition-all ${
                            selectedAnswers[qIndex] === suggestion && !isCustomAnswer[qIndex]
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Or type your custom answer..."
                          value={customAnswers[qIndex] || ''}
                          onChange={(e) => {
                            const newCustomAnswers = [...customAnswers]
                            newCustomAnswers[qIndex] = e.target.value
                            setCustomAnswers(newCustomAnswers)
                            // Mark as custom answer when typing
                            if (e.target.value) {
                              const newIsCustom = [...isCustomAnswer]
                              newIsCustom[qIndex] = true
                              setIsCustomAnswer(newIsCustom)
                            }
                          }}
                          className={`w-full p-3 border rounded-lg transition-all outline-none ${
                            isCustomAnswer[qIndex]
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  Generated Reply <span className="text-gray-400 hover:scale-110 transition-transform">✉️</span>
                </h2>
                <motion.button
                  onClick={generateReply}
                  disabled={isGeneratingReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 hover:shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isGeneratingReply ? (
                    <>
                      <span className="animate-spin">🤖</span>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Generate Reply</span>
                    </>
                  )}
                </motion.button>
              </div>
              <div className="relative">
                <RichTextEditor
                  content={reply}
                  onChange={setReply}
                  editable={false}
                  placeholder="Click 'Generate Reply' after selecting or typing your answers..."
                />
                {reply && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(reply.replace(/<[^>]*>/g, ''))
                        // You could add a toast notification here
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
