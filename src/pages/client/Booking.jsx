import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config';
import ConsultationDetails from '../../components/client/ConsultationDetails';
import IntakeFormModal from '../../components/client/IntakeFormModal';

export default function Book({ inlineEditMode = false, externalState = null, setExternalState = null }) {
  const [serviceDetails, setServiceDetails] = useState({
    title: "1:1 Parenting Consultation",
    type: "Private Advisory Session",
    duration: "90 Minutes",
    price: 25000, 
    currency: "NGN",
    location: "Online (Google Meet)"
  });

  const [allAvailableSlots, setAllAvailableSlots] = useState({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [liveContent, setLiveContent] = useState(null);
  
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  // Dynamic calendar engine to map exact day counts per month
  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const daysCount = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);

  const getFullDateKey = (dayNumber) => {
    const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    return `${formattedDay}/${formattedMonth}/${currentYear}`;
  };

  // Helper helper to generate cleanly isolated endpoint routing URLs
  const getCleanApiUrl = (endpoint) => {
    const base = CONFIG.API_BASE_URL.replace(/\/$/, "");
    if (base.endsWith('/api/booking')) {
      return `${base}/${endpoint}`;
    }
    return `${base}/api/booking/${endpoint}`;
  };

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth; let newYear = currentYear;
    if (direction === 'prev') {
      newMonth--; if (newMonth < 1) { newMonth = 12; newYear--; }
    } else {
      newMonth++; if (newMonth > 12) { newMonth = 1; newYear++; }
    }
    setCurrentMonth(newMonth); setCurrentYear(newYear); setSelectedDate(1);
  };

  useEffect(() => {
    const metaUrl = getCleanApiUrl('meta/');
    
    fetch(metaUrl)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        if (data.site_content) {
          setLiveContent(data.site_content);
          if (!inlineEditMode) {
            setServiceDetails(prev => ({
              ...prev,
              type: data.site_content.serviceType || prev.type,
              title: data.site_content.consultTitle || data.site_content.serviceTitle || prev.title,
              duration: data.site_content.consultDuration || prev.duration,
              location: data.site_content.consultLocation || prev.location
            }));
          }
        }
        
        if (data.pricing) {
          setServiceDetails(prev => ({
            ...prev,
            price: data.pricing.amount,
            currency: data.pricing.currency
          }));
        }
        
        // Ensure incoming flat array is grouped by date strings for the frontend rendering map
        if (data.slots && Array.isArray(data.slots)) {
          const groupedSlots = {};
          data.slots.forEach(slot => {
            // Only mount unbooked slots to the public booking calendar view
            if (!slot.is_booked) {
              if (!groupedSlots[slot.date_string]) {
                groupedSlots[slot.date_string] = [];
              }
              groupedSlots[slot.date_string].push(slot.time_string);
            }
          });
          
          setAllAvailableSlots(groupedSlots);
          const initialKey = getFullDateKey(selectedDate);
          const initialTimes = groupedSlots[initialKey] || [];
          setAvailableTimeSlots(initialTimes);
          if (initialTimes.length > 0) setSelectedTime(initialTimes[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to compile public site configurations:", err);
        setLoading(false);
      });
  }, [inlineEditMode, currentMonth, currentYear]);

  useEffect(() => {
    const targetKey = getFullDateKey(selectedDate);
    const timesForDay = allAvailableSlots[targetKey] || [];
    setAvailableTimeSlots(timesForDay);
    setSelectedTime(timesForDay.length > 0 ? timesForDay[0] : '');
  }, [selectedDate, allAvailableSlots]);

  const handleFormSubmissionAndCheckout = async (intakeData) => {
    setIsIntakeOpen(false);
    const intentUrl = getCleanApiUrl('intent/');
    
    try {
      const intentResponse = await fetch(intentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: intakeData.parentEmail,
          slots: [{ date: getFullDateKey(selectedDate), time: selectedTime }],
          client_name: intakeData.parentName,
          client_phone: intakeData.parentPhone,
          child_name: intakeData.childName || '',
          child_age: intakeData.childAge,
          child_gender: intakeData.childGender,
          school_status: intakeData.childSchoolStatus,
          intake_notes: `Challenges: ${intakeData.challenges} | Timeline: ${intakeData.duration} | Tried: ${intakeData.triedSoFar} | Desired Outcomes: ${intakeData.outcomesDesired}`
        })
      });

      const intentData = await intentResponse.json();
      if (!intentResponse.ok) return alert(intentData.error || "Execution failed.");

      const handler = window.PaystackPop.setup({
        key: CONFIG.PAYSTACK_PUBLIC_KEY,
        email: intakeData.parentEmail,
        amount: intentData.amount * 100,
        currency: intentData.currency,
        metadata: { booking_reference: intentData.booking_reference },
        callback: function(response) {
          alert(`Payment success! Reference: ${response.reference}. Your session confirmation and automated Google Meet link will hit your inbox shortly.`);
          window.location.reload();
        }
      });
      handler.openIframe();
    } catch {
      alert("Network timeout connecting with financial clearing channels.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-serif italic text-[#634032]">
        Loading premium profile metrics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#634032] antialiased pb-24 selection:bg-[#efe9e4]">
      <section className="max-w-6xl mx-auto px-6 pt-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        <div className="md:col-span-6 lg:col-span-7">
          <ConsultationDetails 
            serviceDetails={serviceDetails}
            inlineEditMode={inlineEditMode}
            externalState={externalState}
            setExternalState={setExternalState}
            liveContent={liveContent}
          />
        </div>

        <div className="md:col-span-6 lg:col-span-5 bg-[#efe9e4]/20 p-6 md:p-8 rounded-sm border border-[#bfa791]/20 h-fit space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg tracking-wide text-[#634032] font-normal">Select Date & Time</h3>
            
            <div className="bg-white border border-[#bfa791]/30 p-4 rounded-xs flex justify-between items-center shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#a38c77] font-bold block">Session Rate</span>
                <span className="text-xs font-light text-[#634032]/80 font-mono">{serviceDetails.duration} Private Advisory</span>
              </div>
              <div className="text-right">
                <span className="font-serif italic text-xl font-semibold text-[#634032] tracking-wide block">
                  {serviceDetails.currency} {serviceDetails.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs tracking-wider text-[#a38c77] uppercase font-bold pt-2">
            <button onClick={() => handleMonthChange('prev')} className="text-base cursor-pointer hover:text-[#634032]">‹</button>
            <span>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentMonth - 1]} {currentYear}</span>
            <button onClick={() => handleMonthChange('next')} className="text-base cursor-pointer hover:text-[#634032]">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#a38c77]">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => <div key={idx} className="py-1 opacity-60">{day}</div>)}
            {daysInMonth.map((day) => {
              const isSelected = selectedDate === day;
              const hasSlots = (allAvailableSlots[getFullDateKey(day)] || []).length > 0;
              return (
                <button
                  key={day} type="button" onClick={() => setSelectedDate(day)}
                  className={`py-2 text-[12px] rounded-xs font-light relative cursor-pointer transition-all ${
                    isSelected ? 'bg-[#634032] text-white font-medium shadow-xs' : hasSlots ? 'text-[#634032] font-bold hover:bg-[#efe9e4]' : 'text-gray-300 hover:bg-gray-50/40'
                  }`}
                >
                  {day}
                  {hasSlots && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#634032]"></span>}
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#bfa791]/15 pt-4 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a38c77] block">Available Slots</span>
            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((time) => (
                  <button
                    key={time} type="button" onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 border text-xs text-center font-mono rounded-2xs transition-all cursor-pointer ${
                      selectedTime === time ? 'border-[#634032] bg-[#634032]/5 text-[#634032] font-bold' : 'border-gray-200 text-gray-400 bg-white hover:border-gray-400'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400">No available sessions remaining for this date coordinate.</p>
            )}
          </div>

          <button
            onClick={() => setIsIntakeOpen(true)}
            disabled={!selectedTime}
            className="w-full bg-[#634032] text-white py-3.5 font-serif italic text-base tracking-wide hover:bg-[#a38c77] transition-all duration-300 rounded-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {selectedTime ? "Book Session Now" : "Select an Available Time"}
          </button>
        </div>
      </section>

      <IntakeFormModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        selectedDateStr={getFullDateKey(selectedDate)}
        selectedTime={selectedTime}
        serviceDetails={serviceDetails}
        onSubmitIntent={handleFormSubmissionAndCheckout}
        inlineEditMode={inlineEditMode}
        externalState={externalState}
        setExternalState={setExternalState}
        liveContent={liveContent}
      />
    </div>
  );
}