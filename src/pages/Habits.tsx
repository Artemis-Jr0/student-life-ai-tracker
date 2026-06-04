import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Flame } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import { getHabits, addHabit, updateHabit, deleteHabit, logHabit, getHabitLogs } from '../services/database'
import { Habit, HabitLog } from '../types'

function Habits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
    category: 'Productivity',
    color: 'blue',
  })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const allHabits = await getHabits()
      setHabits(allHabits)

      // Load habit logs
      const allLogs: HabitLog[] = []
      for (const habit of allHabits) {
        const logs = await getHabitLogs(habit.id)
        allLogs.push(...logs)
      }
      setHabitLogs(allLogs)
    } catch (error) {
      console.error('Error loading habits:', error)
    }
  }

  const handleAddHabit = async () => {
    if (!formData.title) {
      setAlert({ type: 'error', title: 'Please fill in required fields' })
      return
    }

    try {
      await addHabit({
        title: formData.title,
        description: formData.description,
        frequency: formData.frequency,
        category: formData.category,
        color: formData.color,
        startDate: new Date().toISOString().split('T')[0],
        streak: 0,
        longestStreak: 0,
      })
      setAlert({ type: 'success', title: 'Habit added successfully!' })
      setFormData({
        title: '',
        description: '',
        frequency: 'daily',
        category: 'Productivity',
        color: 'blue',
      })
      setIsModalOpen(false)
      loadHabits()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to add habit' })
    }
  }

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    try {
      await logHabit(habitId, !completed)
      loadHabits()
    } catch (error) {
      console.error('Error logging habit:', error)
    }
  }

  const handleDeleteHabit = async (id: string) => {
    try {
      await deleteHabit(id)
      setAlert({ type: 'success', title: 'Habit deleted successfully!' })
      loadHabits()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to delete habit' })
    }
  }

  const isTodayCompleted = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    return habitLogs.some(log => log.habitId === habitId && log.date === today && log.completed)
  }

  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
  }

  return (
    <PageTemplate
      title="Productivity Habits"
      subtitle="Build and track daily habits"
      action={<Button onClick={() => setIsModalOpen(true)}><Plus size={20} className="mr-2" />Add Habit</Button>}
    >
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

      {/* Habits Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Active Habits</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{habits.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Completed Today</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {habits.filter(h => isTodayCompleted(h.id)).length}/{habits.length}
          </p>
        </Card>
      </div>

      {/* Habits List */}
      <div>
        {habits.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No habits yet. Start building good habits!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => {
              const isCompleted = isTodayCompleted(habit.id)
              return (
                <Card key={habit.id} className={`${isCompleted ? 'border-green-300 bg-green-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleToggleHabit(habit.id, isCompleted)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                          }`}
                        >
                          <Flame size={20} />
                        </button>
                        <div>
                          <h3 className={`font-bold text-lg ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {habit.title}
                          </h3>
                          {habit.description && <p className="text-sm text-gray-600">{habit.description}</p>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Habit Info */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="primary" size="sm">
                      {habit.frequency}
                    </Badge>
                    <span className="text-xs text-gray-500">📊 Streak: {habit.streak} days</span>
                    <span className="text-xs text-gray-500">🔥 Best: {habit.longestStreak} days</span>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Habit"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit}>Add Habit</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Habit Name *"
            placeholder="e.g., Morning Exercise"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Why do you want to build this habit?"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <Select
            label="Frequency"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            value={formData.frequency}
            onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
          />
          <Select
            label="Category"
            options={[
              { value: 'Productivity', label: 'Productivity' },
              { value: 'Health', label: 'Health' },
              { value: 'Learning', label: 'Learning' },
              { value: 'Social', label: 'Social' },
              { value: 'Other', label: 'Other' },
            ]}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default Habits
