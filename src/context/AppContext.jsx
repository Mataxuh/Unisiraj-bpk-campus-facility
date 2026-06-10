// ============================================================
// src/context/AppContext.jsx
// ============================================================
//
// 👋 WHAT IS THIS FILE?
// This is the "brain" of the entire app!
// It manages ALL shared data and functions that every page needs.
//
// 🧠 WHAT DOES IT MANAGE?
//   ✅ Who is logged in (user authentication)
//   ✅ All complaints data (from localStorage)
//   ✅ All users data (from localStorage)
//   ✅ Notifications (the popup messages at the top)
//
// 🌐 LANGUAGE: All notification messages are fully translated!
//
// 💡 HOW TO USE IN ANY COMPONENT:
//   import { useApp } from '../context/AppContext';
//   const { user, login, complaints } = useApp();
//
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import {
  getComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  loginUser,
  getUsers,
} from '../utils/storage';

// 🌐 Import language hook for translated notifications
import { useLanguage } from './LanguageContext';

// Create the context object that will be shared across the app
const AppContext = createContext();

// ============================================================
// 🏗️ APP PROVIDER — Wraps the entire app in shared state
// ============================================================
export const AppProvider = ({ children }) => {

  // ── 📦 Global State ────────────────────────────────────────

  // The currently logged-in user object (or null if not logged in)
  const [user, setUser] = useState(null);

  // All complaints from localStorage
  const [complaints, setComplaints] = useState([]);

  // All users from localStorage
  const [users, setUsers] = useState([]);

  // The current notification shown at top of screen (or null)
  const [notification, setNotification] = useState(null);

  // 🌐 Translation function — t('key') returns text in chosen language
  const { t } = useLanguage();

  // ── 🚀 Initialize App on First Load ────────────────────────
  // This runs ONCE when the app first opens.
  // It loads all saved data from localStorage and restores session.
  useEffect(() => {

    // Load all complaints from localStorage
    setComplaints(getComplaints());

    // Load all users from localStorage
    setUsers(getUsers());

    // Check if a user was already logged in before (session restore)
    // sessionStorage keeps the user logged in until browser tab closes
    const savedUser = sessionStorage.getItem('cfcms_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // If the saved data is corrupted, clear it and start fresh
        console.error('Error restoring user session:', error);
        sessionStorage.removeItem('cfcms_user');
      }
    }
  }, []); // Empty array = run only once on mount

  // ============================================================
  // 🔐 AUTHENTICATION — Login & Logout
  // ============================================================

  // ─────────────────────────────────────────────────────────
  // 🔑 LOGIN
  // ─────────────────────────────────────────────────────────
  // How it works:
  //   1. Calls loginUser() to search for matching email+password
  //   2. If found → saves user to state + sessionStorage
  //   3. Shows welcome notification in chosen language
  //   4. Returns { success: true, user } or { success: false, error }
  //
  // We use try/catch so it NEVER crashes — always returns safely!
  // ─────────────────────────────────────────────────────────
  const login = (email, password) => {
    try {
      // Search for user with matching email and password
      const foundUser = loginUser(email, password);

      // ❌ No user found — wrong credentials
      if (!foundUser) {
        return {
          success: false,
          error: 'Invalid email or password.',
        };
      }

      // ✅ User found! Save to React state
      setUser(foundUser);

      // ✅ Also save to sessionStorage so user stays logged in
      // on page refresh (until they close the browser tab)
      sessionStorage.setItem('cfcms_user', JSON.stringify(foundUser));

      // 🎉 Show welcome message in the user's chosen language
      showNotification(
        `${t('notifications.welcome')}, ${foundUser.name}!`,
        'success'
      );

      return {
        success: true,
        user: foundUser,
      };

    } catch (err) {
      // Something unexpected crashed — log it and return safe error
      console.error('Login crashed:', err.message);
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  };

  // ─────────────────────────────────────────────────────────
  // 🚪 LOGOUT
  // ─────────────────────────────────────────────────────────
  // Clears user from state and sessionStorage.
  // Shows a goodbye notification in chosen language.
  // ─────────────────────────────────────────────────────────
  const logout = () => {
    // Clear user from React state
    setUser(null);

    // Clear user from sessionStorage
    sessionStorage.removeItem('cfcms_user');

    // Show goodbye message in chosen language
    showNotification(t('notifications.loggedOut'), 'info');
  };

  // ============================================================
  // 📋 COMPLAINT MANAGEMENT — Student & Staff
  // ============================================================

  // ─────────────────────────────────────────────────────────
  // ➕ SUBMIT COMPLAINT
  // ─────────────────────────────────────────────────────────
  const submitComplaint = (complaintData) => {

    // 🛡️ Security check — only students and staff can submit
    if (!user || (user.role !== 'student' && user.role !== 'staff')) {
      showNotification(t('notifications.onlyStudentsStaff'), 'error');
      return false;
    }

    try {
      // Create and save the new complaint to localStorage
      const newComplaint = createComplaint({
        category:      complaintData.category,
        location:      complaintData.location,
        priority:      complaintData.priority || 'Medium',
        description:   complaintData.description,
        studentId:     user.id,        // Who submitted it
        studentName:   user.name,      // Their name
        studentMatric: user.matricNo || null, // Their matric (null for staff)
        status:        'Open',         // Always starts as Open
        assignedTo:    null,           // Not assigned yet
        assignedName:  null,           // Not assigned yet
      });

      // Refresh complaints list from localStorage
      setComplaints(getComplaints());

      // ✅ Success notification in chosen language
      showNotification(t('notifications.complaintSubmitted'), 'success');
      return newComplaint;

    } catch (error) {
      console.error('Error submitting complaint:', error);
      showNotification(t('notifications.failedSubmit'), 'error');
      return false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // 🗑️ REMOVE COMPLAINT
  // ─────────────────────────────────────────────────────────
  const removeComplaint = (complaintId) => {
    try {
      // Delete from localStorage
      deleteComplaint(complaintId);

      // Refresh complaints list
      setComplaints(getComplaints());

      // ✅ Deleted notification in chosen language
      showNotification(t('notifications.complaintDeleted'), 'info');
      return true;

    } catch (error) {
      console.error('Error deleting complaint:', error);
      showNotification(t('notifications.failedDelete'), 'error');
      return false;
    }
  };

  // ============================================================
  // 👨‍💼 COMPLAINT MANAGEMENT — Admin
  // ============================================================

  // ─────────────────────────────────────────────────────────
  // 👷 ASSIGN COMPLAINT
  // ─────────────────────────────────────────────────────────
  // Admin assigns a complaint to a technician.
  const assignComplaint = (complaintId, technicianId, technicianName) => {

    // 🛡️ Security check — only admins can assign
    if (!user || user.role !== 'admin') {
      showNotification(t('notifications.onlyAdmins'), 'error');
      return false;
    }

    try {
      // Update the complaint with technician info and new status
      updateComplaint(complaintId, {
        assignedTo:   technicianId,    // Technician's user ID
        assignedName: technicianName,  // Technician's display name
        status:       'In Progress',   // Auto-update status
      });

      // Refresh complaints list
      setComplaints(getComplaints());

      // ✅ Assignment success notification in chosen language
      showNotification(
        `${t('notifications.assignedTo')} ${technicianName}!`,
        'success'
      );
      return true;

    } catch (error) {
      console.error('Error assigning complaint:', error);
      showNotification(t('notifications.failedAssign'), 'error');
      return false;
    }
  };

  // ============================================================
  // 🔧 COMPLAINT MANAGEMENT — Technician
  // ============================================================

  // ─────────────────────────────────────────────────────────
  // 📝 UPDATE COMPLAINT STATUS
  // ─────────────────────────────────────────────────────────
  const updateComplaintStatus = (complaintId, newStatus, technoteText = '') => {

    // 🛡️ Security check — only technicians can update status
    if (!user || user.role !== 'technician') {
      showNotification(t('notifications.onlyTechnicians'), 'error');
      return false;
    }

    try {
      // Find the complaint we're updating
      const complaint = getComplaintById(complaintId);

      // 🛡️ Make sure the complaint exists
      if (!complaint) {
        showNotification(t('notifications.complaintNotFound'), 'error');
        return false;
      }

      // 🛡️ Make sure this technician is assigned to this complaint
      // Technicians can ONLY update complaints assigned to THEM
      if (complaint.assignedTo !== user.id) {
        showNotification(t('notifications.notYourTask'), 'error');
        return false;
      }

      // Build the updated notes array
      // Keep all existing notes and add the new one (if provided)
      const notes = complaint.notes || [];
      if (technoteText.trim()) {
        notes.push({
          text: technoteText.trim(), // The technician's note text
          by:   user.name,           // Who wrote it
          at:   new Date().toISOString(), // When they wrote it
        });
      }

      // Save the updated status and notes to localStorage
      updateComplaint(complaintId, {
        status: newStatus,
        notes,
      });

      // Refresh complaints list
      setComplaints(getComplaints());

      // ✅ Success notification in chosen language
      showNotification(t('notifications.statusUpdated'), 'success');
      return true;

    } catch (error) {
      console.error('Error updating status:', error);
      showNotification(t('notifications.failedStatus'), 'error');
      return false;
    }
  };

  // ============================================================
  // 🛠️ UTILITY FUNCTIONS
  // ============================================================

  // Get a single complaint by its ID
  const getComplaintById = (complaintId) => {
    return complaints.find((c) => c.id === complaintId) || null;
  };

  // Get only the logged-in student's complaints
  const getMyComplaints = () => {
    if (!user || user.role !== 'student') return [];
    return complaints.filter((c) => c.studentId === user.id);
  };

  // Get only the tasks assigned to the logged-in technician
  const getMyAssignedTasks = () => {
    if (!user || user.role !== 'technician') return [];
    return complaints.filter((c) => c.assignedTo === user.id);
  };

  // Get all users who are technicians (for admin assignment dropdown)
  const getTechnicians = () => {
    return users.filter((u) => u.role === 'technician');
  };

  // ============================================================
  // 🔔 NOTIFICATION SYSTEM
  // ============================================================

  // ─────────────────────────────────────────────────────────
  // 📢 SHOW NOTIFICATION
  // ─────────────────────────────────────────────────────────
  // Displays a toast message at the top center of the screen.

  const showNotification = (message, type = 'info') => {

    // If null is passed — clear the notification right away
    if (!message) {
      setNotification(null);
      return;
    }

    // Set the new notification
    setNotification({ message, type });

    // Auto-dismiss after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ============================================================
  // 📤 SHARE EVERYTHING WITH THE APP
  // ============================================================
  const value = {

    // 🔐 Authentication
    user,          // Currently logged-in user object
    login,         // Function to log in
    logout,        // Function to log out

    // 📋 Complaints (everyone can read)
    complaints,    // Full list of ALL complaints

    // 👨‍🎓 Student & Staff Actions
    submitComplaint,  // Submit a new complaint
    removeComplaint,  // Delete a complaint
    getMyComplaints,  // Get only my complaints

    // 👨‍💼 Admin Actions
    assignComplaint,  // Assign complaint to technician

    // 🔧 Technician Actions
    updateComplaintStatus, // Update repair status + add note
    getMyAssignedTasks,    // Get only my assigned tasks

    // 👥 Users
    users,           // All users list
    getTechnicians,  // Get only technicians

    // 🛠️ Utilities
    getComplaintById, // Find one complaint by ID

    // 🔔 Notifications
    notification,       // Current notification object (or null)
    showNotification,   // Function to trigger a notification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================
// 🪝 CUSTOM HOOK — useApp()
// ============================================================
// Use this in any component to access the shared state:
//
//   import { useApp } from '../context/AppContext';
//   const { user, complaints, login } = useApp();
//
// It throws a helpful error if used outside AppProvider.
// ============================================================
export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
};