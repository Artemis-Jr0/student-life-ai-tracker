import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import { getScheduleEvents, addScheduleEvent, deleteScheduleEvent } from '../services/database'
import { ScheduleEvent } from '../types'

function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate,
    startTime: '',
    endTime: '',
    type: 'class' as const,
    location: '',
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const allEvents = await getScheduleEvents()
      setEvents(allEvents.sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)))
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const handleAddEvent = async () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setAlert({ type: 'error', title: 'Please fill in required fields' })
      return
    }

    try {
      await addScheduleEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type,
        location: formData.location,
      })
      setAlert({ type: 'success', title: 'Event added successfully!' })
      setFormData({
        title: '',
        description: '',
        date: selectedDate,
        startTime: '',
        endTime: '',
        type: 'class',
        location: '',
      })
      setIsModalOpen(false)
      loadEvents()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to add event' })
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteScheduleEvent(id)
      setAlert({ type: 'success', title: 'Event deleted successfully!' })
      loadEvents()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to delete event' })
    }
  }

  const todayEvents = events.filter(e => e.date === selectedDate)
  const typeColors = {
    class: 'primary',
    study: 'info',
    break: 'success',
    other: 'warning',
  } as const

  return (
    <PageTemplate
      title="Schedule"
      subtitle="Manage your timetable and events"
      action={<Button onClick={() => setIsModalOpen(true)}><Plus size={20} className="mr-2" />Add Event</Button>}
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

      {/* Date Selector */}
      <Card className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </Card>

      {/* Today's Events */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h2>
        {todayEvents.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayEvents.map(event => (
              <Card key={event.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        typeColors[event.type] === 'primary' ? 'bg-primary-100 text-primary-700' :
                        typeColors[event.type] === 'info' ? 'bg-blue-100 text-blue-700' :
                        typeColors[event.type] === 'success' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    {event.description && <p className="text-gray-600 text-sm mb-2">{event.description}</p>}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>⏰ {event.startTime} - {event.endTime}</p>
                      {event.location && <p>📍 {event.location}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Event"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Event Title *"
            placeholder="e.g., Biology Lecture"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time *"
              type="time"
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time *"
              type="time"
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>
          <Select
            label="Type"
            options={[
              { value: 'class', label: 'Class' },
              { value: 'study', label: 'Study' },
              { value: 'break', label: 'Break' },
              { value: 'other', label: 'Other' },
            ]}
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
          />
          <Input
            label="Location"
            placeholder="e.g., Room 101, Building A"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default Schedule
