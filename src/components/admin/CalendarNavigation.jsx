import React from 'react';

export default function CalendarNavigation({ viewMode, setViewMode, focusedDate, onStep, setExpandedWeekDay, setSelectedDatesPool }) {
  
  // Helper to compute the full week boundary range for the active anchor day
  const getWeekRangeLabel = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const anchor = new Date(year, month - 1, day);
    
    // Calculate Sunday (Start) and Saturday (End)
    const sunday = new Date(anchor);
    sunday.setDate(anchor.getDate() - anchor.getDay());
    
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    
    const pad = (n) => String(n).padStart(2, '0');
    
    const startStr = `${pad(sunday.getDate())}/${pad(sunday.getMonth() + 1)}/${sunday.getFullYear()}`;
    const endStr = `${pad(saturday.getDate())}/${pad(saturday.getMonth() + 1)}/${saturday.getFullYear()}`;
    
    return `${startStr} – ${endStr}`;
  };

  // Helper to grab the English word name for the active month focus
  const getMonthNameLabel = (dateStr) => {
    const [, month, year] = dateStr.split('/');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  // Resolve what title string to pass to the viewport display block
  const getHeaderLabel = () => {
    if (viewMode === 'month') return getMonthNameLabel(focusedDate);
    if (viewMode === 'week') return getWeekRangeLabel(focusedDate);
    if (viewMode === 'year') return `Yearly Overview (${focusedDate.split('/')[2]})`;
    return focusedDate; // Default fallback for individual day view
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white border border-[#bfa791]/20 p-3 rounded-sm">
        <div className="bg-[#efe9e4]/50 p-0.5 rounded-xs flex border border-[#bfa791]/20">
          {['day', 'week', 'month', 'year'].map((mode) => (
            <button
              key={mode}
              onClick={() => { 
                setViewMode(mode); 
                setExpandedWeekDay(null);
                setSelectedDatesPool([focusedDate]); 
              }}
              className={`px-3 py-1 text-[10px] uppercase font-semibold tracking-wider transition-all rounded-xs cursor-pointer ${viewMode === mode ? 'bg-[#634032] text-white shadow-xs' : 'text-[#634032]/60 hover:text-[#634032]'}`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#efe9e4]/20 p-3 rounded-sm border border-[#bfa791]/15">
        <button 
          onClick={() => onStep('prev')} 
          className="text-xs font-semibold uppercase tracking-wider bg-white border border-[#bfa791]/30 px-3 py-1 text-[#634032] hover:bg-[#634032] hover:text-white rounded-2xs transition-colors cursor-pointer"
        >
          ◄ Previous
        </button>
        
        <div className="text-center">
          <span className="text-[9px] text-[#a38c77] block uppercase font-medium tracking-widest mb-0.5">Selected Window</span>
          <span className="text-xs font-serif font-bold text-[#634032] tracking-wide">{getHeaderLabel()}</span>
        </div>

        <button 
          onClick={() => onStep('next')} 
          className="text-xs font-semibold uppercase tracking-wider bg-white border border-[#bfa791]/30 px-3 py-1 text-[#634032] hover:bg-[#634032] hover:text-white rounded-2xs transition-colors cursor-pointer"
        >
          Next ►
        </button>
      </div>
    </div>
  );
}