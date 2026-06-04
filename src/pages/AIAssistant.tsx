import React, { useState, useEffect } from 'react'
import { Send, Loader, Lightbulb, BookOpen, HelpCircle, Zap, CheckSquare } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import {
  askQuestion,
  explainTopic,
  generateQuiz,
  createStudyPlan,
  getProductivityTip,
} from '../services/ai'

type AIMode = 'question' | 'explanation' | 'quiz' | 'study_plan' | 'productivity'

function AIAssistant() {
  const [mode, setMode] = useState<AIMode>('question')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [showFullResponse, setShowFullResponse] = useState(false)

  const handleAskQuestion = async () => {
    if (!input.trim()) {
      setAlert({ type: 'error', title: 'Please enter a question' })
      return
    }

    setIsLoading(true)
    try {
      const result = await askQuestion(input)
      setResponse(result)
      setInput('')
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to get response from AI' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainTopic = async () => {
    if (!input.trim()) {
      setAlert({ type: 'error', title: 'Please enter a topic' })
      return
    }

    setIsLoading(true)
    try {
      const result = await explainTopic(input)
      setResponse(result)
      setInput('')
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to generate explanation' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!input.trim()) {
      setAlert({ type: 'error', title: 'Please enter a subject' })
      return
    }

    setIsLoading(true)
    try {
      const result = await generateQuiz(input, 'medium')
      setResponse(result)
      setInput('')
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to generate quiz' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStudyPlan = async () => {
    if (!input.trim()) {
      setAlert({ type: 'error', title: 'Please enter a goal' })
      return
    }

    setIsLoading(true)
    try {
      const result = await createStudyPlan(input)
      setResponse(result)
      setInput('')
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to create study plan' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetProductivityTip = async () => {
    setIsLoading(true)
    try {
      const result = await getProductivityTip()
      setResponse(result)
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to get productivity tip' })
    } finally {
      setIsLoading(false)
    }
  }

  const modeConfig = {
    question: {
      title: 'Ask a Question',
      description: 'Get instant answers to your academic questions',
      icon: <HelpCircle size={32} className="text-primary-600" />,
      placeholder: 'Ask anything about your studies...',
      action: handleAskQuestion,
      showInput: true,
    },
    explanation: {
      title: 'Explain a Topic',
      description: 'Get detailed explanations of complex concepts',
      icon: <BookOpen size={32} className="text-blue-600" />,
      placeholder: 'Enter a topic you want to understand better...',
      action: handleExplainTopic,
      showInput: true,
    },
    quiz: {
      title: 'Generate a Quiz',
      description: 'Test your knowledge with AI-generated quizzes',
      icon: <CheckSquare size={32} className="text-green-600" />,
      placeholder: 'Enter a subject...',
      action: handleGenerateQuiz,
      showInput: true,
    },
    study_plan: {
      title: 'Create a Study Plan',
      description: 'Get a personalized study plan for any goal',
      icon: <Zap size={32} className="text-yellow-600" />,
      placeholder: 'What do you want to study?',
      action: handleCreateStudyPlan,
      showInput: true,
    },
    productivity: {
      title: 'Productivity Tip',
      description: 'Get personalized productivity tips',
      icon: <Lightbulb size={32} className="text-orange-600" />,
      placeholder: '',
      action: handleGetProductivityTip,
      showInput: false,
    },
  }

  const currentConfig = modeConfig[mode]

  return (
    <PageTemplate title="AI Assistant" subtitle="Get help with your studies and productivity">
      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {Object.entries(modeConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => {
              setMode(key as AIMode)
              setResponse('')
              setInput('')
            }}
            className={`p-4 rounded-lg text-center transition-all ${
              mode === key
                ? 'bg-primary-100 border-2 border-primary-600 shadow-md'
                : 'bg-white border border-gray-200 hover:border-primary-300 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-center mb-2">{config.icon}</div>
            <p className={`text-sm font-semibold ${mode === key ? 'text-primary-600' : 'text-gray-700'}`}>
              {config.title}
            </p>
          </button>
        ))}
      </div>

      {/* AI Assistant Panel */}
      <Card className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentConfig.title}</h2>
          <p className="text-gray-600">{currentConfig.description}</p>
        </div>

        {/* Input Section */}
        {currentConfig.showInput && (
          <div className="mb-4 space-y-3">
            <Textarea
              placeholder={currentConfig.placeholder}
              rows={3}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={currentConfig.action}
              isLoading={isLoading}
              className="w-full"
            >
              <Send size={18} className="mr-2" />
              Submit
            </Button>
          </div>
        )}

        {mode === 'productivity' && !response && (
          <Button
            onClick={currentConfig.action}
            isLoading={isLoading}
            className="w-full"
          >
            <Lightbulb size={18} className="mr-2" />
            Get a Tip
          </Button>
        )}

        {/* Response Section */}
        {response && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Response:</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {showFullResponse ? response : response.substring(0, 500)}
              {response.length > 500 && !showFullResponse && '...'}
            </div>
            {response.length > 500 && (
              <Button
                variant="ghost"
                onClick={() => setShowFullResponse(!showFullResponse)}
                className="mt-4"
              >
                {showFullResponse ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-primary-600 mr-3" />
            <span className="text-gray-600">AI is thinking...</span>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Be specific with your questions for more accurate answers</li>
          <li>✓ Include context about your course or topic</li>
          <li>✓ Use "Generate a Quiz" after learning to test your knowledge</li>
          <li>✓ Create study plans for better organization</li>
          <li>✓ Get productivity tips daily to stay motivated</li>
        </ul>
      </div>
    </PageTemplate>
  )
}

export default AIAssistant
