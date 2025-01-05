'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RichTextEditor from '@/components/RichTextEditor'
import { SAMPLE_EMAIL } from '@/data/sampleEmail'
import { SAMPLE_KEY_POINTS } from '@/data/sampleKeyPoints'
import { SAMPLE_QUESTIONS } from '@/data/sampleQuestions'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
}

export default function Home() {
  // Format the email content as HTML
  const [email, setEmail] = useState(() => {
    return SAMPLE_EMAIL.body
      .split('\n') // Split by new lines
      .map((line) => {
        // Format bold text (e.g., **text**) as <strong>text</strong>
        return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      })
      .join(''); // Join lines back into a single HTML string
  });

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
    <div className="min-h-screen flex flex-col">
      {/* Email Input Section */}
      <div className="p-4 bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">📧 Incoming Email (Paste Your Email)</h2>
        <RichTextEditor
          content={email}
          onChange={setEmail}
          placeholder="Paste or type your email here..."
          editable={true}
          className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 h-48"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-4 flex items-center justify-center"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🛠️</span> Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>🧩</span> Analyze
            </span>
          )}
        </button>
      </div>

      {/* Key Points & Questions Section */}
      {showResults && (
        <div className="p-4 bg-gray-700 flex">
          {/* Key Points Column (Left) */}
          <div className="w-1/2 pr-2">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">🔍 Key Points</h2>
            <div className="space-y-4 overflow-y-auto h-64">
              {SAMPLE_KEY_POINTS.map((point, index) => (
                <div key={index} className="p-4 bg-gray-600 rounded-lg">
                  <p 
                    className="text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Questions Column (Right) */}
          <div className="w-1/2 pl-2">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">❓ Questions & Suggested Answers</h2>
            <div className="space-y-4 overflow-y-auto h-64">
              {SAMPLE_QUESTIONS.map((q, qIndex) => (
                <div key={qIndex} className="p-4 bg-gray-600 rounded-lg">
                  <p className="text-gray-200 font-semibold">{q.question}</p>
                  <div className="mt-2 space-y-2">
                    {q.suggestions.map((suggestion, sIndex) => (
                      <button
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
                        className={`w-full text-left p-2 rounded-lg transition-all ${
                          selectedAnswers[qIndex] === suggestion && !isCustomAnswer[qIndex]
                            ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-md'
                            : 'bg-gray-500 text-white border border-gray-400 hover:bg-gray-400'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
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
                      className="w-full p-2 bg-gray-500 text-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Reply Button */}
      {showResults && (
        <button
          onClick={generateReply}
          disabled={isGeneratingReply}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-4 flex items-center justify-center"
        >
          {isGeneratingReply ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🛠️</span> Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>✍️</span> Generate Reply
            </span>
          )}
        </button>
      )}

      {/* Reply Section */}
      {showResults && (
        <div className="p-4 bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">📝 Draft Reply</h2>
          <RichTextEditor
            content={reply}
            onChange={setReply}
            editable={true} // Make the reply editor editable
            placeholder="Your AI-generated reply will appear here..."
            className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 h-48"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigator.clipboard.writeText(reply)}
              className="w-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              📋 Copy Reply
            </button>
            <button
              onClick={() => alert('Reply sent!')}
              className="w-1/2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              ✉️ Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}