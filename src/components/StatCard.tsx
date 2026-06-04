import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
  onClick?: () => void
}

function StatCard({ label, value, icon, trend, onClick }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  )
}

export default StatCard
