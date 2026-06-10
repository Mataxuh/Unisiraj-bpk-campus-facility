// src/components/Notification.jsx
// Global toast notification component
// Displays: success, info, error messages with auto-dismiss

import { useApp } from '../context/AppContext';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

const Notification = () => {
  const { notification, showNotification } = useApp();

  // No notification to show
  if (!notification) return null;

  // ─── Notification Styles by Type ──────────────────────────
  const notificationStyles = {
    success: {
      bg: '#1B2D6B',
      border: '#E8A020',
      text: 'text-white',
      icon: <CheckCircle className="w-5 h-5" style={{ color: '#E8A020' }} />,
    },
    info: {
      bg: '#EEF0F8',
      border: '#1B2D6B',
      text: 'text-gray-800',
      icon: <Info className="w-5 h-5" style={{ color: '#1B2D6B' }} />,
    },
    error: {
      bg: '#FEE2E2',
      border: '#DC2626',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />,
    },
  };

  // Get current style
  const style = notificationStyles[notification.type] || notificationStyles.info;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4">
      {/* Notification Card */}
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border-2 ${style.text}`}
        style={{
          backgroundColor: style.bg,
          borderColor: style.border,
        }}
      >
        {/* Icon */}
        {style.icon}

        {/* Message */}
        <span className="text-sm font-medium flex-1">
          {notification.message}
        </span>

        {/* Close Button */}
        <button
          onClick={() => showNotification(null)}
          className="opacity-70 hover:opacity-100 transition-opacity"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;