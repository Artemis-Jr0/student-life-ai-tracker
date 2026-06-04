import Dexie, { Table } from 'dexie'
import { Task, ScheduleEvent, FinanceEntry, Budget, Goal, Habit, HabitLog, AIConversation, Milestone } from '../types'

export class StudentTrackerDB extends Dexie {
  tasks!: Table<Task>
  scheduleEvents!: Table<ScheduleEvent>
  financeEntries!: Table<FinanceEntry>
  budgets!: Table<Budget>
  goals!: Table<Goal>
  habits!: Table<Habit>
  habitLogs!: Table<HabitLog>
  aiConversations!: Table<AIConversation>

  constructor() {
    super('StudentTrackerDB')
    this.version(1).stores({
      tasks: '++id, dueDate, priority, category, completed',
      scheduleEvents: '++id, date, type',
      financeEntries: '++id, date, type, category',
      budgets: '++id, category, month',
      goals: '++id, status, priority, targetDate',
      habits: '++id, category, startDate',
      habitLogs: '++id, habitId, date',
      aiConversations: '++id, createdAt',
    })
  }
}

export const db = new StudentTrackerDB()

// Initialize database with default data
export async function initializeDatabase() {
  try {
    // Check if database already has data
    const taskCount = await db.tasks.count()
    if (taskCount > 0) {
      console.log('Database already initialized')
      return
    }

    // Add sample data for demonstration
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    // Sample tasks
    await db.tasks.bulkAdd([
      {
        id: '1',
        title: 'Complete React assignment',
        description: 'Build a todo app with React and TailwindCSS',
        dueDate: tomorrow,
        priority: 'high',
        completed: false,
        category: 'Assignment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Study for Math midterm',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        priority: 'high',
        completed: false,
        category: 'Study',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])

    // Sample schedule events
    await db.scheduleEvents.bulkAdd([
      {
        id: '1',
        title: 'Biology Lecture',
        startTime: '09:00',
        endTime: '10:30',
        date: today,
        type: 'class',
        location: 'Building A, Room 101',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])

    console.log('Database initialized with sample data')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Task operations
export async function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.tasks.add({
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getTasks(filter?: { completed?: boolean; category?: string }): Promise<Task[]> {
  let query = db.tasks.toCollection()
  if (filter?.completed !== undefined) {
    query = query.filter(t => t.completed === filter.completed)
  }
  if (filter?.category) {
    query = query.filter(t => t.category === filter.category)
  }
  return query.toArray()
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await db.tasks.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id)
}

// Schedule operations
export async function addScheduleEvent(event: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.scheduleEvents.add({
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getScheduleEvents(date?: string): Promise<ScheduleEvent[]> {
  if (date) {
    return db.scheduleEvents.where('date').equals(date).toArray()
  }
  return db.scheduleEvents.toArray()
}

export async function updateScheduleEvent(id: string, updates: Partial<ScheduleEvent>): Promise<void> {
  await db.scheduleEvents.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteScheduleEvent(id: string): Promise<void> {
  await db.scheduleEvents.delete(id)
}

// Finance operations
export async function addFinanceEntry(entry: Omit<FinanceEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.financeEntries.add({
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getFinanceEntries(filter?: { type?: 'income' | 'expense'; category?: string }): Promise<FinanceEntry[]> {
  let query = db.financeEntries.toCollection()
  if (filter?.type) {
    query = query.filter(e => e.type === filter.type)
  }
  if (filter?.category) {
    query = query.filter(e => e.category === filter.category)
  }
  return query.toArray()
}

export async function deleteFinanceEntry(id: string): Promise<void> {
  await db.financeEntries.delete(id)
}

// Goal operations
export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.goals.add({
    ...goal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getGoals(filter?: { status?: string; category?: string }): Promise<Goal[]> {
  let query = db.goals.toCollection()
  if (filter?.status) {
    query = query.filter(g => g.status === filter.status)
  }
  if (filter?.category) {
    query = query.filter(g => g.category === filter.category)
  }
  return query.toArray()
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  await db.goals.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteGoal(id: string): Promise<void> {
  await db.goals.delete(id)
}

// Habit operations
export async function addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.habits.add({
    ...habit,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getHabits(): Promise<Habit[]> {
  return db.habits.toArray()
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
  await db.habits.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteHabit(id: string): Promise<void> {
  await db.habits.delete(id)
}

// Habit Log operations
export async function logHabit(habitId: string, completed: boolean): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const existing = await db.habitLogs
    .where('habitId')
    .equals(habitId)
    .filter(log => log.date === today)
    .first()

  if (existing) {
    await db.habitLogs.update(existing.id, { completed })
    return existing.id
  }

  return db.habitLogs.add({
    id: Date.now().toString(),
    habitId,
    date: today,
    completed,
  })
}

export async function getHabitLogs(habitId: string, startDate?: string, endDate?: string): Promise<HabitLog[]> {
  let query = db.habitLogs.where('habitId').equals(habitId)
  if (startDate && endDate) {
    return query.filter(log => log.date >= startDate && log.date <= endDate).toArray()
  }
  return query.toArray()
}

// AI Conversation operations
export async function addAIConversation(conversation: Omit<AIConversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.aiConversations.add({
    ...conversation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getAIConversations(): Promise<AIConversation[]> {
  return db.aiConversations.toArray()
}

export async function updateAIConversation(id: string, updates: Partial<AIConversation>): Promise<void> {
  await db.aiConversations.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteAIConversation(id: string): Promise<void> {
  await db.aiConversations.delete(id)
}
