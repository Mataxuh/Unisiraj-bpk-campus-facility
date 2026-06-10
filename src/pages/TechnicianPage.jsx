// src/pages/TechnicianPage.jsx
// Technician dashboard - manage assigned tasks and update repair status
// Features: stats, filter, update status, add notes, update history
// Role Access: technician only

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/storage';
import {
  Wrench,
  CheckCircle,
  Clock,
  ClipboardList,
  MessageSquarePlus,
  X,
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

const TechnicianPage = () => {
  const { user, getMyAssignedTasks, updateComplaintStatus } = useApp();
  const { t } = useLanguage();

  // ─── State ─────────────────────────────────────────────
  const [filterStatus,  setFilterStatus]  = useState('All');
  const [selectedTask,  setSelectedTask]  = useState(null);
  const [newStatus,     setNewStatus]     = useState('');
  const [techNote,      setTechNote]      = useState('');

  // ─── Get My Assigned Tasks ─────────────────────────────
  const myTasks = getMyAssignedTasks();

  // ─── Filter Tasks by Status ────────────────────────────
  const filteredTasks = myTasks.filter((task) =>
    filterStatus === 'All' || task.status === filterStatus
  );

  // ─── Stats ─────────────────────────────────────────────
  const stats = {
    total:      myTasks.length,
    inProgress: myTasks.filter((t) => t.status === 'In Progress').length,
    resolved:   myTasks.filter((t) => t.status === 'Resolved').length,
  };

  // ─── Handle Status Update ──────────────────────────────
  const handleUpdateStatus = () => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }
    updateComplaintStatus(selectedTask.id, newStatus, techNote.trim());
    setSelectedTask(null);
    setNewStatus('');
    setTechNote('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* ─── Page Header ──────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#1B2D6B' }}>
          {t('technician.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('technician.welcome', { name: user?.name })}
        </p>
      </div>

      {/* ─── Stats Row ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t('technician.totalTasks'), value: stats.total,      icon: <ClipboardList className="w-5 h-5" />, color: '#1B2D6B' },
          { label: t('common.inProgress'),     value: stats.inProgress, icon: <Clock className="w-5 h-5" />,         color: '#2563EB' },
          { label: t('common.resolved'),       value: stats.resolved,   icon: <CheckCircle className="w-5 h-5" />,   color: '#16A34A' },
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

      {/* ─── Filter Buttons ────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-xl border border-gray-100"
        style={{ backgroundColor: '#EEF0F8' }}
      >
        <p className="text-xs font-semibold" style={{ color: '#1B2D6B' }}>
          {t('admin.filterStatus')}:
        </p>
        {['All', 'In Progress', 'Resolved', 'Closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
            style={{
              backgroundColor: filterStatus === status ? '#1B2D6B' : '#fff',
              color:           filterStatus === status ? '#fff'     : '#1B2D6B',
              border:          '1px solid #1B2D6B',
            }}
          >
            {status === 'All'
              ? t('common.all')
              : t(`common.statuses.${status}`) || status}
          </button>
        ))}
        <p className="text-xs text-gray-500 ml-auto">
          {filteredTasks.length} {filteredTasks.length !== 1 ? t('technician.tasks') : t('technician.task')}
        </p>
      </div>

      {/* ─── Tasks List ────────────────────────────────────── */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">
            {myTasks.length === 0
              ? t('technician.noTasks')
              : t('technician.noTasksFilter')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-2">

                {/* Task Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div
                      className="p-1.5 rounded-lg text-white"
                      style={{ backgroundColor: '#1B2D6B' }}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-bold text-gray-800">{task.category}</p>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[task.status]}`}>
                      {t(`common.statuses.${task.status}`) || task.status}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
                      {t(`common.priorities.${task.priority}`) || task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    📍 {task.location} · 👤 {task.studentName}
                    {task.studentMatric && (
                      <span style={{ color: '#1B2D6B' }}> ({task.studentMatric})</span>
                    )}
                    · 🕐 {formatDate(task.createdAt)}
                  </p>
                </div>

                {/* Update Status Button — hidden for Closed tasks */}
                {task.status !== 'Closed' && (
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setNewStatus(task.status);
                      setTechNote('');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: '#E8A020' }}
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    {t('technician.updateStatus')}
                  </button>
                )}
              </div>

              {/* Task Description */}
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>

              {/* Update History — shown when notes exist */}
              {task.notes && task.notes.length > 0 && (
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{ backgroundColor: '#EEF0F8' }}
                >
                  <p className="font-bold mb-2" style={{ color: '#1B2D6B' }}>
                    📝 {t('technician.updateHistory')}:
                  </p>
                  {task.notes.map((note, idx) => (
                    <p key={idx} className="text-gray-700 mb-1">
                      • {note.text}
                      <span className="text-gray-500 text-xs block mt-0.5">
                        — {note.by}, {formatDate(note.at)}
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
          UPDATE STATUS MODAL
          ═══════════════════════════════════════════════════════ */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <div className="flex items-center gap-2 text-white">
                <Wrench className="w-5 h-5" style={{ color: '#E8A020' }} />
                <h2 className="font-bold text-sm">
                  {t('technician.modalTitle')}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-white hover:opacity-70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">

              {/* Task Summary */}
              <div
                className="rounded-xl p-4 text-sm"
                style={{ backgroundColor: '#EEF0F8' }}
              >
                <p className="font-bold" style={{ color: '#1B2D6B' }}>
                  {selectedTask.category} — {selectedTask.location}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {selectedTask.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {t('technician.studentLabel')}: {selectedTask.studentName}
                </p>
              </div>

              {/* Status Dropdown */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('technician.statusLabel')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 transition"
                >
                  {['In Progress', 'Resolved', 'Closed'].map((s) => (
                    <option key={s} value={s}>
                      {t(`common.statuses.${s}`) || s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note Textarea */}
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: '#1B2D6B' }}
                >
                  {t('technician.noteLabel')}{' '}
                  <span className="text-gray-400 font-normal">
                    {t('technician.noteOptional')}
                  </span>
                </label>
                <textarea
                  value={techNote}
                  onChange={(e) => setTechNote(e.target.value)}
                  placeholder={t('technician.notePlaceholder')}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 transition resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1B2D6B' }}
                >
                  {t('technician.saveUpdate')}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TechnicianPage;