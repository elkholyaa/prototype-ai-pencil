'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SAMPLE_EMAIL } from '@/data/sampleEmail'
import { SAMPLE_KEY_POINTS } from '@/data/sampleKeyPoints'
import { SAMPLE_QUESTIONS } from '@/data/sampleQuestions'
import IncomingEmailArea from '@/components/IncomingEmailArea'
import KeyPointsSection from '@/components/KeyPointsSection'
import QuestionsSection from '@/components/QuestionsSection'

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
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Key Points Section */}
              <KeyPointsSection keyPoints={SAMPLE_KEY_POINTS} />

              {/* Questions Section */}
              <QuestionsSection
                questions={SAMPLE_QUESTIONS}
                selectedAnswers={selectedAnswers}
                customAnswers={customAnswers}
                isCustomAnswer={isCustomAnswer}
                onSelectAnswer={(qIndex, suggestion) => {
                  const newAnswers = [...selectedAnswers]
                  newAnswers[qIndex] = suggestion
                  setSelectedAnswers(newAnswers)
                  const newIsCustom = [...isCustomAnswer]
                  newIsCustom[qIndex] = false
                  setIsCustomAnswer(newIsCustom)
                }}
                onCustomAnswerChange={(qIndex, value) => {
                  const newCustomAnswers = [...customAnswers]
                  newCustomAnswers[qIndex] = value
                  setCustomAnswers(newCustomAnswers)
                  if (value) {
                    const newIsCustom = [...isCustomAnswer]
                    newIsCustom[qIndex] = true
                    setIsCustomAnswer(newIsCustom)
                  }
                }}
              />
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
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 w-full">
                    <DraftEmailEditor
                      content={reply}
                      onChange={setReply}
                      className="text-gray-700 leading-relaxed"
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