import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function TaskForm({ onSubmit, onCancel, loading, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    is_completed: false,
  })

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        is_completed: initialData.is_completed || false,
      })
    } else {
      setForm({ title: '', description: '', is_completed: false })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }


const getSubmitLabel = () => {
  if (loading) return 'Saving...'
  if (initialData) return 'Update Task'
  return 'Create Task'
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-400 mb-1.5"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
          maxLength={255}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-400 mb-1.5"
        >
          Description{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all text-sm resize-none"
        />
      </div>

      {/* is_completed — only show when editing */}
      {initialData && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700">
          <input
            type="checkbox"
            name="is_completed"
            id="task-is-completed"
            checked={form.is_completed}
            onChange={handleChange}
            className="w-4 h-4 accent-lime-400 cursor-pointer"
          />
          <label
            htmlFor="task-is-completed"
            className="text-sm text-gray-300 cursor-pointer"
          >
            Mark as completed
          </label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium text-sm transition-all border border-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-gray-950 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          
        {getSubmitLabel()}
        </button>
      </div>
    </form>
  )
}

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    is_completed: PropTypes.bool,
  }),
}

TaskForm.defaultProps = {
  initialData: null,
}