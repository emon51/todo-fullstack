import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // useCallback makes these functions stable across renders
  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginUser(credentials)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      await registerUser(userData)
      const loggedIn = await login({
        email: userData.email,
        password: userData.password,
      })
      return loggedIn
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
      setLoading(false)
      return false
    }
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  // Now all functions are stable — useMemo won't recreate unnecessarily
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  }), [user, loading, error, login, register, logout, clearError])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}