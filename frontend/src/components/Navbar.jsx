import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">Todo Application</span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">
            welcome, <span className="text-white font-medium">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium transition-all border border-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}