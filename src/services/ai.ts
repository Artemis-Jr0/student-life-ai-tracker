import { AIMessage } from '../types'

const USE_MOCK_AI = import.meta.env.VITE_USE_MOCK_AI !== 'false'
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY
const AI_API_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT

// Mock AI responses for demonstration
const mockResponses: Record<string, string[]> = {
  question: [
    "That's a great question! Based on best practices, I'd recommend breaking it down into smaller steps and tackling it systematically.",
    "Here's what I think: Focus on understanding the core concepts first, then practice applying them with examples.",
    "Interesting question! Try approaching this from a different angle - consider what fundamentals might be missing.",
  ],
  explanation: [
    "Let me explain this concept step by step: First, understand the basic principle. Think of it as... In practical terms, this means...",
    "This topic can be understood through an analogy. Imagine... This helps us understand why...",
    "The key to understanding this is to break it into parts. Part 1 deals with... Part 2 focuses on...",
  ],
  quiz: `Quiz Time! Here are some questions to test your understanding:

1. Multiple Choice: [Question 1]
   A) Option A
   B) Option B
   C) Option C
   D) Option D

2. Short Answer: [Question 2]

3. Essay: [Question 3]

Let me know your answers and I'll provide feedback!`,
  study_plan: `Here's your personalized study plan:

Week 1: Foundations
- Day 1-2: Introduction and basic concepts
- Day 3-4: Core principles
- Day 5: Review and practice questions

Week 2: Intermediate Topics
- Day 1-2: Advanced concepts
- Day 3-4: Problem solving
- Day 5: Integration and application

Week 3: Mastery
- Day 1-2: Complex scenarios
- Day 3-4: Real-world applications
- Day 5: Final review and assessment

Tips: Study during your peak hours, take breaks every 25 minutes, and review material daily.`,
  productivity_tip: [
    "💡 Tip: Use the Pomodoro Technique - study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.",
    "💡 Tip: Start with the most difficult task when your mind is fresh. Save easier tasks for when you're tired.",
    "💡 Tip: Create a dedicated study space free from distractions. Your brain will associate this space with focus.",
    "💡 Tip: Track your study habits for a week. You'll identify patterns and optimize your schedule accordingly.",
  ],
}

function getRandomMockResponse(type: string): string {
  const responses = mockResponses[type as keyof typeof mockResponses]
  if (Array.isArray(responses)) {
    return responses[Math.floor(Math.random() * responses.length)]
  }
  return responses || "I'm here to help! What would you like to know?"
}

// Real AI API call (placeholder - implement with your chosen provider)
async function callRealAI(message: string): Promise<string> {
  try {
    if (!AI_API_ENDPOINT) {
      throw new Error('AI API endpoint not configured')
    }

    const response = await fetch(AI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        message,
        model: 'gpt-3.5-turbo',
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response || data.choices?.[0]?.message?.content || 'Unable to get response from AI'
  } catch (error) {
    console.error('Error calling real AI:', error)
    // Fall back to mock AI
    return getRandomMockResponse('question')
  }
}

export async function generateAIResponse(message: string, type: AIMessage['type'] = 'question'): Promise<string> {
  if (USE_MOCK_AI) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    return getRandomMockResponse(type)
  }

  return callRealAI(message)
}

// Type-specific AI functions
export async function askQuestion(question: string): Promise<string> {
  return generateAIResponse(question, 'question')
}

export async function explainTopic(topic: string): Promise<string> {
  return generateAIResponse(`Please explain: ${topic}`, 'explanation')
}

export async function generateQuiz(subject: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
  return generateAIResponse(`Generate a ${difficulty} quiz about ${subject}`, 'quiz')
}

export async function createStudyPlan(goal: string, duration: string = '3 weeks'): Promise<string> {
  return generateAIResponse(`Create a ${duration} study plan for: ${goal}`, 'study_plan')
}

export async function getProductivityTip(): Promise<string> {
  return generateAIResponse('Give me a productivity tip', 'productivity_tip')
}
