import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

export default function Modal({ isOpen, onClose, title, children }) {

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Backdrop — use button for semantic HTML */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />

      {/* Modal box — use dialog for semantic HTML */}
      <dialog
        open
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 z-10 m-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="modal-title"
            className="text-lg font-bold text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-lg"
          >
            ×
          </button>
        </div>

        {children}
      </dialog>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}