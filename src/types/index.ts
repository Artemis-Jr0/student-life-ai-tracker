// Task Types
export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  category: string
  createdAt: string
  updatedAt: string
}

// Schedule Types
export interface ScheduleEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  date: string
  type: 'class' | 'study' | 'break' | 'other'
  location?: string
  createdAt: string
  updatedAt: string
}

// Finance Types
export interface FinanceEntry {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

// Goal Types
export interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: string
  priority: 'low' | 'medium' | 'high'
  progress: number
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned'
  milestones: Milestone[]
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

// Habit Types
export interface Habit {
  id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  category: string
  color: string
  startDate: string
  streak: number
  longestStreak: number
  createdAt: string
  updatedAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
}

// AI Types
export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type: 'question' | 'explanation' | 'quiz' | 'study_plan' | 'productivity_tip'
}

export interface AIConversation {
  id: string
  title: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: boolean
  weekStartsOn: 'monday' | 'sunday'
  timeFormat: '12h' | '24h'
  useAI: boolean
}
