'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useStackApp } from "@stackframe/stack";

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const user = useUser();
  const app = useStackApp();
  const [loading, setLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState({});

  useEffect(() => {
    // Stack Auth handles session, so we just sync loading state
    console.log("AuthContext: user state changed", user);
    if (user !== undefined) {
      setLoading(false);

      if (user) {
        // Load local profile data
        try {
          const storageKey = `upcharSaathi_profile_${user.id}`;
          const savedProfile = JSON.parse(localStorage.getItem(storageKey) || '{}');
          setLocalProfile(savedProfile);
        } catch (e) {
          console.error("Failed to load local profile", e);
        }
      } else {
        setLocalProfile({});
      }
    }
  }, [user]);

  const login = async (email, password) => {
    // This is now handled by Stack Auth UI components or app.signIn
    // We keep this for compatibility if needed, but UI should use Stack components
    try {
      await app.signInWithCredential({ email, password });
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  }

  const signup = async (name, email, password, phone, dob, gender, blood_group) => {
    // Stack Auth signup. Note: Custom fields like phone, dob etc need to be handled 
    // either via metadata or separate profile update after signup.
    // For now we just do the basic signup.
    try {
      await app.signUpWithCredential({ email, password, name });
      // TODO: Save extra fields to a profile database or user metadata
    } catch (error) {
      console.error("Signup error", error);
      throw error;
    }
  }

  const logout = async () => {
    await app.signOut();
    setLocalProfile({});
  }

  const updateProfile = async (data) => {
    if (!user) return;
    try {
      const storageKey = `upcharSaathi_profile_${user.id}`;
      const updatedProfile = { ...localProfile, ...data };
      localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
      setLocalProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  }

  // Add medical record to user data (stored in localStorage for now)
  const addMedicalRecord = (recordData) => {
    if (!user) return false

    try {
      const storageKey = `upcharSaathi_medicalRecords_${user.id}`;
      const existingRecords = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // Add timestamp to record
      const record = {
        ...recordData,
        timestamp: new Date().toISOString(),
        id: `record-${Date.now()}`
      }

      // Add the new record to the array
      const updatedRecords = [record, ...existingRecords];

      // Update localStorage
      localStorage.setItem(storageKey, JSON.stringify(updatedRecords));

      // Force update to ensure UI reflects changes immediately (by updating a dummy state or similar if needed, 
      // but here we might rely on the component re-fetching. 
      // Ideally we should have medicalRecords in state too, but for now let's leave it as is 
      // since the ProfilePage calls getMedicalRecords() on render/effect).

      return true
    } catch (error) {
      console.error('Failed to add medical record:', error)
      return false
    }
  }

  // Get all medical records for the current user
  const getMedicalRecords = () => {
    if (!user) return []
    try {
      const storageKey = `upcharSaathi_medicalRecords_${user.id}`;
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  // Delete a medical record
  const deleteMedicalRecord = (recordId) => {
    if (!user) return false

    try {
      const storageKey = `upcharSaathi_medicalRecords_${user.id}`;
      const existingRecords = JSON.parse(localStorage.getItem(storageKey) || '[]');

      const updatedRecords = existingRecords.filter(
        record => record.id !== recordId
      )

      localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
      return true
    } catch (error) {
      console.error('Failed to delete medical record:', error)
      return false
    }
  }

  // Mocking the user object structure expected by the app if needed
  // Stack user has { id, email, displayName, ... }
  // The app might expect { name, ... }
  const extendedUser = user ? {
    ...user,
    ...localProfile, // Merge local profile data (phone, dob, etc.)
    name: localProfile.name || user.displayName || user.primaryEmail?.split('@')[0] || user.id,
    email: user.primaryEmail,
    primaryEmailVerified: user.primaryEmailVerified,
    medicalRecords: getMedicalRecords()
  } : null;

  const value = {
    user: extendedUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
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
