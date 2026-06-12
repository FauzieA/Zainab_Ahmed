import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';

// --- COMPONENT IMPORT DECK ---
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import CalendarNavigation from '../../components/admin/CalendarNavigation';
import CalendarViewports from '../../components/admin/CalendarViewports';
import ControlDrawer from '../../components/admin/ControlDrawer';
import BookingsDatabase from '../../components/admin/BookingsDatabase';

// Public Playground Client Context Canvas Modules
import Home from '../client/Home';
import Book from '../client/Booking';
import Resources from '../client/Resources'; 
import About from '../client/About';
import Contact from '../client/Contact';
import Consultation from '../client/Consultation';

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
  const [focusedDate, setFocusedDate] = useState(getTodayString()); 
  const [selectedDatesPool, setSelectedDatesPool] = useState([]); 
  const [expandedWeekDay, setExpandedWeekDay] = useState(null); 
  const [rescheduleTargetBooking, setRescheduleTargetBooking] = useState(null);

  const CURRENT_YEAR = new Date().getFullYear();
  const TIME_OPTIONS = ['09:00 AM', '10:15 AM', '11:30 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'];

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
  const [newBook, setNewBook] = useState({ title: '', subtitle: '', downloadUrl: '', coverImage: '' });

  useEffect(() => {
    if (!token) {
      handleAuthFailure();
      return;
    }
    syncWorkspaceData();
    fetchSystemConfigurations();
  }, [token]);

  const showToast = (msg, type = 'success') => {
    setToast({ text: msg, variant: type });
    setTimeout(() => setToast(null), 4000);
  };

  // 🛡️ Centralized Session Invalidation Handler
  const handleAuthFailure = () => {
    showToast('Session context expired. Re-authenticating...', 'error');
    localStorage.clear();
    setTimeout(() => {
      navigate('/admin/login');
    }, 1500);
  };

  const syncWorkspaceData = async () => {
    try {
      setLoading(true);
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, ""); 
      const res = await fetch(`${baseUrl}/admin-dashboard-data/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
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
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
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
    if (e && e.preventDefault) e.preventDefault();
    setActionLoading(true);
    try {
      const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/config/update-content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ site_content: siteContent })
      });
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
      if (res.ok) {
        showToast('Website content state successfully saved.');
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

  const cleanImageLink = (url) => {
    if (!url) return '';
    let clean = url.trim();
    if (clean.includes('postimg.cc/')) {
      clean = clean.replace('postimg.cc/', 'i.postimg.cc/') + '.png';
      clean = clean.replace(/\.cc\/([a-zA-Z0-9]+)$/, '.cc/$1'); 
    }
    return clean;
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.subtitle.trim() || !newBook.downloadUrl.trim() || !newBook.coverImage.trim()) {
      showToast('All fields (including the Cover Image) are mandatory.', 'error');
      return;
    }

    const clearCoverUrl = cleanImageLink(newBook.coverImage);
    const currentBooks = siteContent.libraryBooks || [];
    const updatedBooks = [...currentBooks, { 
      ...newBook, 
      coverImage: clearCoverUrl,
      id: `book_${Date.now()}` 
    }];
    
    setSiteContent({ ...siteContent, libraryBooks: updatedBooks });
    setNewBook({ title: '', subtitle: '', downloadUrl: '', coverImage: '' });
    showToast('Book staged. Remember to click "Commit Library Updates" above to save permanently.', 'success');
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to completely remove this book from the public library?")) {
      const currentBooks = siteContent.libraryBooks || [];
      const updatedBooks = currentBooks.filter(b => b.id !== bookId);
      setSiteContent({ ...siteContent, libraryBooks: updatedBooks });
      showToast('Book removed. Click "Commit Library Updates" to save permanently.', 'success');
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

  const handlePublishSlots = async (timesArray, onSuccess, datesArray) => {
    setActionLoading(true); 
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin-slots/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          date_strings: datesArray,  
          time_strings: timesArray   
        })
      });
      if (response.status === 401) {
        handleAuthFailure();
        return;
      }
      if (response.ok) {
        showToast("✓ Time slots added!", "success");
        if (onSuccess) onSuccess(); 
        syncWorkspaceData();        
      } else {
        const err = await response.json();
        showToast(`⚠ ${err.error || 'Could not complete slot creation.'}`, "error");
      }
    } catch (error) {
      showToast("✕ Network error while creating slots.", "error");
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
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
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
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
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
      if (res.status === 401) {
        handleAuthFailure();
        return;
      }
      if (res.ok) {
        showToast('Client appointment shifted successfully.');
        setRescheduleTargetBooking(null); 
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

  const isFormInvalid = !newBook.title.trim() || !newBook.subtitle.trim() || !newBook.downloadUrl.trim() || !newBook.coverImage.trim();

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
          <h1 className="font-serif text-md uppercase tracking-widest text-[#634032]">Consultant Dashboard</h1>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400">Logged in as {userLabel}</span>
          <button onClick={() => { localStorage.clear(); navigate('/admin/login'); }} className="text-[10px] uppercase tracking-widest font-semibold text-red-700 hover:text-red-900 transition-colors cursor-pointer">Sign Out</button>
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
            Session Price
          </button>

          <button 
            onClick={() => setActiveSubPage('content')}
            className={`w-full text-left px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-all rounded-xs cursor-pointer ${activeSubPage === 'content' ? 'bg-[#634032] text-white' : 'text-[#634032]/70 hover:bg-[#efe9e4]/30 hover:text-[#634032]'}`}
          >
            Edit Website Text
          </button>

          <button 
            onClick={() => setActiveSubPage('library')}
            className={`w-full text-left px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-all rounded-xs cursor-pointer ${activeSubPage === 'library' ? 'bg-[#634032] text-white' : 'text-[#634032]/70 hover:bg-[#efe9e4]/30 hover:text-[#634032]'}`}
          >
            Manage Library
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
                <h3 className="font-serif text-md text-[#634032] uppercase tracking-wide">Session Price</h3>
                <p className="text-[11px] text-[#a38c77]">Set the default flat currency value charged for consultations.</p>
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
                <div>
                  <h3 className="font-serif text-md text-[#634032] uppercase tracking-wide">Edit Website Text</h3>
                  <p className="text-[10px] text-[#a38c77] font-mono">Scroll down through the viewports below to review or directly tweak active layout headings.</p>
                </div>
                <button 
                  onClick={handleSaveContent} 
                  disabled={actionLoading}
                  className="bg-[#634032] text-white text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-2xs hover:bg-[#a38c77] transition-all cursor-pointer disabled:opacity-40 shadow-xs font-semibold"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="border border-[#bfa791]/20 rounded-sm bg-white overflow-hidden shadow-2xs p-4 h-[calc(100vh-280px)] overflow-y-auto">
                <div className="space-y-12 pointer-events-auto pb-20">
                  <div className="border-b border-[#bfa791]/10 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">1. Home Page Viewport Section</span>
                    <Home inlineEditMode={true} externalState={siteContent} setExternalState={setSiteContent} />
                  </div>
                  
                  <div className="border-b border-[#bfa791]/10 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">2. Booking Calendar Base Section</span>
                    <Book inlineEditMode={true} externalState={siteContent} setExternalState={setSiteContent} />
                  </div>

                  <div className="border-b border-[#bfa791]/10 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">3. Consultation Pricing Landing Page</span>
                    <Consultation inlineEditMode={true} externalState={siteContent} setExternalState={setSiteContent} />
                  </div>

                  <div className="border-b border-[#bfa791]/10 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">4. About Biography Section</span>
                    <About inlineEditMode={true} externalState={siteContent} setExternalState={setSiteContent} />
                  </div>

                  <div className="border-b border-[#bfa791]/10 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">5. Contact Channels / Inquiries</span>
                    <Contact inlineEditMode={true} externalState={siteContent} setExternalState={setSiteContent} />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-1 mb-4 inline-block font-bold">6. Dynamic Literature Resources Grid</span>
                    <Resources liveContent={siteContent} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubPage === 'library' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#bfa791]/20 p-4 rounded-xs flex justify-between items-center shadow-xs">
                <div>
                  <h3 className="font-serif text-md text-[#634032] uppercase tracking-wide">Digital Resource Management</h3>
                  <p className="text-[10px] text-[#a38c77] font-mono mt-0.5">Append or drop downloadable digital books across user viewports.</p>
                </div>
                <button 
                  onClick={handleSaveContent} 
                  disabled={actionLoading}
                  className="bg-[#634032] text-white text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-2xs hover:bg-[#a38c77] transition-all cursor-pointer disabled:opacity-40 shadow-xs font-semibold"
                >
                  {actionLoading ? 'Publishing...' : 'Commit Library Updates'}
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-5 bg-white border border-[#bfa791]/20 p-6 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a38c77]">Current Catalog</p>
                    {(!siteContent.libraryBooks || siteContent.libraryBooks.length === 0) ? (
                      <p className="text-xs italic text-gray-400 py-2">No active dynamic library items logged yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {siteContent.libraryBooks.map(book => (
                          <div key={book.id} className="flex justify-between items-center bg-[#efe9e4]/20 p-2.5 border border-gray-100">
                            <div className="truncate pr-2">
                              <p className="font-bold uppercase tracking-wide text-[10px] text-[#634032] truncate">{book.title}</p>
                              <p className="text-[9px] text-[#a38c77] font-serif italic truncate">{book.subtitle || 'No subtitle provided'}</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteBook(book.id)} 
                              className="text-red-600 hover:text-red-800 font-mono text-[9px] uppercase tracking-wider font-bold px-2 cursor-pointer flex-shrink-0"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAddBook} className="space-y-4 border-t border-[#bfa791]/10 pt-4">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#a38c77]">📖 Add New E-Book Record</p>
                    
                    <div className="space-y-3 text-xs text-[#634032]">
                      <div>
                        <label className="block text-[9px] font-bold tracking-wider uppercase mb-1">Book Title *</label>
                        <input 
                          type="text" required value={newBook.title}
                          onChange={e => setNewBook({...newBook, title: e.target.value.toUpperCase()})}
                          className="w-full bg-gray-50/50 border border-gray-200 p-2 outline-none text-xs focus:border-[#634032]"
                          placeholder="THE PEACEFUL BLUEPRINT"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold tracking-wider uppercase mb-1">Subtitle / Short Blurb *</label>
                        <textarea 
                          rows="2" required value={newBook.subtitle}
                          onChange={e => setNewBook({...newBook, subtitle: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 p-2 outline-none text-xs resize-none focus:border-[#634032]"
                          placeholder="Navigating early childhood tantrums safely..."
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold tracking-wider uppercase mb-1">Download URL Link *</label>
                        <input 
                          type="text" required value={newBook.downloadUrl}
                          onChange={e => setNewBook({...newBook, downloadUrl: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 p-2 outline-none text-xs font-mono text-[11px] focus:border-[#634032]"
                          placeholder="https://your-storage.com/files/book.pdf"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold tracking-wider uppercase mb-1">Cover Image Link *</label>
                        <input 
                          type="text" required value={newBook.coverImage}
                          onChange={e => setNewBook({...newBook, coverImage: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 p-2 outline-none text-xs font-mono text-[11px] focus:border-[#634032]"
                          placeholder="https://postimg.cc/GBvfN2qk"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isFormInvalid}
                      className="w-full bg-[#634032] text-white py-2 text-[10px] uppercase font-mono tracking-widest hover:bg-[#a38c77] transition-all duration-300 rounded-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      + Stage Book Object
                    </button>
                  </form>
                </div>

                <div className="xl:col-span-7 border border-[#bfa791]/20 bg-white rounded-xs overflow-hidden shadow-2xs max-h-[calc(100vh-300px)] overflow-y-auto">
                  <div className="p-2 bg-gray-50 text-[9px] font-mono uppercase tracking-widest text-[#a38c77] border-b border-[#bfa791]/10 text-center">
                    ✨ Live Playground Layout Canvas Preview
                  </div>
                  <div className="pointer-events-none scale-95 origin-top transition-all">
                    <Resources liveContent={siteContent} />
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