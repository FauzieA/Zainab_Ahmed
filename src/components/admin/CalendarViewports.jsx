import React from 'react';

export default function CalendarViewports({ 
  viewMode, focusedDate, selectedDatesPool, slots, bookings, expandedWeekDay, 
  setExpandedWeekDay, handleDateClick, isPastDate, getDayStatusMetrics, TIME_OPTIONS, MONTHS_MANIFEST, CURRENT_YEAR 
}) {
  
  const focusedDaySlots = slots.filter(s => s.date_string === focusedDate);
  const focusedDayBookings = bookings.filter(b => b.date_booked === focusedDate);

  return (
    <div className="bg-white border border-[#bfa791]/20 p-6 rounded-sm min-h-[520px]">
      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {isPastDate(focusedDate) && (
            <div className="bg-gray-50 border border-gray-200 text-[11px] px-3 py-2 text-gray-500 italic rounded-xs mb-2">
              Viewing historic timeline records. Slot provisioning locked for this date row.
            </div>
          )}
          {TIME_OPTIONS.map((time) => {
            const targetSlot = slots.find(s => s.date_string === focusedDate && s.time_string === time);
            const targetBooking = bookings.find(b => b.date_booked === focusedDate && b.time_booked === time && b.status === 'CONFIRMED');

            return (
              <div key={time} className={`flex justify-between items-center p-3 border rounded-xs transition-all ${targetBooking ? 'bg-emerald-50/10 border-emerald-100' : targetSlot ? 'bg-[#efe9e4]/10 border-[#bfa791]/30' : 'bg-gray-50/30 border-gray-100 opacity-60'}`}>
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono font-bold w-16">{time}</span>
                  <span className="text-xs font-medium">{targetBooking ? `Booked by ${targetBooking.client_email}` : targetSlot ? 'Vacant Public Allocation Slot' : 'No Active Generation Target'}</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#a38c77]">
                  {targetBooking ? <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">Claimed</span> : targetSlot ? <span className="text-[#634032] bg-white px-2 py-0.5 border border-[#bfa791]/20 rounded-sm">Available</span> : <span className="text-gray-300">Offline</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {Array.from({ length: 7 }, (_, i) => {
            const [fD, fM, fY] = focusedDate.split('/').map(Number);
            const anchorDate = new Date(fY, fM - 1, fD);
            anchorDate.setDate(anchorDate.getDate() - anchorDate.getDay() + i);
            
            const dStr = `${String(anchorDate.getDate()).padStart(2, '0')}/${String(anchorDate.getMonth() + 1).padStart(2, '0')}/${anchorDate.getFullYear()}`;
            const metrics = getDayStatusMetrics(dStr);
            const isExpanded = expandedWeekDay === dStr;
            const daySlots = slots.filter(s => s.date_string === dStr);
            const hasPassed = isPastDate(dStr);

            return (
              <div key={dStr} className={`border rounded-xs bg-white overflow-hidden transition-all ${hasPassed ? 'opacity-75' : ''}`}>
                <div onClick={() => { handleDateClick(dStr); setExpandedWeekDay(isExpanded ? null : dStr); }} className={`p-3 flex justify-between items-center cursor-pointer transition-colors hover:bg-[#efe9e4]/20 ${focusedDate === dStr ? 'bg-[#efe9e4]/40' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold ${hasPassed ? 'text-gray-400 line-through' : 'text-[#634032]'}`}>{dStr}</span>
                    <div className="flex space-x-1">
                      {metrics.hasAvailable && <span className="w-1.5 h-1.5 rounded-full bg-[#a38c77]"></span>}
                      {metrics.hasBooked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#a38c77] uppercase font-bold">{isExpanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                </div>
                {isExpanded && (
                  <div className="bg-[#efe9e4]/10 p-3 border-t border-[#bfa791]/15 space-y-1.5 text-xs">
                    {daySlots.length > 0 ? daySlots.map(s => {
                      const bMatch = bookings.find(b => b.date_booked === dStr && b.time_booked === s.time_string && b.status === 'CONFIRMED');
                      return (
                        <div key={s.id} className="flex justify-between items-center py-1 font-mono border-b border-[#bfa791]/5 last:border-0">
                          <span>{s.time_string}</span>
                          <span className={bMatch ? 'text-emerald-700 font-bold' : 'text-gray-400 italic'}>{bMatch ? `Booked: ${bMatch.client_email}` : 'Expired Vacant Slot'}</span>
                        </div>
                      );
                    }) : <p className="text-[11px] italic text-gray-400">No layouts configured for this coordinate.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['S','M','T','W','T','F','S'].map((h, i) => <span key={i} className="text-[10px] font-bold text-[#a38c77]/60 py-1">{h}</span>)}
            {Array.from({ length: 31 }, (_, idx) => {
              const d = idx + 1;
              const [fD, fM, fY] = focusedDate.split('/');
              const dStr = `${d < 10 ? '0' + d : d}/${fM}/${fY}`;
              const metrics = getDayStatusMetrics(dStr);
              const isPoolSelected = selectedDatesPool.includes(dStr);
              const isAnchorFocus = focusedDate === dStr;
              const hasPassed = isPastDate(dStr);

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDateClick(dStr)}
                  className={`aspect-square relative flex flex-col items-center justify-center text-xs font-medium border rounded-xs cursor-pointer transition-all
                    ${isPoolSelected ? 'bg-[#634032] text-[#efe9e4] border-[#634032]' : 'bg-white text-[#634032] border-[#bfa791]/15 hover:border-[#634032]/40'}
                    ${isAnchorFocus && !isPoolSelected ? 'ring-1 ring-[#634032] ring-offset-1' : ''}
                    ${hasPassed && !isPoolSelected ? 'bg-gray-50/50 text-gray-300' : ''}`}
                >
                  <span className={hasPassed && !isPoolSelected ? 'line-through opacity-60' : ''}>{d}</span>
                  <div className="absolute bottom-1 flex space-x-0.5">
                    {metrics.hasAvailable && <span className={`w-1 h-1 rounded-full ${isPoolSelected ? 'bg-white' : 'bg-[#a38c77]'}`}></span>}
                    {metrics.hasBooked && <span className="w-1 h-1 rounded-full bg-emerald-500"></span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* YEAR VIEW */}
      {viewMode === 'year' && (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 max-h-[420px] overflow-y-auto pr-1 pt-1">
          {MONTHS_MANIFEST.map((month) => (
            <div key={month.code} className="border border-[#bfa791]/15 p-2 rounded-xs bg-white">
              <span className="text-[11px] font-serif font-bold text-[#634032] block mb-2 border-b border-[#bfa791]/10 pb-0.5 text-center">{month.name}</span>
              <div className="grid grid-cols-7 gap-0.5 text-[8px] text-center">
                {Array.from({ length: month.days }, (_, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  const builtDateStr = `${dayNum < 10 ? '0' + dayNum : dayNum}/${month.code}/${CURRENT_YEAR}`;
                  const metrics = getDayStatusMetrics(builtDateStr);
                  const isFocused = focusedDate === builtDateStr;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => handleDateClick(builtDateStr)}
                      className={`p-0.5 rounded-2xs font-medium cursor-pointer transition-all relative flex flex-col items-center justify-center h-5 w-full border
                        ${isFocused ? 'bg-[#634032] text-white border-[#634032]' : 'bg-gray-50/40 text-gray-700 border-transparent hover:border-[#634032]/30'}`}
                    >
                      <span>{dayNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}