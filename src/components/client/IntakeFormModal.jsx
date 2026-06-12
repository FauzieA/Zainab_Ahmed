import React, { useState, useEffect } from 'react';

// Default schema fallback layout mirroring your exact screenshot structure
const DEFAULT_FIELDS = [
  { id: 'parentName', label: 'NAME', type: 'text', required: true, section: 'ℹ️ PARENT INFO' },
  { id: 'parentEmail', label: 'EMAIL', type: 'text', required: true, section: 'ℹ️ PARENT INFO' },
  { id: 'parentPhone', label: 'PHONE NUMBER', type: 'text', required: true, section: 'ℹ️ PARENT INFO' },
  { id: 'childAge', label: 'AGE', type: 'text', required: true, section: '➡️ CHILD INFO' },
  { id: 'childGender', label: 'GENDER', type: 'text', required: true, section: '➡️ CHILD INFO' },
  { id: 'childSchoolStatus', label: 'SCHOOL STATUS', type: 'text', required: true, section: '➡️ CHILD INFO' },
  { id: 'challenges', label: 'WHAT CHALLENGES ARE YOU CURRENTLY FACING?', type: 'textarea', required: true, section: '➡️ MAIN CONCERNS' },
  { id: 'duration', label: 'HOW LONG HAS THIS BEEN HAPPENING?', type: 'text', required: true, section: '➡️ MAIN CONCERNS' },
  { id: 'triedSoFar', label: 'WHAT HAVE YOU TRIED SO FAR?', type: 'text', required: true, section: '➡️ MAIN CONCERNS' },
  { id: 'outcomesDesired', label: 'WHAT WOULD YOU LIKE TO ACHIEVE FROM THIS SESSION?', type: 'textarea', required: true, section: '➡️ MAIN CONCERNS' }
];

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
  // Pull fields from live backend config or fall back to native hardcoded array
  const activeFields = inlineEditMode 
    ? (externalState?.intakeFields || DEFAULT_FIELDS)
    : (liveContent?.intakeFields || DEFAULT_FIELDS);

  const [formResponses, setFormResponses] = useState({});

  // Reset form responses structure whenever layout rules update
  useEffect(() => {
    const initialResponses = {};
    activeFields.forEach(field => {
      initialResponses[field.id] = '';
    });
    setFormResponses(initialResponses);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (fieldId, value) => {
    setFormResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  // --- ADMIN MANAGEMENT ACTIONS ---
  const updateGlobalFieldsState = (newFieldsArray) => {
    if (setExternalState && externalState) {
      setExternalState({
        ...externalState,
        intakeFields: newFieldsArray
      });
    }
  };

  const handleLabelEdit = (fieldId, newLabel) => {
    const updated = activeFields.map(f => f.id === fieldId ? { ...f, label: newLabel } : f);
    updateGlobalFieldsState(updated);
  };

  const handleDeleteField = (fieldId) => {
    const updated = activeFields.filter(f => f.id !== fieldId);
    if (confirm("Are you sure you want to remove this question field from the live client intake configuration?")) {
      updateGlobalFieldsState(updated);
    }
  };

  const handleAddField = (sectionName, inputType) => {
    const uniqueId = `custom_field_${Date.now()}`;
    const newFieldObject = {
      id: uniqueId,
      label: 'NEW CUSTOM QUESTION (CLICK TO EDIT)',
      type: inputType,
      required: true,
      section: sectionName
    };
    updateGlobalFieldsState([...activeFields, newFieldObject]);
  };

  // --- SUBMISSION LOGIC DISPATCH ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Map responses directly onto your existing core database contract structures
    const standardPayload = {
      parentName: formResponses.parentName || '',
      parentEmail: formResponses.parentEmail || '',
      parentPhone: formResponses.parentPhone || '',
      childAge: formResponses.childAge || '',
      childGender: formResponses.childGender || '',
      childSchoolStatus: formResponses.childSchoolStatus || '',
      challenges: formResponses.challenges || '',
      duration: formResponses.duration || '',
      triedSoFar: formResponses.triedSoFar || '',
      outcomesDesired: formResponses.outcomesDesired || ''
    };

    // Gather any additional custom metrics added dynamically by an administrator
    const staticKeys = ['parentName', 'parentEmail', 'parentPhone', 'childAge', 'childGender', 'childSchoolStatus', 'challenges', 'duration', 'triedSoFar', 'outcomesDesired'];
    
    const extendedNotesArray = [];
    activeFields.forEach(field => {
      if (!staticKeys.includes(field.id)) {
        extendedNotesArray.push(`${field.label}: ${formResponses[field.id] || ''}`);
      }
    });

    // If extra dynamic forms exist, append their structures to clean string logs
    if (extendedNotesArray.length > 0) {
      standardPayload.custom_intake_extensions = extendedNotesArray.join(' | ');
    }

    onSubmitIntent(standardPayload);
  };

  // Group dynamic field arrays by context block tokens matching your visual UI design
  const sections = ['ℹ️ PARENT INFO', '➡️ CHILD INFO', '➡️ MAIN CONCERNS'];

  return (
    <div className="fixed inset-0 bg-[#634032]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#bfa791]/30 max-w-2xl w-full rounded-none shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 selection:bg-[#efe9e4]">
        
        {/* Header Block */}
        <div className="flex justify-between items-start border-b border-[#bfa791]/20 pb-4">
          <div>
            <h3 style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-xl md:text-2xl text-[#634032] uppercase tracking-wide font-normal">
              1:1 PARENTING CONSULTATION
            </h3>
            <div className="flex gap-2 items-center mt-1">
              <p className="text-[11px] text-[#a38c77] font-mono">Slot: {selectedDateStr} at {selectedTime}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#634032] text-lg font-light cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-[#634032]">
          
          {sections.map(sectionHeader => {
            const sectionFields = activeFields.filter(f => f.section === sectionHeader);
            
            return (
              <div key={sectionHeader} className="space-y-4 border-b border-[#bfa791]/10 pb-4 last:border-0">
                <div className="flex justify-between items-center bg-[#efe9e4]/30 p-2 border-l-2 border-[#bfa791]">
                  <span className="text-[11px] uppercase tracking-wider text-[#a38c77] font-bold block">
                    {sectionHeader}
                  </span>
                  
                  {inlineEditMode && (
                    <div className="flex gap-2 text-[9px] font-sans">
                      <button 
                        type="button" 
                        onClick={() => handleAddField(sectionHeader, 'text')}
                        className="bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200 hover:bg-emerald-100"
                      >
                        + Add Input
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleAddField(sectionHeader, 'textarea')}
                        className="bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-200 hover:bg-blue-100"
                      >
                        + Add Long Text
                      </button>
                    </div>
                  )}
                </div>

                <div className={`${sectionHeader === '➡️ CHILD INFO' ? 'grid grid-cols-1 sm:grid-cols-3 gap-4' : 'space-y-4'}`}>
                  {sectionFields.map(field => (
                    <div key={field.id} className="group relative">
                      <div className="flex items-center justify-between mb-1">
                        <label 
                          contentEditable={inlineEditMode}
                          suppressContentEditableWarning={inlineEditMode}
                          onBlur={(e) => handleLabelEdit(field.id, e.currentTarget.innerText)}
                          className={`text-[10px] uppercase font-bold tracking-wider outline-none block ${
                            inlineEditMode ? 'bg-yellow-50 border border-dashed border-[#bfa791] px-1' : ''
                          }`}
                        >
                          {field.label}
                        </label>
                        
                        {/* Show structural removal action controls inside management dashboards */}
                        {inlineEditMode && (
                          <button 
                            type="button" 
                            onClick={() => handleDeleteField(field.id)}
                            className="text-red-500 hover:text-red-700 text-[10px] px-1 font-bold"
                            title="Delete field"
                          >
                            ✕ Delete
                          </button>
                        )}
                      </div>

                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          rows="3"
                          value={formResponses[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-none resize-none text-xs"
                        />
                      ) : (
                        <input
                          type="text"
                          required={field.required}
                          value={formResponses[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-[#634032] p-2.5 outline-none rounded-none text-xs"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer Form Submission Block */}
          <div className="pt-4 text-center space-y-4">
            <p style={{ fontFamily: "'Times New Roman', times, serif" }} className="italic text-base text-[#634032]">
              Can't wait to get in touch with you💕
            </p>
            <button type="submit" className="w-full bg-[#634032] text-white py-3.5 font-serif italic text-base tracking-wide hover:bg-[#a38c77] transition-all duration-300 rounded-none shadow-xs cursor-pointer">
              Secure Appointment & Proceed to Checkout
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}