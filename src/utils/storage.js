// src/utils/storage.js
// Data persistence layer — handles all localStorage operations
// Single source of truth for data structure

const STORAGE_KEYS = {
  COMPLAINTS: 'cfcms_complaints',
  USERS: 'cfcms_users',
};

// ═════════════════════════════════════════════════════════════
// INITIALIZATION - Default Users (Pre-seeded for Demo)
// ═════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// DATA VERSION — bump this number whenever DEFAULT_USERS changes
// The app will auto-reset localStorage to load fresh data!
// ─────────────────────────────────────────────────────────────
const DATA_VERSION = 'v2';
const storedVersion = localStorage.getItem('cfcms_version');
if (storedVersion !== DATA_VERSION) {
  localStorage.removeItem('cfcms_users');
  localStorage.removeItem('cfcms_complaints');
  localStorage.setItem('cfcms_version', DATA_VERSION);
}


const DEFAULT_USERS = [
  // Students
  {
    id: 'u1',
    name: 'Aminu Ibrahim Musa',
    matricNo: '823110123',
    email: 'student@unisiraj.edu.my',
    password: 'student123',
    role: 'student',
  },
  {
    id: 'u2',
    name: 'BroSyed Muhammad Fitri',
    matricNo: '11243170456',
    email: 'student2@unisiraj.edu.my',
    password: 'student456',
    role: 'student',
  },
  
  // Admin
  {
    id: 'u3',
    name: 'Admin BPK',
    matricNo: null,
    email: 'admin@unisiraj.edu.my',
    password: 'admin123',
    role: 'admin',
  },

  // Technicians
  {
    id: 'u4',
    name: 'En. Doshiro',
    matricNo: null,
    email: 'tech@unisiraj.edu.my',
    password: 'tech123',
    role: 'technician',
  },
  {
    id: 'u5',
    name: 'Puan Lubaabah',
    matricNo: null,
    email: 'tech2@unisiraj.edu.my',
    password: 'tech456',
    role: 'technician',
  },
  {
    id: 'u6',
    name: 'Engineer Mikhael',
    matricNo: null,
    email: null,
    password: null,
    role: 'technician',
  },
  {
    id: 'u7',
    name: 'Bukar Repairs',
    matricNo: null,
    email: null,
    password: null,
    role: 'technician',
  },
  {
    id: 'u8',
    name: 'Ust. Abdulrahman',
    matricNo: null,
    email: null,
    password: null,
    role: 'technician',
  },

  // Staff
  {
    id: 'u9',
    name: 'Dr. Fatimah Noni',
    matricNo: null,
    email: 'staff@unisiraj.edu.my',
    password: 'staff123',
    role: 'staff',
  },
  {
    id: 'u10',
    name: 'Madam Ros Syammi Hamid',
    matricNo: null,
    email: 'staff2@unisiraj.edu.my',
    password: 'staff456',
    role: 'staff',
  },
];

// Initialize users on first load
const initializeUsers = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
};

// ═════════════════════════════════════════════════════════════
// USERS - Authentication & Retrieval
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// GET USERS
// Always merges DEFAULT_USERS with localStorage.
// This ensures new users added to DEFAULT_USERS
// are always available even without clearing cache!
// ─────────────────────────────────────────────────────────────
export const getUsers = () => {
  try {
    const stored = localStorage.getItem('cfcms_users');
    const storedUsers = stored ? JSON.parse(stored) : [];

    // Find any DEFAULT_USERS that are missing from localStorage
    const missingUsers = DEFAULT_USERS.filter(
      (defaultUser) => !storedUsers.find((u) => u.id === defaultUser.id)
    );

    // If there are missing users, add them and save back
    if (missingUsers.length > 0) {
      const merged = [...storedUsers, ...missingUsers];
      localStorage.setItem('cfcms_users', JSON.stringify(merged));
      return merged;
    }

    return storedUsers.length > 0 ? storedUsers : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

// ─────────────────────────────────────────────────────────────
// LOGIN USER
// Searches all users for a matching email + password.
// Returns the user object if found, or null if not found.
// Email comparison is case-insensitive for better UX.
// ─────────────────────────────────────────────────────────────
export const loginUser = (email, password) => {
  try {
    const users = getUsers();

    // Find user matching email (case-insensitive) AND password
    const user = users.find(
      (u) =>
        u.email &&                                          // must have an email
        u.email.toLowerCase() === email.toLowerCase() &&   // email must match
        u.password === password                            // password must match
    );

    // Return user object if found, null otherwise
    return user || null;

  } catch (err) {
    console.error('loginUser error:', err.message);
    return null;
  }
};

// ═════════════════════════════════════════════════════════════
// COMPLAINTS - CRUD Operations
// ═════════════════════════════════════════════════════════════

export const getComplaints = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading complaints:', error);
    return [];
  }
};

export const createComplaint = (complaintData) => {
  const complaints = getComplaints();
  const newComplaint = {
    id: generateId(),
    ...complaintData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  };
  complaints.push(newComplaint);
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  return newComplaint;
};

export const updateComplaint = (complaintId, updates) => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === complaintId);

  if (index === -1) {
    console.warn(`Complaint ${complaintId} not found`);
    return null;
  }

  complaints[index] = {
    ...complaints[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  return complaints[index];
};

export const deleteComplaint = (complaintId) => {
  const complaints = getComplaints();
  const filtered = complaints.filter((c) => c.id !== complaintId);
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(filtered));
  return true;
};

export const getComplaintById = (complaintId) => {
  const complaints = getComplaints();
  return complaints.find((c) => c.id === complaintId) || null;
};

// ═════════════════════════════════════════════════════════════
// UTILITIES - Helpers
// ═════════════════════════════════════════════════════════════

export const generateId = () => {
  return `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ═════════════════════════════════════════════════════════════
// BULK OPERATIONS - For Testing & Reset
// ═════════════════════════════════════════════════════════════

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
};

export const resetToDefaults = () => {
  clearAllData();
  initializeUsers();
};