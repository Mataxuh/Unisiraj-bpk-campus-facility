// ============================================================
// src/pages/StudentPage.jsx
// ------------------------------------------------------------
// Student dashboard for submitting and tracking complaints.
//
// FEATURES:
//   - Stats overview (Total, Open, In Progress, Resolved)
//   - List of personal complaints with status/priority badges
//   - New Complaint modal form
//   - Delete complaint (Open status only)
//   - Technician notes visible on each card
//   - Full dual-language support (EN/MY)
//
// ROLE ACCESS: student only (enforced by ProtectedRoute)
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/storage';
import {
  PlusCircle,    // New complaint button icon
  X,             // Delete / close icon
  ClipboardList, // Empty state icon
  Wifi,          // Wi-Fi category icon
  Zap,           // Electricity category icon
  Droplets,      // Water category icon
  Wind,          // Air-Con category icon
  Lock,          // Door/Lock category icon
  Sparkles,      // Cleanliness category icon
  MoreHorizontal,// Other category icon
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CATEGORY ICON MAP
// Maps each complaint category to a matching Lucide icon.
// Used in both the complaint cards and the modal form.
// ─────────────────────────────────────────────────────────────
const categoryIcons = {
  'Wi-Fi':       <Wifi className="w-4 h-4" />,
  'Electricity': <Zap className="w-4 h-4" />,
  'Water':       <Droplets className="w-4 h-4" />,
  // 'Air-Cond':     <Wind className="w-4 h-4" />,
  'Door/Lock':   <Lock className="w-4 h-4" />,
  'Cleanliness': <Sparkles className="w-4 h-4" />,
  'Other':       <MoreHorizontal className="w-4 h-4" />,
};

// ─────────────────────────────────────────────────────────────
// STATUS BADGE STYLES
// Tailwind classes for each complaint status badge.
// ─────────────────────────────────────────────────────────────
const statusStyles = {
  'Open':        'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved':    'bg-green-100 text-green-800',
  'Closed':      'bg-gray-100 text-gray-600',
};

// ─────────────────────────────────────────────────────────────
// PRIORITY BADGE STYLES
// Tailwind classes for each complaint priority badge.
// ─────────────────────────────────────────────────────────────
const priorityStyles = {
  'Low':    'bg-gray-100 text-gray-600',
  'Medium': 'bg-orange-100 text-orange-700',
  'High':   'bg-red-100 text-red-700',
  'Urgent': 'bg-red-600 text-white',
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const StudentPage = () => {

  // ── Hooks ──────────────────────────────────────────────────
  const { user, complaints: allComplaints, submitComplaint, removeComplaint } = useApp();
  const { t } = useLanguage();

  // ── Local State ────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false); // Controls new complaint modal visibility

  // Initial form state — reset after each submission
  const [formData, setFormData] = useState({
    category:    'Wi-Fi',
    location:    '',
    priority:    'Medium',
    description: '',
  });

  // ── Derived Data ───────────────────────────────────────────
  // Filter complaints to show only THIS student's complaints
  const myComplaints = allComplaints.filter((c) => c.studentId === user.id);

  // ── Stats Calculation ──────────────────────────────────────
  // Count complaints by status for the stats row
  const stats = {
    total:      myComplaints.length,
    open:       myComplaints.filter((c) => c.status === 'Open').length,
    inProgress: myComplaints.filter((c) => c.status === 'In Progress').length,
    resolved:   myComplaints.filter((c) => c.status === 'Resolved').length,
  };

  // ── Category Keys ──────────────────────────────────────────
  // Raw category keys used for form select + icon lookup
  const categoryKeys = Object.keys(categoryIcons);

  // ── Handle Submit Complaint ────────────────────────────────
  // Validates form, calls context submitComplaint, resets form
  const handleSubmitComplaint = (e) => {
    e.preventDefault();

    if (!formData.location.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    submitComplaint(formData);

    // Reset form fields after submission
    setFormData({
      category:    'Wi-Fi',
      location:    '',
      priority:    'Medium',
      description: '',
    });

    setShowForm(false);
  };

  // ── Handle Delete Complaint ────────────────────────────────
  // Only allowed for Open complaints — confirms before deleting
  const handleDelete = (complaintId) => {
    if (window.confirm(t('student.deleteConfirm'))) {
      removeComplaint(complaintId);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* ── Page Header ─────────────────────────────────────── */}
      {/* Shows page title, welcome message, and New Complaint button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: '#1B2D6B' }}
          >
            {t('student.title')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('student.welcome', { name: user?.name })}
          </p>
        </div>

        {/* New Complaint Button — opens modal form */}
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: '#1B2D6B' }}
        >
          <PlusCircle className="w-5 h-5" />
          {t('student.newComplaint')}
        </button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      {/* Four stat cards: Total, Open, In Progress, Resolved */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t('common.total'),      value: stats.total,      color: '#1B2D6B' },
          { label: t('common.open'),       value: stats.open,       color: '#D97706' },
          { label: t('common.inProgress'), value: stats.inProgress, color: '#2563EB' },
          { label: t('common.resolved'),   value: stats.resolved,   color: '#16A34A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100"
          >
            <p
              className="text-3xl font-extrabold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Complaints List ─────────────────────────────────── */}
      {/* Empty state shown when no complaints exist */}
      {myComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">
            {t('student.noComplaints')}
          </p>
          <p className="text-gray-300 text-sm mt-1">
            {t('student.noComplaintsHint')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myComplaints.map((complaint) => (

            /* ── Complaint Card ─────────────────────────────── */
            <div
              key={complaint.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >

              {/* Card Top Row: Category icon, name, badges, delete */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">

                {/* Left: Icon + Category + Location */}
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg text-white flex-shrink-0"
                    style={{ backgroundColor: '#1B2D6B' }}
                  >
                    {categoryIcons[complaint.category] || categoryIcons['Other']}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {/* Show translated category name if available */}
                      {t(`student.categories.${complaint.category}`) || complaint.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      📍 {complaint.location}
                    </p>
                  </div>
                </div>

                {/* Right: Status badge, Priority badge, Delete button */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Status Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[complaint.status]}`}>
                    {t(`common.statuses.${complaint.status}`) || complaint.status}
                  </span>

                  {/* Priority Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityStyles[complaint.priority]}`}>
                    {t(`common.priorities.${complaint.priority}`) || complaint.priority}
                  </span>

                  {/* Delete Button — only visible for Open complaints */}
                  {complaint.status === 'Open' && (
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title={t('common.delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Complaint Description */}
              <p className="text-sm text-gray-600 mb-3">
                {complaint.description}
              </p>

              {/* Assigned Technician Info — shown when assigned */}
              {complaint.assignedName && (
                <div
                  className="text-xs px-3 py-2 rounded-lg font-medium mb-3"
                  style={{ backgroundColor: '#EEF0F8', color: '#1B2D6B' }}
                >
                  🔧 {t('common.assignedTo')}: <strong>{complaint.assignedName}</strong>
                </div>
              )}

              {/* Technician Notes Section — shown when notes exist */}
              {complaint.notes && complaint.notes.length > 0 && (
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{ backgroundColor: '#EEF0F8' }}
                >
                  <p
                    className="font-bold mb-2"
                    style={{ color: '#1B2D6B' }}
                  >
                    📝 {t('common.techNotes')}:
                  </p>
                  {complaint.notes.map((note, idx) => (
                    <p key={idx} className="text-gray-700 mb-1">
                      • {note.text}
                      <span className="text-gray-500 text-xs block mt-0.5">
                        — {note.by}, {formatDate(note.at)}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {/* Card Footer: Submission date */}
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
                {t('common.submitted')}: {formatDate(complaint.createdAt)}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          NEW COMPLAINT MODAL
          ──────────────────────────────────────────────────────
          Shown when showForm === true.
          Overlay + centered card with form inputs.
          ══════════════════════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <div className="flex items-center gap-2 text-white">
                <PlusCircle
                  className="w-5 h-5"
                  style={{ color: '#E8A020' }}
                />
                <h2 className="font-bold text-sm">
                  {t('student.modalTitle')}
                </h2>
              </div>

              {/* Close modal button */}
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:opacity-70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSubmitComplaint}
              className="p-6 flex flex-col gap-4"
            >

              {/* Category Select */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('student.category')} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition"
                >
                  {categoryKeys.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`student.categories.${cat}`) || cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('student.location')} *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('student.locationPlaceholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition"
                />
              </div>

              {/* Priority Select */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('student.priority')}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition"
                >
                  {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                    <option key={p} value={p}>
                      {t(`common.priorities.${p}`) || p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Textarea */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('student.description')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('student.descriptionPlaceholder')}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 mt-2">

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1B2D6B' }}
                >
                  {t('student.submitBtn')}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentPage;