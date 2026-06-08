import React, { useState } from 'react';

export default function ControlDrawer({ 
  focusedDate, selectedDatesPool, slots, bookings, actionLoading, rescheduleTargetBooking,
  setRescheduleTargetBooking, handleCancelBooking, handleDeleteSlot, handlePublishSlots,
  handleExecuteReschedule, isPastDate, TIME_OPTIONS, token, syncWorkspaceData, CONFIG, showToast
}) {
  
  const [panelActionTab, setPanelActionTab] = useState('publish'); // 'publish' | 'manual' | 'blackout'
  
  // --- STATE FOR BATCH CREATION (ADD SLOTS) ---
  const [publishMode, setPublishMode] = useState('selection'); // 'selection' | 'range' | 'recurring'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]); // 0=Sun, 1=Mon, etc.
  const [selectedTimes, setSelectedTimes] = useState([]);

  // --- STATE FOR MANUAL RESERVATIONS ---
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [intakeNotes, setIntakeNotes] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('WEEKLY'); // 'WEEKLY' | 'MONTHLY'
  const [recurringCount, setRecurringCount] = useState(4);

  const isAnyDateInPast = selectedDatesPool.some(d => isPastDate(d));

  const DAYS_OF_WEEK = [
    { label: 'S', value: 0 }, { label: 'M', value: 1 }, { label: 'T', value: 2 },
    { label: 'W', value: 3 }, { label: 'T', value: 4 }, { label: 'F', value: 5 }, { label: 'S', value: 6 }
  ];

  // Helper to safely format JS Date object back to our backend 'DD/MM/YYYY' string format
  const formatJSDate = (dateObj) => {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${dateObj.getFullYear()}`;
  };

  // --- CLIENT-SIDE ENGINE FOR BULK SLOT PATTERNS ---
  const executePatternPublish = async (e) => {
    e.preventDefault();
    if (selectedTimes.length === 0) {
      showToast("Please select at least one time slot.", "error", 3000);
      return;
    }

    let finalDatesArray = [];

    if (publishMode === 'selection') {
      finalDatesArray = [...selectedDatesPool];
    } else if (publishMode === 'range' || publishMode === 'recurring') {
      if (!startDate || !endDate) {
        showToast("Please select both start and end date boundaries.", "error", 3000);
        return;
      }
      
      const current = new Date(startDate);
      const boundaryEnd = new Date(endDate);

      if (current > boundaryEnd) {
        showToast("Start date cannot be after end date.", "error", 3000);
        return;
      }

      // Loop through date sequence parameters
      while (current <= boundaryEnd) {
        const currentDayIndex = current.getDay();
        const currentCalendarDate = current.getDate();

        if (publishMode === 'range') {
          // Add every single day inside the range parameter boundary
          finalDatesArray.push(formatJSDate(current));
        } else if (publishMode === 'recurring') {
          // Check if specific day-of-week criteria filters apply
          if (selectedDaysOfWeek.length > 0 && selectedDaysOfWeek.includes(currentDayIndex)) {
            finalDatesArray.push(formatJSDate(current));
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    // Secondary validation rule to prevent historically broken entries
    const containsPastDate = finalDatesArray.some(d => isPastDate(d));
    if (containsPastDate) {
      showToast("The pattern contains past dates. Adjust boundaries to upcoming options.", "error", 4000);
      return;
    }

    if (finalDatesArray.length === 0) {
      showToast("No calendar days matched your pattern rules.", "error", 3000);
      return;
    }

    // Direct invocation to main dispatcher action
    // We mock-pass an action callback reset handler to clear selections cleanly
    handlePublishSlots(selectedTimes, () => {
      setSelectedTimes([]);
      setStartDate('');
      setEndDate('');
      setSelectedDaysOfWeek([]);
    }, finalDatesArray);
  };

  // --- SUBMIT COMPREHENSIVE DIRECT RESERVATION CRM DATA ---
 // --- SUBMIT COMPREHENSIVE DIRECT RESERVATION CRM DATA ---
  const submitManualBookingForm = async (e) => {
    e.preventDefault();
    if (!clientEmail || !manualTime) {
      showToast("Please fill in all required fields.", "error", 3000);
      return;
    }

    try {
      // FIXED: Removed duplicate '/api/booking' from endpoint string
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin-manual-reserve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        // FIXED: Re-mapped payloads keys to match Django's exact inputs
        body: JSON.stringify({
          date: focusedDate,
          time: manualTime,
          email: clientEmail,
          client_name: clientName,
          client_phone: clientPhone,
          child_name: childName,
          child_age: childAge,
          intake_notes: intakeNotes,
          is_recurring: isRecurring,
          recurring_frequency: recurringFrequency,
          recurring_count: Number(recurringCount)
        })
      });
      if (response.ok) {
        showToast("✓ Appointment successfully reserved", "success");
        setClientEmail(''); setClientName(''); setClientPhone(''); setChildName(''); setChildAge(''); setIntakeNotes(''); setManualTime('');
        syncWorkspaceData();
      } else {
        const err = await response.json();
        showToast(`⚠ ${err.error || 'Time slot already taken.'}`, "error", 4000);
      }
    } catch {
      showToast("✕ Network error. Please check your connection.", "error", 4000);
    }
  };

  const submitDayBlackout = async () => {
    if (!window.confirm(`Block all bookings for: ${selectedDatesPool.join(', ')}?`)) return;
    try {
      // FIXED: Removed duplicate '/api/booking' path segment
      const res = await fetch(`${CONFIG.API_BASE_URL}/admin-blackout-dates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ dates: selectedDatesPool })
      });
      if (res.ok) {
        showToast(`✓ ${selectedDatesPool.length} date(s) blocked successfully`, "success");
        syncWorkspaceData();
      } else {
        showToast("⚠ Could not block dates. Please try again.", "error", 4000);
      }
    } catch {
      showToast("✕ Network error while blocking dates.", "error", 4000);
    }
  };

  const toggleDayOfWeekSelection = (val) => {
    if (selectedDaysOfWeek.includes(val)) {
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter(x => x !== val));
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, val]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* PANEL 1: AUDIT COMBINED POOL SELECTION TIMELINES */}
      <div className="bg-white border border-[#bfa791]/20 p-6 rounded-sm shadow-2xs">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-serif text-base font-normal">Selected Slots Detail</h3>
          <span className="text-[10px] font-mono bg-[#efe9e4] px-2 py-0.5 text-[#634032] rounded-xs font-bold">
            {selectedDatesPool.length} Day(s) Selected
          </span>
        </div>
        <p className="text-[11px] text-[#a38c77] mb-4">Reviewing available openings and bookings for your active selection pool.</p>
        <div className="w-full h-[1px] bg-[#bfa791]/15 mb-4"></div>

        {rescheduleTargetBooking && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xs text-xs mb-4 text-amber-800 flex justify-between items-center">
            <span>Moving <strong>{rescheduleTargetBooking.client_email}</strong></span>
            <button onClick={() => setRescheduleTargetBooking(null)} className="underline font-bold text-[10px]">Cancel</button>
          </div>
        )}

        <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
          {selectedDatesPool.map((dateStr) => {
            const dateSlots = slots.filter(s => s.date_string === dateStr);
            const dateBookings = bookings.filter(b => b.date_booked === dateStr);

            if (dateSlots.length === 0) return null;

            return (
              <div key={dateStr} className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#a38c77] bg-[#efe9e4]/30 px-2 py-0.5 rounded-xs">
                  {dateStr} {isPastDate(dateStr) && ' (Past Date)'}
                </div>
                
                {dateSlots.map((slot) => {
                  const linkedBooking = dateBookings.find(b => b.time_booked === slot.time_string && b.status === 'CONFIRMED');

                  return (
                    <div key={slot.id} className={`border p-2.5 rounded-xs flex flex-col justify-between gap-1.5 text-xs bg-white ${slot.is_booked ? 'border-emerald-100 bg-emerald-50/5' : 'border-gray-100'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold font-mono text-[#634032]">{slot.time_string}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${slot.is_booked ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500'}`}>
                          {slot.is_booked ? 'Booked' : 'Open Slot'}
                        </span>
                      </div>

                      {linkedBooking && (
                        <div className="text-[11px] space-y-1 text-gray-600 border-t border-gray-50 pt-1.5">
                          <p className="break-all font-medium text-[#634032]">{linkedBooking.client_name || linkedBooking.client_email}</p>
                          {!isPastDate(dateStr) && (
                            <div className="flex space-x-2 pt-0.5">
                              <button type="button" onClick={() => handleCancelBooking(linkedBooking.id)} className="text-[10px] text-red-500 hover:underline">Cancel Appointment</button>
                              <button type="button" onClick={() => setRescheduleTargetBooking(linkedBooking)} className="text-[10px] text-amber-600 hover:underline">Reschedule</button>
                            </div>
                          )}
                        </div>
                      )}

                      {!slot.is_booked && !isPastDate(dateStr) && (
                        <div className="flex justify-end border-t border-gray-50 pt-1.5">
                          {rescheduleTargetBooking ? (
                            <button type="button" onClick={() => handleExecuteReschedule(slot.id)} className="bg-emerald-600 text-white px-2 py-0.5 text-[10px] rounded-xs">Move Appointment Here</button>
                          ) : (
                            <button type="button" onClick={() => handleDeleteSlot(slot.id)} className="text-[10px] text-red-400 hover:text-red-600">Remove Slot</button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {selectedDatesPool.every(d => slots.filter(s => s.date_string === d).length === 0) && (
            <p className="text-xs italic text-[#bfa791]/60 py-6 text-center">No time slots are configured for the selected date(s).</p>
          )}
        </div>
      </div>

      {/* PANEL 2: OPTION PILLS CABINET PANEL */}
      <div className="bg-white border border-[#bfa791]/20 p-6 rounded-sm space-y-5">
        
        <div className="flex bg-[#efe9e4]/40 p-1 rounded-sm gap-1 border border-[#bfa791]/10 text-[11px] font-semibold">
          <button 
            type="button" onClick={() => setPanelActionTab('publish')} 
            className={`flex-1 text-center py-1.5 rounded-xs transition-all ${panelActionTab === 'publish' ? 'bg-[#634032] text-white shadow-xs' : 'text-[#634032]/60 hover:text-[#634032]'}`}
          >
            Add Slots
          </button>
          <button 
            type="button" onClick={() => setPanelActionTab('manual')} 
            className={`flex-1 text-center py-1.5 rounded-xs transition-all ${panelActionTab === 'manual' ? 'bg-[#634032] text-white shadow-xs' : 'text-[#634032]/60 hover:text-[#634032]'}`}
          >
            Reserve Custom
          </button>
          <button 
            type="button" onClick={() => setPanelActionTab('blackout')} 
            className={`flex-1 text-center py-1.5 rounded-xs transition-all ${panelActionTab === 'blackout' ? 'bg-red-600 text-white shadow-xs' : 'text-red-600/60 hover:text-red-600'}`}
          >
            Block Dates
          </button>
        </div>

        {/* CONTENT A: PATTERN RECOVERY SLOT GENERATOR */}
        {panelActionTab === 'publish' && (
          <form onSubmit={executePatternPublish} className="space-y-4">
            
            {/* SUB-PILL PATTERN FILTERS */}
            <div className="flex border-b border-gray-100 pb-2 gap-4 text-[10px] uppercase font-bold tracking-wider text-gray-400">
              <button type="button" onClick={() => setPublishMode('selection')} className={publishMode === 'selection' ? 'text-[#634032] border-b border-[#634032]' : ''}>Active Highlights</button>
              <button type="button" onClick={() => setPublishMode('range')} className={publishMode === 'range' ? 'text-[#634032] border-b border-[#634032]' : ''}>Continuous Range</button>
              <button type="button" onClick={() => setPublishMode('recurring')} className={publishMode === 'recurring' ? 'text-[#634032] border-b border-[#634032]' : ''}>Weekly Cadence</button>
            </div>

            {publishMode === 'selection' && (
              <p className="text-[11px] text-[#a38c77]">Opening hours across all ({selectedDatesPool.length}) highlighted calendar coordinates.</p>
            )}

            {(publishMode === 'range' || publishMode === 'recurring') && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] uppercase text-[#a38c77] font-medium block mb-1">From Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border p-1.5 bg-white rounded-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#a38c77] font-medium block mb-1">To Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border p-1.5 bg-white rounded-xs" />
                  </div>
                </div>

                {publishMode === 'recurring' && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] uppercase text-[#a38c77] font-medium block">Filter to Days of Week</label>
                    <div className="flex gap-1">
                      {DAYS_OF_WEEK.map(d => {
                        const active = selectedDaysOfWeek.includes(d.value);
                        return (
                          <button
                            type="button" key={d.value} onClick={() => toggleDayOfWeekSelection(d.value)}
                            className={`w-7 h-7 text-xs font-bold rounded-xs border transition-all ${active ? 'bg-[#634032] text-white border-[#634032]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="w-full h-[1px] bg-gray-50 my-2"></div>

            <div className="grid grid-cols-2 gap-1.5">
              {TIME_OPTIONS.map(t => {
                const isChecked = selectedTimes.includes(t);
                return (
                  <button
                    key={t} type="button"
                    onClick={() => setSelectedTimes(isChecked ? selectedTimes.filter(x => x !== t) : [...selectedTimes, t])}
                    className={`py-1.5 px-2 border text-left text-[11px] font-mono rounded-xs flex justify-between items-center transition-all ${isChecked ? 'border-[#634032] bg-[#634032]/5 text-[#634032] font-bold' : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <button type="submit" disabled={actionLoading} className="w-full bg-[#634032] text-white py-2 text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#a38c77] transition-colors cursor-pointer">
              Deploy Specified Strategy
            </button>
          </form>
        )}

        {/* CONTENT B: CUSTOM INDIVIDUAL RESERVATION (MULTIMODAL RECURRING) */}
        {panelActionTab === 'manual' && (
          <form onSubmit={submitManualBookingForm} className="space-y-3 text-xs">
            {isPastDate(focusedDate) ? (
              <div className="bg-gray-50 text-gray-400 p-3 italic rounded-xs text-center border">
                Appointments cannot be retroactively booked into past dates.
              </div>
            ) : (
              <>
                <p className="text-[11px] text-[#a38c77]">Directly book an appointment onto <strong>{focusedDate}</strong>:</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Client Full Name *" required value={clientName} onChange={e => setClientName(e.target.value)} className="border p-2 rounded-xs bg-white" />
                  <input type="email" placeholder="Email Address *" required value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="border p-2 rounded-xs bg-white" />
                </div>
                <input type="text" placeholder="Phone Number" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full border p-2 rounded-xs bg-white" />
                
                <div className="bg-[#efe9e4]/20 p-3 rounded-sm space-y-2.5 border border-[#bfa791]/10">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#a38c77] block">Intake & Dependent Details</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Child's Name" value={childName} onChange={e => setChildName(e.target.value)} className="bg-white border p-2 rounded-xs" />
                    <input type="number" placeholder="Child's Age" value={childAge} onChange={e => setChildAge(e.target.value)} className="bg-white border p-2 rounded-xs" />
                  </div>
                  <textarea placeholder="Any specific details, requests, or clinical background context..." value={intakeNotes} onChange={e => setIntakeNotes(e.target.value)} className="w-full bg-white border p-2 rounded-xs h-14 resize-none" />
                </div>

                <select value={manualTime} onChange={e => setManualTime(e.target.value)} required className="w-full border p-2 rounded-xs bg-white text-gray-700 cursor-pointer">
                  <option value="">-- Choose Time Slot * --</option>
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* ADVANCED MULTIMODAL RECURRING FLOW BLOCK */}
                <div className="bg-gray-50/50 p-2.5 rounded-xs border border-gray-100 space-y-2">
                  <label className="flex items-center space-x-2 font-medium cursor-pointer text-gray-700">
                    <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="accent-[#634032]" />
                    <span>Enable recurring appointment series</span>
                  </label>
                  
                  {isRecurring && (
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100/60 mt-1">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">Frequency Cadence</label>
                        <select value={recurringFrequency} onChange={e => setRecurringFrequency(e.target.value)} className="w-full border p-1 bg-white text-gray-600 rounded-2xs">
                          <option value="WEEKLY">Weekly Interval</option>
                          <option value="MONTHLY">Monthly Date-Match</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">Total Occurrences</label>
                        <div className="flex items-center space-x-1">
                          <input type="number" min="2" max="24" value={recurringCount} onChange={e => setRecurringCount(e.target.value)} className="w-full border p-1 text-center bg-white rounded-2xs font-semibold" />
                          <span className="text-[10px] text-gray-400">sessions</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-[#634032] text-white py-2 text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#a38c77] transition-colors cursor-pointer">
                  Confirm Reservation
                </button>
              </>
            )}
          </form>
        )}

        {/* CONTENT C: BLOCK OUT DATES */}
        {panelActionTab === 'blackout' && (
          <div className="space-y-3">
            <p className="text-[11px] text-red-800 leading-relaxed">
              This will instantly remove all unbooked time slots and close public booking availability for the selected dates.
            </p>
            <div className="bg-red-50/40 border border-red-100 p-2.5 rounded-xs text-[11px] text-gray-700 max-h-16 overflow-y-auto font-mono">
              <span className="font-sans font-bold block text-red-900 uppercase text-[9px] mb-0.5">Target Range:</span>
              {selectedDatesPool.join(', ')}
            </div>
            <button type="button" onClick={submitDayBlackout} className="w-full bg-red-600 text-white py-2 text-xs uppercase tracking-wider font-bold rounded-xs hover:bg-red-700 transition-colors cursor-pointer">
              Block Availability ({selectedDatesPool.length} Days)
            </button>
          </div>
        )}
      </div>

    </div>
  );
}