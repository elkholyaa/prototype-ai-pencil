import React, { useState } from 'react'

interface QuestionsSectionProps {
  questions: { question: string; suggestions: string[] }[]
  selectedAnswers: string[]
  customAnswers: string[]
  isCustomAnswer: boolean[]
  onSelectAnswer: (qIndex: number, suggestion: string) => void
  onCustomAnswerChange: (qIndex: number, value: string) => void
  onToggleCustom: (qIndex: number, isCustom: boolean) => void
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  selectedAnswers,
  customAnswers,
  isCustomAnswer,
  onSelectAnswer,
  onCustomAnswerChange,
  onToggleCustom,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<boolean[]>(Array(questions.length).fill(false))

  const toggleQuestion = (index: number) => {
    const newExpandedQuestions = [...expandedQuestions]
    newExpandedQuestions[index] = !newExpandedQuestions[index]
    setExpandedQuestions(newExpandedQuestions)
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-sm font-medium text-gray-700">Questions</h2>
      </div>
      <div className="space-y-3">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-gray-50 rounded-lg border border-gray-100">
            <button
              onClick={() => toggleQuestion(qIndex)}
              className="w-full text-left p-3 flex justify-between items-center"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{q.question}</span>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedQuestions[qIndex] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedQuestions[qIndex] && (
              <div className="p-3 pt-0 space-y-2">
                {q.suggestions.map((suggestion, sIndex) => (
                  <button
                    key={sIndex}
                    onClick={() => {
                      onSelectAnswer(qIndex, suggestion)
                      onToggleCustom(qIndex, false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedAnswers[qIndex] === suggestion && !isCustomAnswer[qIndex]
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
                      onCustomAnswerChange(qIndex, e.target.value)
                      if (e.target.value) {
                        onToggleCustom(qIndex, true)
                        onSelectAnswer(qIndex, '')
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
    </section>
  )
}

export default QuestionsSection