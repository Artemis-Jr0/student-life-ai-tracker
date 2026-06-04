import React, { useState, useEffect } from 'react'
import { CheckCircle, Circle, Trash2, Plus } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import { getTasks, addTask, updateTask, deleteTask } from '../services/database'
import { Task } from '../types'

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    category: 'Assignment',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const allTasks = await getTasks()
      setTasks(allTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const handleAddTask = async () => {
    if (!formData.title || !formData.dueDate) {
      setAlert({ type: 'error', title: 'Please fill in required fields' })
      return
    }

    try {
      await addTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        completed: false,
      })
      setAlert({ type: 'success', title: 'Task added successfully!' })
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'Assignment',
      })
      setIsModalOpen(false)
      loadTasks()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to add task' })
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed })
      loadTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      setAlert({ type: 'success', title: 'Task deleted successfully!' })
      loadTasks()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to delete task' })
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed)
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed)

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  } as const

  return (
    <PageTemplate
      title="Study Tasks"
      subtitle="Manage your assignments and study tasks"
      action={<Button onClick={() => setIsModalOpen(true)}><Plus size={20} className="mr-2" />Add Task</Button>}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Total Tasks</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{tasks.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedCount}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">High Priority</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{highPriorityTasks.length}</p>
        </Card>
      </div>

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Tasks</h2>
        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-8">No pending tasks! Great job! 🎉</p>
            </Card>
          ) : (
            pendingTasks.map(task => (
              <Card key={task.id} className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="flex-shrink-0 text-gray-400 hover:text-primary-600 transition-colors mt-1"
                >
                  <Circle size={24} />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <Badge variant={priorityColors[task.priority]} size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && <p className="text-gray-600 text-sm mb-2">{task.description}</p>}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{task.category}</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedCount > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Completed Tasks</h2>
          <div className="space-y-3">
            {tasks.filter(t => t.completed).map(task => (
              <Card key={task.id} className="flex items-start gap-4 opacity-75">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="flex-shrink-0 text-green-600 hover:text-green-700 transition-colors mt-1"
                >
                  <CheckCircle size={24} />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-through">{task.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Task"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="Enter task title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Due Date *"
            type="date"
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
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
          <Select
            label="Category"
            options={[
              { value: 'Assignment', label: 'Assignment' },
              { value: 'Study', label: 'Study' },
              { value: 'Project', label: 'Project' },
              { value: 'Reading', label: 'Reading' },
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

export default Tasks
