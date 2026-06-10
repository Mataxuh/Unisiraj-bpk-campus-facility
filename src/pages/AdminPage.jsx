// src/pages/AdminPage.jsx
// Admin dashboard - manage and assign all complaints
// Features: stats, filter, assign/reassign, delete, technician notes
// Role Access: admin only

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/storage';
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  UserCheck,
  X,
  Search,
} from 'lucide-react';

// ─── Status Badge Styles ──────────────────────────────────
const statusStyles = {
  'Open':        'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved':    'bg-green-100 text-green-800',
  'Closed':      'bg-gray-100 text-gray-600',
};

// ─── Priority Badge Styles ────────────────────────────────
const priorityStyles = {
  'Low':    'bg-gray-100 text-gray-600',
  'Medium': 'bg-orange-100 text-orange-700',
  'High':   'bg-red-100 text-red-700',
  'Urgent': 'bg-red-600 text-white',
};

const AdminPage = () => {
  const { complaints, getTechnicians, assignComplaint, removeComplaint } = useApp();
  const { t } = useLanguage();

  // ─── State ─────────────────────────────────────────────
  const [filterStatus,   setFilterStatus]   = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedTechId,    setSelectedTechId]    = useState('');

  // ─── Get Technicians ───────────────────────────────────
  const technicians = getTechnicians();

  // ─── Filter + Search Complaints ────────────────────────
  // Applies status filter, priority filter, and search query
  const filteredComplaints = complaints.filter((c) => {
    const statusMatch   = filterStatus   === 'All' || c.status   === filterStatus;
    const priorityMatch = filterPriority === 'All' || c.priority === filterPriority;
    const searchMatch   = !searchQuery.trim() ||
      c.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase())    ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase())    ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && priorityMatch && searchMatch;
  });

  // ─── Stats ─────────────────────────────────────────────
  const stats = {
    total:      complaints.length,
    open:       complaints.filter((c) => c.status === 'Open').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved:   complaints.filter((c) => c.status === 'Resolved').length,
  };

  // ─── Handle Assignment ──────────────────────────────────
  const handleAssign = () => {
    if (!selectedTechId || !selectedComplaint) {
      alert('Please select a technician');
      return;
    }
    const tech = technicians.find((t) => t.id === selectedTechId);
    assignComplaint(selectedComplaint.id, tech.id, tech.name);
    setSelectedComplaint(null);
    setSelectedTechId('');
  };

  // ─── Handle Delete ──────────────────────────────────────
  const handleDelete = (complaintId) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      removeComplaint(complaintId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* ─── Page Header ──────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#1B2D6B' }}>
          {t('admin.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('admin.subtitle')}
        </p>
      </div>

      {/* ─── Stats Row ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t('common.total'),      value: stats.total,      icon: <ClipboardList className="w-5 h-5" />, color: '#1B2D6B' },
          { label: t('common.open'),       value: stats.open,       icon: <AlertCircle className="w-5 h-5" />,   color: '#D97706' },
          { label: t('common.inProgress'), value: stats.inProgress, icon: <Clock className="w-5 h-5" />,         color: '#2563EB' },
          { label: t('common.resolved'),   value: stats.resolved,   icon: <CheckCircle className="w-5 h-5" />,   color: '#16A34A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Available Technicians Panel ─────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4" style={{ color: '#1B2D6B' }} />
          <p className="font-bold text-sm" style={{ color: '#1B2D6B' }}>
            {t('admin.availableTechs')} ({technicians.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <UserCheck className="w-3 h-3" style={{ color: '#E8A020' }} />
              {tech.name}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Search Bar ────────────────────────────────────── */}
      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition bg-white"
          />
          {/* Clear search button — only shows when something is typed */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Filter Bar ────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-xl border border-gray-100"
        style={{ backgroundColor: '#EEF0F8' }}
      >
        <Filter className="w-4 h-4" style={{ color: '#1B2D6B' }} />

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: '#1B2D6B' }}>
            {t('admin.filterStatus')}:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none bg-white"
          >
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? t('common.all') : t(`common.statuses.${s}`) || s}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: '#1B2D6B' }}>
            {t('admin.filterPriority')}:
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none bg-white"
          >
            {['All', 'Low', 'Medium', 'High', 'Urgent'].map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? t('common.all') : t(`common.priorities.${p}`) || p}
              </option>
            ))}
          </select>
        </div>

        {/* Result Count */}
        <p className="text-xs text-gray-500 ml-auto">
          {t('admin.showing')} {filteredComplaints.length} {t('admin.of')} {complaints.length}
        </p>
      </div>

      {/* ─── Complaints List ──────────────────────────────── */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">{t('admin.noComplaints')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-2">

                {/* Complaint Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gray-800">{complaint.category}</p>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[complaint.status]}`}>
                      {t(`common.statuses.${complaint.status}`) || complaint.status}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityStyles[complaint.priority]}`}>
                      {t(`common.priorities.${complaint.priority}`) || complaint.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    📍 {complaint.location} · 👤 {complaint.studentName}
                    {complaint.studentMatric && (
                      <span style={{ color: '#1B2D6B' }}> ({complaint.studentMatric})</span>
                    )}
                    · 🕐 {formatDate(complaint.createdAt)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">

                  {/* Assign/Reassign — hidden for Resolved and Closed complaints */}
                  {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setSelectedTechId('');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition hover:opacity-90"
                      style={{ backgroundColor: '#E8A020' }}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {complaint.assignedTo ? t('admin.reassign') : t('admin.assign')}
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(complaint.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>

              {/* Assigned Technician */}
              {complaint.assignedName && (
                <div
                  className="text-xs px-3 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#EEF0F8', color: '#1B2D6B' }}
                >
                  🔧 {t('common.assignedTo')}: <strong>{complaint.assignedName}</strong>
                </div>
              )}

              {/* Technician Notes */}
              {complaint.notes && complaint.notes.length > 0 && (
                <div className="mt-2 rounded-lg p-3 text-xs bg-green-50">
                  <p className="font-bold text-green-800 mb-1">
                    📝 {t('common.techNotes')}:
                  </p>
                  {complaint.notes.map((note, idx) => (
                    <p key={idx} className="text-green-700 mb-0.5">
                      • {note.text}
                      <span className="text-green-500 text-xs">
                        {' '}— {note.by}, {formatDate(note.at)}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          ASSIGN MODAL
          ═══════════════════════════════════════════════════════ */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <div className="flex items-center gap-2 text-white">
                <UserCheck className="w-5 h-5" style={{ color: '#E8A020' }} />
                <h2 className="font-bold text-sm">
                  {selectedComplaint.assignedTo ? t('admin.reassign') : t('admin.assign')} — {t('admin.assignModal')}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-white hover:opacity-70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">

              {/* Complaint Summary */}
              <div
                className="rounded-xl p-4 text-sm"
                style={{ backgroundColor: '#EEF0F8' }}
              >
                <p className="font-bold" style={{ color: '#1B2D6B' }}>
                  {selectedComplaint.category} — {selectedComplaint.location}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {selectedComplaint.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {t('admin.studentLabel')}: {selectedComplaint.studentName}
                </p>
              </div>

              {/* Technician Dropdown */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('admin.selectTech')}
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
                >
                  <option value="">{t('admin.chooseTech')}</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTechId}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#1B2D6B' }}
                >
                  {selectedComplaint?.assignedTo
                    ? t('admin.confirmReassign')
                    : t('admin.confirmAssign')}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;