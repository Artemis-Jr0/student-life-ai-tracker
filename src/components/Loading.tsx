import React from 'react'
import { Loader } from 'lucide-react'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Life AI Tracker</h1>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}

export default Loading
