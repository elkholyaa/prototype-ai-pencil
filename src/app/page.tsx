'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RichTextEditor from '@/components/RichTextEditor'

// Sample data for demo
interface Email {
  from: string;
  to: string;
  date: string;
  subject: string;
  body: string;
}

const SAMPLE_EMAIL: Email = {
  from: "**From:** Jordan Lee <jordan.lee@company.com>",
  to: "**To:** Alex <alex@company.com>",
  date: "**Date:** Monday, February 27, 2023",
  subject: "**Subject:** Quick Update on the Project",
  body: `Hi Alex,

I hope you're doing well! It's been a busy week on our end, but I wanted to touch base on a few things regarding the **website redesign project**. I know you've been juggling a lot lately, so I appreciate you taking the time to look into this.

First, we're approaching the **March 15th deadline**, and I wanted to check in to see if we're still on track. If there are any hiccups, let's address them sooner rather than later—I'd hate for us to be scrambling at the last minute. Also, the finance team mentioned they're reviewing the **$12,500 budget** we proposed. Have you heard anything from them? I know budgets can be a bit of a headache, so I'm happy to help nudge things along if needed.

On another note, the client has been really enthusiastic about the progress so far, which is great! They've asked for a **mid-project review meeting**, and I was thinking **Wednesday, March 8th** might work. Let me know if that fits your schedule. Oh, and one last thing—we're running a bit lean on resources, so I was wondering if we could bring in **three more team members** starting **next Monday**. I know it's a bit of an ask, but it would really help us stay on track without burning out the current team.

Thanks so much for your help with all of this, Alex. I know it's a lot, but I really appreciate how proactive you've been throughout the project. Let me know if there's anything I can do to make things easier on your end!

Best regards,\nJordan Lee\nProject Manager`
}

const SAMPLE_KEY_POINTS = [
  '**Project Timeline**: Confirm if the project is on track for the **March 15th deadline**.',
  '**Budget Approval**: Check if the **$12,500 budget** has been approved by the finance team.',
  '**Resource Allocation**: Request **three additional team members** starting **next Monday** to avoid overworking the current team.',
  '**Client Feedback**: Schedule a **mid-project review meeting** with the client for **Wednesday, March 8th**.'
]

const SAMPLE_QUESTIONS = [
  {
    question: 'Are we on track to meet the March 15th deadline?',
    suggestions: [
      'Yes, we\'re on track to meet the deadline.',
      'We\'re slightly behind due to [reason], but we can catch up by [action].',
      'We\'ll need to adjust the deadline to [new date].',
    ],
  },
  {
    question: 'Has the finance team approved the $12,500 budget?',
    suggestions: [
      'Yes, the budget has been approved.',
      'No, the budget is still under review.',
      'The budget has been approved, but with some adjustments.',
    ],
  },
  {
    question: 'Can we allocate three more team members to the project starting next Monday?',
    suggestions: [
      'Yes, I\'ll arrange for the additional team members.',
      'No, but we can [alternative solution].',
      'Let\'s discuss this further in our next meeting.',
    ],
  },
  {
    question: 'Does Wednesday, March 8th work for the mid-project review meeting?',
    suggestions: [
      'Yes, that works for me.',
      'No, how about [alternative date]?',
      'Let me check my schedule and get back to you.',
    ],
  },
  {
    question: 'Is there anything else you need from me to help move things forward?',
    suggestions: [
      'No, everything looks good for now.',
      'Yes, I need [specific help].',
      'Let\'s touch base later this week to discuss further.',
    ],
  }
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
}

export default function Home() {
  const [email, setEmail] = useState(() => {
    const content = SAMPLE_EMAIL.body;
    return content.split(/\n\n/).map(paragraph => {
      // Handle signature part differently
      if (paragraph.includes('Best regards')) {
        return paragraph.split(/\n/).map(line => `<p>${line}</p>`).join('');
      }
      return `<p>${paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    }).join('');
  })
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* App Container */}
      <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white">✉️ ai-penci</h1>
          <p className="text-gray-200 mt-2">Your AI-powered email assistant</p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Rich Text Area for Incoming Email */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">📧 Paste Your Email</h2>
            <RichTextEditor
              content={email}
              onChange={setEmail}
              placeholder="Paste or type your email here..."
              editable={true}
              className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Generate Key Points Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8 flex items-center justify-center"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🛠️</span> Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>🧩</span> Generate Key Points
              </span>
            )}
          </button>

          {/* Key Points Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                {...fadeInUp}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-4">🔍 Key Points</h2>
                <div className="space-y-4">
                  {SAMPLE_KEY_POINTS.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-4 bg-gray-700 rounded-lg animate-fade-in"
                    >
                      <p 
                        className="text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions & Suggested Answers Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                {...fadeInUp}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-4">❓ Questions & Suggested Answers</h2>
                <div className="space-y-4">
                  {SAMPLE_QUESTIONS.map((q, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.2 }}
                      className="p-4 bg-gray-700 rounded-lg animate-fade-in"
                    >
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
                                : 'bg-gray-600 text-white border border-gray-500 hover:bg-gray-500'
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
                          className="w-full p-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Reply Button */}
          <button
            onClick={generateReply}
            disabled={isGeneratingReply}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8 flex items-center justify-center"
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

          {/* Reply Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                {...fadeInUp}
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-4">📝 Draft Reply</h2>
                <RichTextEditor
                  content={reply}
                  onChange={setReply}
                  editable={false}
                  placeholder="Your AI-generated reply will appear here..."
                  className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}