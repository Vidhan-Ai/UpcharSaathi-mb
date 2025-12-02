'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if there's an active session in localStorage
        const storedUser = localStorage.getItem('upcharSaathiUser')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Make API request to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store the user data in state and localStorage
      setUser(data.user)
      localStorage.setItem('upcharSaathiUser', JSON.stringify(data.user))
      return data.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password, phone, dob, gender, blood_group) => {
    setLoading(true)
    try {
      // Make API request to signup endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, dob, gender, blood_group }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      // After signup, automatically log the user in
      setUser(data.user)
      localStorage.setItem('upcharSaathiUser', JSON.stringify(data.user))
      return data.user
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear user from state and localStorage
    setUser(null)
    localStorage.removeItem('upcharSaathiUser')
  }

  // Add medical record to user data
  const addMedicalRecord = (recordData) => {
    if (!user) return false

    try {
      // Create a deep copy of the user
      const updatedUser = JSON.parse(JSON.stringify(user))

      // Initialize medicalRecords array if it doesn't exist
      if (!updatedUser.medicalRecords) {
        updatedUser.medicalRecords = []
      }

      // Add timestamp to record
      const record = {
        ...recordData,
        timestamp: new Date().toISOString(),
        id: `record-${Date.now()}`
      }

      // Add the new record to the array
      updatedUser.medicalRecords.unshift(record) // Add to beginning of array for chronological sorting (newest first)

      // Update state and localStorage
      setUser(updatedUser)
      localStorage.setItem('upcharSaathiUser', JSON.stringify(updatedUser))

      return true
    } catch (error) {
      console.error('Failed to add medical record:', error)
      return false
    }
  }

  // Get all medical records for the current user
  const getMedicalRecords = () => {
    if (!user || !user.medicalRecords) return []
    return user.medicalRecords
  }

  // Delete a medical record
  const deleteMedicalRecord = (recordId) => {
    if (!user || !user.medicalRecords) return false

    try {
      const updatedUser = JSON.parse(JSON.stringify(user))
      updatedUser.medicalRecords = updatedUser.medicalRecords.filter(
        record => record.id !== recordId
      )

      setUser(updatedUser)
      localStorage.setItem('upcharSaathiUser', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Failed to delete medical record:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    addMedicalRecord,
    getMedicalRecords,
    deleteMedicalRecord
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
