import PropTypes from 'prop-types'

export default function TaskCard({ todo, onEdit, onDelete, onToggle }) {

  const handleDelete = async () => {
    if (!globalThis.confirm('Delete this task?')) return
    await onDelete(todo.id)
  }

  const handleToggle = async () => {
    await onToggle(todo.id, !todo.is_completed)
  }

  return (
    <div className={`bg-gray-900 border rounded-xl p-5 transition-all hover:border-gray-600 ${
      todo.is_completed ? 'border-gray-800 opacity-70' : 'border-gray-700'
    }`}>
      <div className="flex items-start gap-4">

        {/* Checkbox toggle */}
        <button
          type="button"
          onClick={handleToggle}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            todo.is_completed
              ? 'bg-lime-400 border-lime-400'
              : 'border-gray-600 hover:border-lime-400 bg-transparent'
          }`}
        >
          {todo.is_completed && (
            <svg
              className="w-3 h-3 text-gray-950"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Title */}
          <h3 className={`font-semibold text-base leading-snug mb-1 ${
            todo.is_completed ? 'text-green-500' : 'text-white'
          }`}>
            {todo.title}
          </h3>

          {/* Description — only shows if exists */}
          {todo.description && (
            <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
              {todo.description}
            </p>
          )}

          {/* Date */}
          <p className="text-gray-600 text-xs mt-2 font-mono">
            {new Date(todo.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all border border-gray-700"
            title="Edit"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-gray-700 hover:border-red-500/30"
            title="Delete"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// PropTypes validation
TaskCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    is_completed: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
}