import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';

// --- COMPONENT IMPORT DECK ---
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import CalendarNavigation from '../../components/admin/CalendarNavigation';
import CalendarViewports from '../../components/admin/CalendarViewports';
import ControlDrawer from '../../components/admin/ControlDrawer';
import BookingsDatabase from '../../components/admin/BookingsDatabase';
import Home from '../client/Home';
import Book from '../client/Booking';

// HELPER UTIL: Dynamically captures the active current day in the local DD/MM/YYYY format
const getTodayString = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const userLabel = localStorage.getItem('admin_username') || 'Admin';

  const [activeSubPage, setActiveSubPage] = useState('calendar');

  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [viewMode, setViewMode] = useState('month'); 
  
  // FIXED: Defaults calendar to current local time, and starts with no dates highlighted or pre-selected
  const [focusedDate, setFocusedDate] = useState(getTodayString()); 
  const [selectedDatesPool, setSelectedDatesPool] = useState([]); 
  
  const [expandedWeekDay, setExpandedWeekDay] = useState(null); 
  const [rescheduleTargetBooking, setRescheduleTargetBooking] = useState(null);

  const CURRENT_YEAR = new Date().getFullYear();
  const TIME_OPTIONS = [
    '09:00 AM', '10:15 AM', '11:30 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'
  ];

  const MONTHS_MANIFEST = [
    { name: 'January', code: '01', days: 31 }, { name: 'February', code: '02', days: 28 },
    { name: 'March', code: '03', days: 31 }, { name: 'April', code: '04', days: 30 },
    { name: 'May', code: '05', days: 31 }, { name: 'June', code: '06', days: 30 },
    { name: 'July', code: '07', days: 31 }, { name: 'August', code: '08', days: 31 },
    { name: 'September', code: '09', days: 30 }, { name: 'October', code: '10', days: 31 },
    { name: 'November', code: '11', days: 30 }, { name: 'December', code: '12', days: 31 }
  ];

  const [sessionPrice, setSessionPrice] = useState('25000');
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    syncWorkspaceData();
    fetchSystemConfigurations();
  }, [token]);

  const showToast = (msg, type = 'success') => {
    setToast({ text: msg, variant: type });
    setTimeout(() => setToast(null), 4000);
  };

  // FIXED: Cleaned up trailing slashes and removed redundant '/api/booking' paths across all fetches
  const syncWorkspaceData = async () => {
    try {
      setLoading(true);
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, ""); 
      const res = await fetch(`${baseUrl}/admin-dashboard-data/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if(res.ok) {
         const data = await res.json();
         setSlots(data.slots || []);
         setBookings(data.bookings || []);
      }
    } catch (err) {
      showToast('Network synchronization error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemConfigurations = async () => {
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/config/`);
      if (res.ok) {
        const data = await res.json();
        if (data.session_price) setSessionPrice(data.session_price);
        if (data.site_content) setSiteContent(data.site_content);
      }
    } catch (err) {
      console.error('System settings fetch unfulfilled.');
    }
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/config/update-price/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ price: sessionPrice })
      });
      if (res.ok) {
        showToast('Pricing adjustments successfully updated.');
        fetchSystemConfigurations();
      } else {
        showToast('Unable to complete pricing update.', 'error');
      }
    } catch (err) {
      showToast('Connection target unreachable.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/config/update-content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ site_content: siteContent })
      });
      if (res.ok) {
        showToast('Website copy modifications updated successfully.');
        fetchSystemConfigurations(); 
      } else {
        showToast('Unable to complete content update.', 'error');
      }
    } catch (err) {
      showToast('Connection target unreachable.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDateClick = (dateStr) => {
    setFocusedDate(dateStr);
    setExpandedWeekDay(null);
    if (selectedDatesPool.includes(dateStr)) {
      setSelectedDatesPool(selectedDatesPool.filter(d => d !== dateStr));
    } else {
      setSelectedDatesPool([...selectedDatesPool, dateStr]);
    }
  };

  const onStep = (direction) => {
    if (!focusedDate) return;
    const [d, m, y] = focusedDate.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    
    if (viewMode === 'day') date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    if (viewMode === 'week') date.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
    if (viewMode === 'month') date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));

    const pad = (n) => String(n).padStart(2, '0');
    const newStr = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    setFocusedDate(newStr);
    setSelectedDatesPool([newStr]);
  };

  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const [d, m, y] = dateStr.split('/').map(Number);
    const target = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0,0,0,0);
    return target < today;
  };

  const getDayStatusMetrics = (dateStr) => {
    const daySlots = slots.filter(s => s.date_string === dateStr);
    const dayBookings = bookings.filter(b => b.date_booked === dateStr && b.status === 'CONFIRMED');
    return {
      capacity: daySlots.length,
      claimed: dayBookings.length,
      hasAvailable: daySlots.some(s => !s.is_booked),
      hasBooked: dayBookings.length > 0
    };
  };

 const handlePublishSlots = async (payload) => {
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/admin-slots/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Token ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Time slots successfully generated and published.');
        syncWorkspaceData(); // Refresh calendar viewports instantly
      } else {
        showToast('Could not complete slot creation.', 'error');
      }
    } catch (err) {
      showToast('Network connection timeout.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/admin-slots-delete/${slotId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        showToast('Selected time slot removed.');
        syncWorkspaceData();
      } else {
        showToast('Unable to drop target slot.', 'error');
      }
    } catch (err) {
      showToast('Network synchronization failure.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/admin-cancel/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Token ${token}` 
        },
        body: JSON.stringify({ booking_id: bookingId })
      });
      if (res.ok) {
        showToast('Reservation status flagged as cancelled.');
        syncWorkspaceData();
      } else {
        showToast('Cancellation update unfulfilled.', 'error');
      }
    } catch (err) {
      showToast('Server connection lost.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteReschedule = async (bookingId, newDate, newTime) => {
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/admin-reschedule/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Token ${token}` 
        },
        body: JSON.stringify({ 
          booking_id: bookingId, 
          new_date: newDate, 
          new_time: newTime 
        })
      });
      if (res.ok) {
        showToast('Client appointment shifted successfully.');
        setRescheduleTargetBooking(null); // Close active target state
        syncWorkspaceData();
      } else {
        showToast('Reschedule processing error.', 'error');
      }
    } catch (err) {
      showToast('Target host unreachable.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efe9e4]/20 flex flex-col antialiased font-sans text-gray-800 selection:bg-[#efe9e4]">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-sm border shadow-sm ${toast.variant === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          {toast.text}
        </div>
      )}

      <header className="bg-white border-b border-[#bfa791]/15 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-[#634032]" />
          <h1 className="font-serif text-md uppercase tracking-widest text-[#634032]">Management Workspace</h1>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">Authenticated // {userLabel}</span>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[10px] uppercase tracking-widest font-semibold text-red-700 hover:text-red-900 transition-colors cursor-pointer">Sign Out</button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-60 bg-white border-r border-[#bfa791]/15 p-5 flex flex-col space-y-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#a38c77] font-bold px-3 mb-3 block">Navigation</span>
          
          <button 
            onClick={() => setActiveSubPage('calendar')}
            className={`w-full text-left px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-all rounded-xs cursor-pointer flex items-center justify-between ${activeSubPage === 'calendar' ? 'bg-[#634032] text-white' : 'text-[#634032]/70 hover:bg-[#efe9e4]/30 hover:text-[#634032]'}`}
          >
            <span>Calendar View</span>
            <span className="font-mono text-[9px] opacity-50">[{slots.length}]</span>
          </button>

          <button 
            onClick={() => setActiveSubPage('pricing')}
            className={`w-full text-left px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-all rounded-xs cursor-pointer ${activeSubPage === 'pricing' ? 'bg-[#634032] text-white' : 'text-[#634032]/70 hover:bg-[#efe9e4]/30 hover:text-[#634032]'}`}
          >
            Pricing Control
          </button>

          <button 
            onClick={() => setActiveSubPage('content')}
            className={`w-full text-left px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-all rounded-xs cursor-pointer ${activeSubPage === 'content' ? 'bg-[#634032] text-white' : 'text-[#634032]/70 hover:bg-[#efe9e4]/30 hover:text-[#634032]'}`}
          >
            Editorial System
          </button>
        </aside>

        <main className="flex-1 p-8 overflow-x-hidden">
          
          {activeSubPage === 'calendar' && (
            <div className="space-y-6">
              <AdminAnalytics slots={slots} bookings={bookings} />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <CalendarNavigation 
                    viewMode={viewMode} setViewMode={setViewMode} focusedDate={focusedDate}
                    onStep={onStep} setExpandedWeekDay={setExpandedWeekDay} setSelectedDatesPool={setSelectedDatesPool}
                  />
                  <CalendarViewports 
                    viewMode={viewMode} focusedDate={focusedDate} selectedDatesPool={selectedDatesPool}
                    slots={slots} bookings={bookings} expandedWeekDay={expandedWeekDay}
                    setExpandedWeekDay={setExpandedWeekDay} handleDateClick={handleDateClick}
                    isPastDate={isPastDate} getDayStatusMetrics={getDayStatusMetrics}
                    TIME_OPTIONS={TIME_OPTIONS} MONTHS_MANIFEST={MONTHS_MANIFEST} CURRENT_YEAR={CURRENT_YEAR}
                  />
                </div>
                <div className="lg:col-span-5">
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

              <BookingsDatabase 
                bookings={bookings} isPastDate={isPastDate} 
                handleCancelBooking={handleCancelBooking} setFocusedDate={setFocusedDate} 
              />
            </div>
          )}

          {activeSubPage === 'pricing' && (
            <div className="max-w-md bg-white border border-[#bfa791]/20 p-6 rounded-xs shadow-2xs space-y-4">
              <div>
                <h3 className="font-serif text-md text-[#634032] uppercase tracking-wide">Base Service Fee</h3>
                <p className="text-[11px] text-[#a38c77]">Set the default flat currency value charged for private client consultations.</p>
              </div>
              <form onSubmit={handleSavePricing} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Session Rate</label>
                  <input 
                    type="number" value={sessionPrice} 
                    onChange={(e) => setSessionPrice(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xs px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:border-[#634032]" 
                    required
                  />
                </div>
                <button 
                  type="submit" disabled={actionLoading}
                  className="bg-[#634032] text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-2xs hover:bg-[#a38c77] transition-all cursor-pointer disabled:opacity-40"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeSubPage === 'content' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#bfa791]/20 p-4 rounded-xs flex justify-between items-center shadow-xs">
                <h3 className="font-serif text-md text-[#634032] uppercase tracking-wide">Editorial System</h3>
                <button 
                  onClick={handleSaveContent} 
                  disabled={actionLoading}
                  className="bg-[#634032] text-white text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-2xs hover:bg-[#a38c77] transition-all cursor-pointer disabled:opacity-40 shadow-xs font-semibold"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="border border-[#bfa791]/20 rounded-sm bg-white overflow-hidden shadow-2xs p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="space-y-8 pointer-events-auto">
                  <div>
                    <Home 
                      inlineEditMode={true}
                      externalState={siteContent}
                      setExternalState={setSiteContent}
                    />
                  </div>
                  <div className="pt-8 border-t border-gray-200">
                    <Book 
                      inlineEditMode={true}
                      externalState={siteContent}
                      setExternalState={setSiteContent}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}