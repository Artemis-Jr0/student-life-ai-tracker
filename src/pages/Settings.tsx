import React, { useState } from 'react'
import { Moon, Sun, Globe, Bell, Code, Github, Mail, Trash2 } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Select from '../components/Select'
import Alert from '../components/Alert'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'

function Settings() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto')
  const [language, setLanguage] = useLocalStorage('language', 'en')
  const [notifications, setNotifications] = useLocalStorage('notifications', true)
  const [timeFormat, setTimeFormat] = useLocalStorage<'12h' | '24h'>('timeFormat', '12h')
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleClearData = () => {
    try {
      localStorage.clear()
      setAlert({ type: 'success', title: 'All data cleared successfully!' })
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to clear data' })
    }
  }

  const handleExportData = () => {
    try {
      const data = {
        theme,
        language,
        notifications,
        timeFormat,
        timestamp: new Date().toISOString(),
      }
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `student-life-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      setAlert({ type: 'success', title: 'Data exported successfully!' })
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to export data' })
    }
  }

  return (
    <PageTemplate title="Settings" subtitle="Customize your experience">
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

      {/* Display Settings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Display</h2>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Moon size={18} />
                  Theme
                </h3>
                <p className="text-sm text-gray-600 mt-1">Choose your preferred color scheme</p>
              </div>
              <Select
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' },
                ]}
                value={theme}
                onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Globe size={18} />
                  Language
                </h3>
                <p className="text-sm text-gray-600 mt-1">Select your preferred language</p>
              </div>
              <Select
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' },
                ]}
                value={language}
                onChange={e => setLanguage(e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sun size={18} />
                  Time Format
                </h3>
                <p className="text-sm text-gray-600 mt-1">Choose how times are displayed</p>
              </div>
              <Select
                options={[
                  { value: '12h', label: '12-hour' },
                  { value: '24h', label: '24-hour' },
                ]}
                value={timeFormat}
                onChange={e => setTimeFormat(e.target.value as '12h' | '24h')}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell size={18} />
                Enable Notifications
              </h3>
              <p className="text-sm text-gray-600 mt-1">Receive notifications for tasks and events</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={notifications as boolean}
                onChange={e => setNotifications(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-full h-full rounded-full transition-colors ${
                notifications ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notifications ? 'transform translate-x-6' : ''
              }`} />
            </label>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Management</h2>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-600 mt-1">Download a backup of your settings</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportData}>
                Export
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Trash2 size={18} className="text-red-600" />
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-600 mt-1">Delete all your data from this device</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                Clear
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Student Life AI Tracker</h3>
              <p className="text-sm text-gray-600 mt-1">Version 1.0.0</p>
            </div>
            <p className="text-sm text-gray-700">
              A fully responsive, mobile-first web application designed to help students organize and improve their daily lives by tracking study tasks, assignments, schedules, finances, goals, and productivity habits.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Artemis-Jr0/student-life-ai-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github size={18} />
                View Source
              </a>
              <a
                href="mailto:support@studentlifeai.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Mail size={18} />
                Contact Support
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Developer Info */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="flex items-start gap-3">
          <Code size={24} className="text-gray-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">Built with Modern Tech</h3>
            <p className="text-sm text-gray-600 mt-2">
              React • TypeScript • TailwindCSS • Vite • IndexedDB
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Made with ❤️ for students by students • Open Source • MIT License
            </p>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Clear All Data?"
        onClose={() => setIsDeleteModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearData}>
              Clear All Data
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This action will permanently delete all your data from this device. This cannot be undone.
          </p>
          <p className="text-sm text-gray-600">
            Make sure to export your data first if you want to keep a backup.
          </p>
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default Settings
