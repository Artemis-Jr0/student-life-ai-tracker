import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import { getGoals, addGoal, updateGoal, deleteGoal } from '../services/database'
import { Goal } from '../types'

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    targetDate: '',
    priority: 'medium' as const,
  })

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const allGoals = await getGoals()
      setGoals(allGoals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Error loading goals:', error)
    }
  }

  const handleAddGoal = async () => {
    if (!formData.title || !formData.targetDate) {
      setAlert({ type: 'error', title: 'Please fill in required fields' })
      return
    }

    try {
      await addGoal({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetDate: formData.targetDate,
        priority: formData.priority,
        progress: 0,
        status: 'not_started',
        milestones: [],
      })
      setAlert({ type: 'success', title: 'Goal added successfully!' })
      setFormData({
        title: '',
        description: '',
        category: 'Academic',
        targetDate: '',
        priority: 'medium',
      })
      setIsModalOpen(false)
      loadGoals()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to add goal' })
    }
  }

  const handleUpdateGoalStatus = async (goal: Goal, status: Goal['status']) => {
    try {
      await updateGoal(goal.id, { status })
      loadGoals()
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleUpdateProgress = async (goal: Goal, progress: number) => {
    try {
      const newStatus = progress === 100 ? 'completed' : goal.status === 'not_started' ? 'in_progress' : goal.status
      await updateGoal(goal.id, { progress, status: newStatus })
      loadGoals()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id)
      setAlert({ type: 'success', title: 'Goal deleted successfully!' })
      loadGoals()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to delete goal' })
    }
  }

  const statusBadgeColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'primary'
      case 'abandoned':
        return 'danger'
      default:
        return 'info'
    }
  }

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  } as const

  return (
    <PageTemplate
      title="Goals"
      subtitle="Set and track your academic and personal goals"
      action={<Button onClick={() => setIsModalOpen(true)}><Plus size={20} className="mr-2" />Add Goal</Button>}
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

      {/* Goals Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Total Goals</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{goals.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{goals.filter(g => g.status === 'in_progress').length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{goals.filter(g => g.status === 'completed').length}</p>
        </Card>
      </div>

      {/* Goals List */}
      <div>
        {goals.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No goals yet. Start by adding your first goal!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <Card key={goal.id}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{goal.title}</h3>
                      <Badge variant={priorityColors[goal.priority]} size="sm">
                        {goal.priority}
                      </Badge>
                      <Badge variant={statusBadgeColor(goal.status)} size="sm">
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {goal.description && <p className="text-gray-600 text-sm mb-3">{goal.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Progress Control */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={e => handleUpdateProgress(goal, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    {goal.status === 'completed' ? (
                      <button
                        onClick={() => handleUpdateGoalStatus(goal, 'in_progress')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateGoalStatus(goal, 'completed')}
                        className="text-gray-400 hover:text-green-600"
                      >
                        <Circle size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <p>Category: {goal.category}</p>
                  <p>Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Goal"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Goal Title *"
            placeholder="e.g., Complete React Course"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="What do you want to achieve?"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <Select
            label="Category"
            options={[
              { value: 'Academic', label: 'Academic' },
              { value: 'Personal', label: 'Personal' },
              { value: 'Career', label: 'Career' },
              { value: 'Health', label: 'Health' },
              { value: 'Financial', label: 'Financial' },
            ]}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            label="Target Date *"
            type="date"
            value={formData.targetDate}
            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
          />
          <Select
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            value={formData.priority}
            onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
          />
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default Goals
