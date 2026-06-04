import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Calendar, Wallet, Target, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import { getTasks, getScheduleEvents, getFinanceEntries, getGoals, getHabits } from '../services/database'
import { Task, ScheduleEvent, FinanceEntry, Goal, Habit } from '../types'

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    totalExpense: 0,
    totalIncome: 0,
    activeGoals: 0,
    activeHabits: 0,
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [upcomingSchedule, setUpcomingSchedule] = useState<ScheduleEvent[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const tasks = await getTasks()
      const events = await getScheduleEvents()
      const finances = await getFinanceEntries()
      const goals = await getGoals()
      const habits = await getHabits()

      const today = new Date().toISOString().split('T')[0]
      const upcomingEvents = events.filter(e => e.date >= today).slice(0, 5)
      const todaysTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) <= new Date()).slice(0, 5)

      const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
      const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        upcomingEvents: upcomingEvents.length,
        totalExpense,
        totalIncome,
        activeGoals: goals.filter(g => g.status === 'in_progress').length,
        activeHabits: habits.length,
      })

      setRecentTasks(todaysTasks)
      setUpcomingSchedule(upcomingEvents)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <PageTemplate title="Dashboard" subtitle="Welcome back! Here's your overview">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Tasks"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          icon={<BarChart3 size={28} />}
          trend={{ value: Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100), direction: 'up' }}
        />
        <StatCard
          label="Balance"
          value={`₦${(stats.totalIncome - stats.totalExpense).toLocaleString()}`}
          icon={<Wallet size={28} />}
          trend={{ value: 5, direction: 'up' }}
        />
        <StatCard
          label="Active Goals"
          value={stats.activeGoals}
          icon={<Target size={28} />}
        />
        <StatCard
          label="Habits"
          value={stats.activeHabits}
          icon={<Flame size={28} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Tasks</h2>
          {recentTasks.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-6">No urgent tasks today! 🎉</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentTasks.map(task => (
                <Card key={task.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </Card>
              ))}
              <Link to="/tasks">
                <Button variant="secondary" className="w-full">View All Tasks</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          {upcomingSchedule.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-6">No upcoming events</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingSchedule.map(event => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-primary-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(event.date).toLocaleDateString()} {event.startTime}
                      </p>
                      {event.location && <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>}
                    </div>
                  </div>
                </Card>
              ))}
              <Link to="/schedule">
                <Button variant="secondary" className="w-full">View Schedule</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/tasks">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <BarChart3 className="text-primary-600 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900">Manage Tasks</h3>
            <p className="text-sm text-gray-600 mt-1">Create and track your study tasks</p>
          </Card>
        </Link>
        <Link to="/finance">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Wallet className="text-green-600 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900">Track Finance</h3>
            <p className="text-sm text-gray-600 mt-1">Monitor your expenses and budget</p>
          </Card>
        </Link>
        <Link to="/ai">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <TrendingUp className="text-orange-600 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
            <p className="text-sm text-gray-600 mt-1">Get help with your studies</p>
          </Card>
        </Link>
      </div>

      {/* Motivational Section */}
      <Card className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200">
        <h3 className="text-lg font-bold text-primary-900 mb-2">Keep Learning 🚀</h3>
        <p className="text-primary-800 mb-4">
          Consistency is the key to success. Use this app to organize your studies, track your progress, and stay motivated.
        </p>
        <Button size="sm">Start Learning Now</Button>
      </Card>
    </PageTemplate>
  )
}

export default Dashboard
