import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';

// --- COMPONENT IMPORT DECK ---
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import CalendarNavigation from '../../components/admin/CalendarNavigation';
import CalendarViewports from '../../components/admin/CalendarViewports';
import ControlDrawer from '../../components/admin/ControlDrawer';
import BookingsDatabase from '../../components/admin/BookingsDatabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const userLabel = localStorage.getItem('admin_username') || 'Admin';

  // --- PLATFORM CENTRAL MEMORY ENGINE STATES ---
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState(null);

  // --- VISUAL WINDOW VIEWPORT CONTROLS ---
  const [viewMode, setViewMode] = useState('month'); 
  const [focusedDate, setFocusedDate] = useState('19/05/2026'); 
  const [selectedDatesPool, setSelectedDatesPool] = useState(['19/05/2026']); 
  const [expandedWeekDay, setExpandedWeekDay] = useState(null); 
  const [rescheduleTargetBooking, setRescheduleTargetBooking] = useState(null);

  const CURRENT_YEAR = 2026;
  const TIME_OPTIONS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  
  const MONTHS_MANIFEST = [
    { name: 'January', days: 31, code: '01' }, { name: 'February', days: 28, code: '02' },
    { name: 'March', days: 31, code: '03' }, { name: 'April', days: 30, code: '04' },
    { name: 'May', days: 31, code: '05' }, { name: 'June', days: 30, code: '06' },
    { name: 'July', days: 31, code: '07' }, { name: 'August', days: 31, code: '08' },
    { name: 'September', days: 30, code: '09' }, { name: 'October', days: 31, code: '10' },
    { name: 'November', days: 30, code: '11' }, { name: 'December', days: 31, code: '12' }
  ];

  // --- TIMELINE PURE LOGIC UTILITIES ---
  const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const isPastDate = (dateStr) => {
    return parseDateString(dateStr) < new Date(2026, 4, 19);
  };

  const getDayStatusMetrics = (dateStr) => {
    return {
      hasAvailable: slots.filter(s => s.date_string === dateStr).some(s => !s.is_booked),
      hasBooked: bookings.filter(b => b.date_booked === dateStr && b.status === 'CONFIRMED').length > 0
    };
  };

  // --- GLOBAL BACKEND SYNC FLOW ---
  const syncWorkspaceData = () => {
    fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-dashboard-data/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setSlots(data.slots || []); setBookings(data.bookings || []); setLoading(false); })
      .catch(() => { localStorage.clear(); navigate('/admin/login'); });
  };

  useEffect(() => { if (!token) navigate('/admin/login'); else syncWorkspaceData(); }, [token]);

  // --- TOAST NOTIFICATION HANDLER ---
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  };

  // --- NAVIGATION ACTION CONTROLLER STEPPERS ---
  const handleStepNavigation = (direction) => {
    const [day, month, year] = focusedDate.split('/').map(Number);
    let currentJSDate = new Date(year, month - 1, day);

    if (viewMode === 'day') currentJSDate.setDate(currentJSDate.getDate() + (direction === 'next' ? 1 : -1));
    else if (viewMode === 'week') currentJSDate.setDate(currentJSDate.getDate() + (direction === 'next' ? 7 : -7));
    else if (viewMode === 'month') currentJSDate.setMonth(currentJSDate.getMonth() + (direction === 'next' ? 1 : -1));
    else if (viewMode === 'year') currentJSDate.setFullYear(currentJSDate.getFullYear() + (direction === 'next' ? 1 : -1));

    const nextD = String(currentJSDate.getDate()).padStart(2, '0');
    const nextM = String(currentJSDate.getMonth() + 1).padStart(2, '0');
    const computedStr = `${nextD}/${nextM}/${currentJSDate.getFullYear()}`;

    setFocusedDate(computedStr);
    setSelectedDatesPool([computedStr]);
    setExpandedWeekDay(null);
  };

  const handleDateClick = (dateStr) => {
    setFocusedDate(dateStr);
    if (viewMode === 'month') {
      if (selectedDatesPool.includes(dateStr)) {
        if (selectedDatesPool.length > 1) setSelectedDatesPool(selectedDatesPool.filter(d => d !== dateStr));
      } else {
        setSelectedDatesPool([...selectedDatesPool, dateStr]);
      }
    } else {
      setSelectedDatesPool([dateStr]);
    }
  };

  // --- EVENT CONTROLLERS DISPATCH MUTATORS ---
  const handlePublishSlots = async (selectedTimes, onCompleteCallback, overrideDatesArray = null) => {
    setActionLoading(true);
    const targetedDates = overrideDatesArray || selectedDatesPool;
    
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-slots/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ date_strings: targetedDates, time_strings: selectedTimes })
      });
      if (res.ok) { 
        showToast(`✓ ${selectedTimes.length} time slots added across ${targetedDates.length} date(s)`, 'success');
        if (onCompleteCallback) onCompleteCallback(); 
        syncWorkspaceData(); 
      } else {
        showToast('⚠ Could not add slots. Please try again.', 'error', 4000);
      }
    } catch { 
      showToast('✕ Connection error. Please check your network.', 'error', 4000);
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Permanently remove this slot?")) return;
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-slots-delete/${slotId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        showToast('✓ Slot removed successfully', 'success');
        syncWorkspaceData();
      } else {
        showToast('⚠ Could not remove slot. Please try again.', 'error', 4000);
      }
    } catch { 
      showToast('✕ Connection error while removing slot.', 'error', 4000);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this client session?")) return;
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-cancel/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ booking_id: bookingId })
      });
      if (res.ok) {
        showToast('✓ Session canceled and client notified', 'success');
        syncWorkspaceData();
      } else {
        showToast('⚠ Could not cancel session. Please try again.', 'error', 4000);
      }
    } catch { 
      showToast('✕ Connection error while canceling session.', 'error', 4000);
    }
  };

  const handleExecuteReschedule = async (targetSlotId) => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/booking/admin-reschedule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ booking_id: rescheduleTargetBooking.id, target_slot_id: targetSlotId })
      });
      if (res.ok) { 
        showToast('✓ Session rescheduled and client updated', 'success');
        setRescheduleTargetBooking(null); 
        syncWorkspaceData(); 
      } else {
        showToast('⚠ Could not reschedule. Please try again.', 'error', 4000);
      }
    } catch { 
      showToast('✕ Connection error while rescheduling.', 'error', 4000);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-[#634032] italic">Synchronizing Operational Analytics Workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-[#efe9e4]/30 text-[#634032] font-sans antialiased pb-24">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-sm border text-sm font-light ${
          toast.type === 'success' 
            ? 'bg-[#efe9e4]/95 text-[#634032] border-[#bfa791]/30' 
            : 'bg-[#efe9e4]/95 text-[#634032] border-[#bfa791]/50'
        }`}>
          {toast.message}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-[#bfa791]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif text-sm"><strong className="font-sans text-xs uppercase text-[#a38c77]">{userLabel}</strong>'s Dashboard</span>
        <button onClick={() => { localStorage.clear(); navigate('/admin/login'); }} className="text-xs font-bold uppercase text-red-400">Logout</button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        {/* COMPONENT 1: METRICS PANEL */}
        <AdminAnalytics bookings={bookings} slots={slots} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE STRUCTURAL ZONE */}
          <div className="lg:col-span-7 space-y-4">
            {/* COMPONENT 2: STEPPERS SWITCH CONTROLS */}
            <CalendarNavigation 
              viewMode={viewMode} setViewMode={setViewMode} focusedDate={focusedDate}
              onStep={handleStepNavigation} setExpandedWeekDay={setExpandedWeekDay} setSelectedDatesPool={setSelectedDatesPool}
            />
            {/* COMPONENT 3: VISUAL MATRIX VIEWPORTS */}
            <CalendarViewports 
              viewMode={viewMode} focusedDate={focusedDate} selectedDatesPool={selectedDatesPool}
              slots={slots} bookings={bookings} expandedWeekDay={expandedWeekDay}
              setExpandedWeekDay={setExpandedWeekDay} handleDateClick={handleDateClick}
              isPastDate={isPastDate} getDayStatusMetrics={getDayStatusMetrics}
              TIME_OPTIONS={TIME_OPTIONS} MONTHS_MANIFEST={MONTHS_MANIFEST} CURRENT_YEAR={CURRENT_YEAR}
            />
          </div>

          {/* RIGHT SIDE STRUCTURAL ZONE */}
          <div className="lg:col-span-5">
            {/* COMPONENT 4: EDIT DRAWERS CABINET ACCORDION */}
            <ControlDrawer 
              focusedDate={focusedDate} selectedDatesPool={selectedDatesPool} slots={slots} bookings={bookings}
              actionLoading={actionLoading} rescheduleTargetBooking={rescheduleTargetBooking}
              setRescheduleTargetBooking={setRescheduleTargetBooking} handleCancelBooking={handleCancelBooking}
              handleDeleteSlot={handleDeleteSlot} handlePublishSlots={handlePublishSlots}
              handleExecuteReschedule={handleExecuteReschedule} isPastDate={isPastDate}
              TIME_OPTIONS={TIME_OPTIONS} token={token} syncWorkspaceData={syncWorkspaceData} CONFIG={CONFIG}
              showToast={showToast}
            />
          </div>
        </div>

        {/* COMPONENT 5: COMPREHENSIVE CRM SEARCHABLE MANIFEST JOURNAL */}
        <BookingsDatabase 
          bookings={bookings} isPastDate={isPastDate} 
          handleCancelBooking={handleCancelBooking} setFocusedDate={setFocusedDate} 
        />
      </div>
    </div>
  );
}