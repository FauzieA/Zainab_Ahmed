import React, { useState } from 'react';

export default function IntakeFormModal({ 
  isOpen, 
  onClose, 
  selectedDateStr, 
  selectedTime, 
  serviceDetails, 
  onSubmitIntent,
  inlineEditMode = false,
  externalState = null,
  setExternalState = null,
  liveContent = null 
}) {

  const [formData, setFormData] = useState({
    parentName: '', parentEmail: '', parentPhone: '',
    childAge: '', childGender: '', childSchoolStatus: '',
    challenges: '', duration: '', triedSoFar: '', outcomesDesired: ''
  });

  // STRICT 3-TIER RESOLUTION CHAIN
  const getFormValue = (key, defaultValue) => {
    if (inlineEditMode && externalState && externalState[key] !== undefined) {
      return externalState[key];
    }
    if (!inlineEditMode && liveContent && liveContent[key] !== undefined) {
      return liveContent[key];
    }
    return defaultValue;
  };
  
  const handleEditableBlur = (key, newContent) => {
    if (setExternalState && externalState) {
      setExternalState({ ...externalState, [key]: newContent });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIntent(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#634032]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#bfa791]/30 max-w-2xl w-full rounded-sm shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in selection:bg-[#efe9e4]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl text-[#634032] font-normal">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('intakeFormTitle', e.currentTarget.innerText)}
              >
                {getFormValue('intakeFormTitle', 'Consultation Intake Questionnaire')}
              </span>
            </h3>
            <div className="flex gap-2 items-center mt-1">
              <p className="text-[11px] text-[#a38c77] font-mono">Slot: {selectedDateStr} at {selectedTime}</p>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-2xs font-medium border border-amber-100 animate-pulse">
                Reserved for 10 minutes
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#634032] text-lg font-light cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-[#634032]">
          {/* PARENT INFO SEGMENT */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-[#a38c77] font-bold block border-b border-gray-50 pb-1"> Parent Info</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-medium mb-1">Full Name *</label>
                <input type="text" required value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-medium mb-1">Email Address *</label>
                <input type="email" required value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-medium mb-1">Phone Number *</label>
              <input type="tel" required placeholder="e.g., +234..." value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
            </div>
          </div>

          {/* CHILD INFO SEGMENT */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-[#a38c77] font-bold block border-b border-gray-50 pb-1"> Child Info</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-medium mb-1">Age *</label>
                <input type="number" required min="0" max="18" value={formData.childAge} onChange={e => setFormData({...formData, childAge: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-medium mb-1">Gender *</label>
                <select required value={formData.childGender} onChange={e => setFormData({...formData, childGender: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs cursor-pointer">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-medium mb-1">School Status *</label>
                <input type="text" required placeholder="e.g., Preschool, Grade 1" value={formData.childSchoolStatus} onChange={e => setFormData({...formData, childSchoolStatus: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
              </div>
            </div>
          </div>

          {/* MAIN CONCERNS SEGMENT */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-[#a38c77] font-bold block border-b border-gray-50 pb-1"> Main Concerns</span>
            
            <div>
              <label className="block text-[10px] uppercase font-medium mb-1">What challenges are you currently facing? *</label>
              <textarea required rows="2" value={formData.challenges} onChange={e => setFormData({...formData, challenges: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs resize-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-medium mb-1">How long has this been happening? *</label>
              <input type="text" required placeholder="e.g., 3 months, since transitioning school" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-medium mb-1">What have you tried so far? *</label>
              <textarea required rows="2" value={formData.triedSoFar} onChange={e => setFormData({...formData, triedSoFar: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs resize-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-medium mb-1">What would you like to achieve from this session? *</label>
              <textarea required rows="2" value={formData.outcomesDesired} onChange={e => setFormData({...formData, outcomesDesired: e.target.value})} className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-2xs resize-none" />
            </div>
          </div>

          <div className="pt-2 text-center space-y-4">
            <p className="font-serif italic text-xs text-[#a38c77]">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('intakeFormFooter', e.currentTarget.innerText)}
              >
                {getFormValue('intakeFormFooter', "Can't wait to get in touch with you")}
              </span>
            </p>
            <button type="submit" className="w-full bg-[#634032] text-white py-3 font-serif italic text-base tracking-wide hover:bg-[#a38c77] transition-all duration-300 rounded-xs shadow-xs cursor-pointer">
              Secure Appointment & Proceed to Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}