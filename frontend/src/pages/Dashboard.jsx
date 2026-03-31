import { useState, useEffect, useCallback } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo, patchTodo } from '../api/todoApi'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'

const TABS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
]

export default function Dashboard() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [editTodo, setEditTodo] = useState(null)

  // Build query params based on active tab
  const buildParams = useCallback((tab) => {
    if (tab === 'pending') return { status: 'pending' }
    if (tab === 'completed') return { status: 'completed' }
    return {}
  }, [])

  // Fetch todos
  const fetchTodos = useCallback(async (tab) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTodos(buildParams(tab))
      setTodos(data.results || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks.')
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => {
    fetchTodos(activeTab)
  }, [activeTab, fetchTodos])

  // Create
  const handleCreate = async (form) => {
    setFormLoading(true)
    try {
      await createTodo({ title: form.title, description: form.description })
      setCreateOpen(false)
      fetchTodos(activeTab)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task.')
    } finally {
      setFormLoading(false)
    }
  }

  // Update
  const handleUpdate = async (form) => {
    setFormLoading(true)
    try {
      await updateTodo(editTodo.id, form)
      setEditTodo(null)
      fetchTodos(activeTab)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task.')
    } finally {
      setFormLoading(false)
    }
  }

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id)
      fetchTodos(activeTab)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task.')
    }
  }

  // Toggle completed
  const handleToggle = async (id, is_completed) => {
    try {
      await patchTodo(id, { is_completed })
      fetchTodos(activeTab)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task.')
    }
  }

  // Empty state message
  const getEmptyMessage = () => {
    if (activeTab === 'completed') return 'No completed tasks yet.'
    if (activeTab === 'pending') return 'No pending tasks. All done!'
    return 'Create your first task to get started.'
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">My Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your todos</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-gray-950 font-bold text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-lime-400 text-gray-950'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading tasks...</p>
            </div>
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-semibold">No tasks found</p>
            <p className="text-gray-600 text-sm mt-1">{getEmptyMessage()}</p>
            {activeTab === 'all' && (
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-gray-950 font-bold text-sm transition-all"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TaskCard
                key={todo.id}
                todo={todo}
                onEdit={setEditTodo}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTodo}
        onClose={() => setEditTodo(null)}
        title="Edit Task"
      >
        <TaskForm
          onSubmit={handleUpdate}
          onCancel={() => setEditTodo(null)}
          loading={formLoading}
          initialData={editTodo}
        />
      </Modal>
    </div>
  )
}