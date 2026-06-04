import React, { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import PageTemplate from '../components/PageTemplate'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import { getFinanceEntries, addFinanceEntry, deleteFinanceEntry } from '../services/database'
import { FinanceEntry } from '../types'

function Finance() {
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense' as const,
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const allEntries = await getFinanceEntries()
      setEntries(allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('Error loading entries:', error)
    }
  }

  const handleAddEntry = async () => {
    if (!formData.title || !formData.amount) {
      setAlert({ type: 'error', title: 'Please fill in required fields' })
      return
    }

    try {
      await addFinanceEntry({
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        note: formData.note,
      })
      setAlert({ type: 'success', title: 'Entry added successfully!' })
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
      })
      setIsModalOpen(false)
      loadEntries()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to add entry' })
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteFinanceEntry(id)
      setAlert({ type: 'success', title: 'Entry deleted successfully!' })
      loadEntries()
    } catch (error) {
      setAlert({ type: 'error', title: 'Failed to delete entry' })
    }
  }

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
  const balance = totalIncome - totalExpense

  const expenseCategories = ['Food', 'Transport', 'Books', 'Subscription', 'Entertainment', 'Other']

  return (
    <PageTemplate
      title="Finance Tracker"
      subtitle="Track your expenses and budget"
      action={<Button onClick={() => setIsModalOpen(true)}><Plus size={20} className="mr-2" />Add Entry</Button>}
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

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Income</p>
              <p className="text-3xl font-bold text-green-600 mt-2">₦{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Expense</p>
              <p className="text-3xl font-bold text-red-600 mt-2">₦{totalExpense.toLocaleString()}</p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </Card>
        <Card className={`${balance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-sm font-medium ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>Balance</p>
          <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₦{balance.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        {entries.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <Card key={entry.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{entry.category}</span>
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      {entry.note && <span>• {entry.note}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.type === 'income' ? '+' : '-'}₦{entry.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add Financial Entry"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Add Entry</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Type *"
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
          />
          <Input
            label="Title *"
            placeholder="e.g., Books, Lunch"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Amount *"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
          />
          <Select
            label="Category"
            options={expenseCategories.map(cat => ({ value: cat, label: cat }))}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Note"
            placeholder="Optional note"
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
          />
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default Finance
