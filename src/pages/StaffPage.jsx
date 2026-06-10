// ============================================================
// src/pages/StaffPage.jsx
// ============================================================
//
// 👋 WHAT IS THIS FILE?
// This is the page that STAFF members see after they log in.
// Staff are university employees (like Dr. Fatimah, Madam Ros)
// who can report office-related facility problems.
//
// 🔧 WHAT CAN STAFF DO HERE?
//   ✅ See a summary of their reported issues (stats cards)
//   ✅ Report a new office issue (button → modal form)
//   ✅ View all their previously reported issues
//   ✅ Delete an issue (but ONLY if it's still "Open")
//   ✅ See which technician was assigned to fix their issue
//   ✅ Read technician notes/updates on each issue
//
// 🚫 WHAT CAN'T STAFF DO?
//   ❌ See other people's complaints
//   ❌ Assign technicians (that's admin's job)
//   ❌ Delete issues that are already being worked on
//
// 🌐 LANGUAGE: Fully supports English and Bahasa Malaysia
//
// 🔒 ACCESS: Only users with role = "staff" can see this page
//    (This is enforced by ProtectedRoute in App.jsx)
//
// ============================================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/storage';
import {
  PlusCircle,     // ➕ Used for the "Report Issue" button
  X,              // ✖️ Used for closing modal and deleting issues
  ClipboardList,  // 📋 Used for the empty state icon
  Wrench,         // 🔧 Used for Air-Con category
  Zap,            // ⚡ Used for Electricity category
  Settings,       // ⚙️ Used for Office Equipment category
  Hammer,         // 🔨 Used for Furniture category
  AlertTriangle,  // ⚠️ Used for Plumbing category
  MoreHorizontal, // ••• Used for Other category
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 🗂️ CATEGORY ICONS
// ─────────────────────────────────────────────────────────────
// This object maps each issue category to a visual icon.
// When a staff member picks "Air-Con", they'll see the Wrench icon.
// When they pick "Electricity", they'll see the Zap (lightning) icon.
// And so on for every category!
// ─────────────────────────────────────────────────────────────
const categoryIcons = {
  'Air-Con':          <Wrench className="w-4 h-4" />,
  'Electricity':      <Zap className="w-4 h-4" />,
  'Office Equipment': <Settings className="w-4 h-4" />,
  'Furniture':        <Hammer className="w-4 h-4" />,
  'Plumbing':         <AlertTriangle className="w-4 h-4" />,
  'Cleaning':         <ClipboardList className="w-4 h-4" />,
  'Other':            <MoreHorizontal className="w-4 h-4" />,
};

// ─────────────────────────────────────────────────────────────
// 🏷️ STATUS BADGE COLORS
// ─────────────────────────────────────────────────────────────
// Each status has its own color so staff can quickly
// identify the state of their issue at a glance:
//   🟡 Open       = yellow  (waiting to be assigned)
//   🔵 In Progress = blue   (technician is working on it)
//   🟢 Resolved   = green   (issue is fixed!)
//   ⚫ Closed     = gray    (case closed)
// ─────────────────────────────────────────────────────────────
const statusStyles = {
  'Open':        'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved':    'bg-green-100 text-green-800',
  'Closed':      'bg-gray-100 text-gray-600',
};

// ─────────────────────────────────────────────────────────────
// 🚨 PRIORITY BADGE COLORS
// ─────────────────────────────────────────────────────────────
// Shows how urgent the issue is:
//   ⚪ Low    = gray   (can wait a few days)
//   🟠 Medium = orange (should be fixed soon)
//   🔴 High   = red    (needs attention quickly)
//   🚨 Urgent = solid red (fix it NOW!)
// ─────────────────────────────────────────────────────────────
const priorityStyles = {
  'Low':    'bg-gray-100 text-gray-600',
  'Medium': 'bg-orange-100 text-orange-700',
  'High':   'bg-red-100 text-red-700',
  'Urgent': 'bg-red-600 text-white',
};

// ============================================================
// 🧩 MAIN COMPONENT — StaffPage
// ============================================================
const StaffPage = () => {

  // ── 🔌 Connect to Global State ────────────────────────────
  // useApp() gives us access to:
  //   - user         → the currently logged-in staff member
  //   - allComplaints → ALL complaints in the system
  //   - submitComplaint → function to create a new complaint
  //   - removeComplaint → function to delete a complaint
  const {
    user,
    complaints: allComplaints,
    submitComplaint,
    removeComplaint,
  } = useApp();

  // ── 🌐 Connect to Language System ─────────────────────────
  // t() is our translation function.
  // Example: t('staff.title') returns "Office Issues" in English
  //          or "Isu Pejabat" in Malay
  const { t } = useLanguage();

  // ── 📦 Local State (things this page remembers) ───────────

  // Controls whether the "Report New Issue" modal is visible
  // false = modal hidden, true = modal showing
  const [showForm, setShowForm] = useState(false);

  // Stores what the staff member is currently typing in the form.
  // These are the default/empty values when the form first opens.
  const [formData, setFormData] = useState({
    category:    'Air-Con',  // Default category selected
    location:    '',         // Where is the problem?
    priority:    'Medium',   // How urgent is it?
    description: '',         // Full description of the problem
  });

  // ── 📊 Filter This Staff Member's Issues ──────────────────
  // allComplaints contains EVERYONE's complaints.
  // We only want to show THIS staff member's issues.
  // We match by studentId (staff also uses this field as their ID).
  const myComplaints = allComplaints.filter(
    (c) => c.studentId === user.id
  );

  // ── 📈 Calculate Stats for the Summary Cards ──────────────
  // Count how many issues are in each status category
  const stats = {
    total:      myComplaints.length,
    open:       myComplaints.filter((c) => c.status === 'Open').length,
    inProgress: myComplaints.filter((c) => c.status === 'In Progress').length,
    resolved:   myComplaints.filter((c) => c.status === 'Resolved').length,
  };

  // ── 📝 Handle Form Submission ──────────────────────────────
  // This runs when the staff member clicks "Report Issue" in the modal.
  // Steps:
  //   1. Check that location and description are not empty
  //   2. Call submitComplaint() from AppContext to save the issue
  //   3. Reset the form back to empty/default values
  //   4. Close the modal
  const handleSubmitComplaint = (e) => {
    e.preventDefault(); // Stop the page from refreshing

    // Make sure required fields are filled in
    if (!formData.location.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Save the new complaint to localStorage via AppContext
    submitComplaint(formData);

    // Reset form to defaults for next time
    setFormData({
      category:    'Air-Con',
      location:    '',
      priority:    'Medium',
      description: '',
    });

    // Close the modal
    setShowForm(false);
  };

  // ── 🗑️ Handle Delete Issue ────────────────────────────────
  // Staff can only delete issues that are still "Open".
  // We ask for confirmation before deleting (just in case!).
  const handleDelete = (complaintId) => {
    if (window.confirm(t('staff.deleteConfirm'))) {
      removeComplaint(complaintId);
    }
  };

  // ============================================================
  // 🖥️ WHAT WE RENDER ON SCREEN
  // ============================================================
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* ── 🏷️ Page Header ──────────────────────────────────── */}
      {/* Shows: Page Title | Welcome Message | Report Issue Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          {/* Page title — changes language based on user's choice */}
          <h1
            className="text-3xl font-extrabold"
            style={{ color: '#1B2D6B' }}
          >
            {t('staff.title')}
          </h1>
          {/* Welcome message with the staff member's name inserted */}
          <p className="text-sm text-gray-500 mt-1">
            {t('staff.welcome', { name: user?.name })}
          </p>
        </div>

        {/* Button to open the "Report New Issue" modal */}
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: '#1B2D6B' }}
        >
          <PlusCircle className="w-5 h-5" />
          {t('staff.reportIssue')}
        </button>
      </div>

      {/* ── 📊 Stats Summary Cards ──────────────────────────── */}
      {/* Four cards showing counts: Total, Open, In Progress, Resolved */}
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
            {/* Big colorful number */}
            <p
              className="text-3xl font-extrabold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            {/* Label below the number */}
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── 📋 Issues List ──────────────────────────────────── */}
      {/* If no issues yet → show a friendly empty state message */}
      {/* If issues exist → show each one as a card */}
      {myComplaints.length === 0 ? (

        // 😴 Empty State — no issues reported yet
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">
            {t('staff.noIssues')}
          </p>
          <p className="text-gray-300 text-sm mt-1">
            {t('staff.noIssuesHint')}
          </p>
        </div>

      ) : (

        // 📄 Issues Exist — render each issue as a card
        <div className="flex flex-col gap-4">
          {myComplaints.map((complaint) => (

            // ── 🃏 Individual Issue Card ───────────────────────
            <div
              key={complaint.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >

              {/* Card Top: Icon + Category + Location | Badges + Delete */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">

                {/* LEFT SIDE: Category icon, name, and location */}
                <div className="flex items-start gap-3">

                  {/* Category Icon (navy background, white icon) */}
                  <div
                    className="p-2 rounded-lg text-white flex-shrink-0"
                    style={{ backgroundColor: '#1B2D6B' }}
                  >
                    {categoryIcons[complaint.category] || categoryIcons['Other']}
                  </div>

                  <div>
                    {/* Category name (translated) */}
                    <p className="font-bold text-gray-800 text-sm">
                      {t(`staff.categories.${complaint.category}`) || complaint.category}
                    </p>
                    {/* Location */}
                    <p className="text-xs text-gray-500">
                      📍 {complaint.location}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE: Status badge, Priority badge, Delete button */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Status Badge (e.g. "Open", "In Progress") */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[complaint.status]}`}>
                    {t(`common.statuses.${complaint.status}`) || complaint.status}
                  </span>

                  {/* Priority Badge (e.g. "Urgent", "Medium") */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityStyles[complaint.priority]}`}>
                    {t(`common.priorities.${complaint.priority}`) || complaint.priority}
                  </span>

                  {/* 🗑️ Delete Button — ONLY shown for Open issues */}
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

              {/* Issue Description — what the staff member wrote */}
              <p className="text-sm text-gray-600 mb-3">
                {complaint.description}
              </p>

              {/* 🔧 Assigned Technician — shown only after admin assigns someone */}
              {complaint.assignedName && (
                <div
                  className="text-xs px-3 py-2 rounded-lg font-medium mb-3"
                  style={{ backgroundColor: '#EEF0F8', color: '#1B2D6B' }}
                >
                  🔧 {t('common.assignedTo')}: <strong>{complaint.assignedName}</strong>
                </div>
              )}

              {/* 📝 Technician Updates — shown only when notes exist */}
              {/* Staff can see what the technician wrote about their fix */}
              {complaint.notes && complaint.notes.length > 0 && (
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{ backgroundColor: '#EEF0F8' }}
                >
                  <p
                    className="font-bold mb-2"
                    style={{ color: '#1B2D6B' }}
                  >
                    📝 {t('staff.techUpdates')}:
                  </p>
                  {/* Loop through all notes and display each one */}
                  {complaint.notes.map((note, idx) => (
                    <p key={idx} className="text-gray-700 mb-1">
                      • {note.text}
                      {/* Who wrote it and when */}
                      <span className="text-gray-500 text-xs block mt-0.5">
                        — {note.by}, {formatDate(note.at)}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {/* Card Footer: When the issue was reported */}
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
                {t('common.reported')}: {formatDate(complaint.createdAt)}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          📬 REPORT NEW ISSUE MODAL
          ══════════════════════════════════════════════════════
          This popup appears when the staff clicks "Report Issue".
          ══════════════════════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header — navy background with title and close button */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <div className="flex items-center gap-2 text-white">
                <AlertTriangle
                  className="w-5 h-5"
                  style={{ color: '#E8A020' }}
                />
                <h2 className="font-bold text-sm">
                  {t('staff.modalTitle')}
                </h2>
              </div>

              {/* ✖️ Close button — hides the modal without saving */}
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:opacity-70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form — all the input fields */}
            <form
              onSubmit={handleSubmitComplaint}
              className="p-6 flex flex-col gap-4"
            >

              {/* 🗂️ Issue Type / Category Dropdown */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('staff.issueType')} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition"
                >
                  {/* Loop through all categories and show translated names */}
                  {Object.keys(categoryIcons).map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`staff.categories.${cat}`) || cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 📍 Location Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('staff.location')} *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('staff.locationPlaceholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition"
                />
              </div>

              {/* 🚨 Priority Dropdown */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('staff.priority')}
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

              {/* 📄 Description Textarea */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('staff.description')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('staff.descriptionPlaceholder')}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none transition resize-none"
                />
              </div>

              {/* ── Form Buttons ─────────────────────────────── */}
              <div className="flex gap-3 mt-2">

                {/* Cancel — closes modal without saving anything */}
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>

                {/* Submit — saves the issue and closes modal */}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1B2D6B' }}
                >
                  {t('staff.submitBtn')}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;