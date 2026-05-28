import React from 'react';

export default function ConsultationDetails({ 
  serviceDetails,
  inlineEditMode = false, 
  externalState = null, 
  setExternalState = null,
  liveContent = null
}) {

  // STRICT 3-TIER RESOLUTION CHAIN
  const getServiceValue = (key, defaultValue) => {
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

  return (
    <div className="space-y-8 pr-0 md:pr-4">
      {/* Brand Title Frame */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#a38c77] font-semibold block mb-2">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('serviceType', e.currentTarget.innerText)}
          >
            {getServiceValue('serviceType', serviceDetails.type || "Private Advisory Session")}
          </span>
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#634032] font-light leading-tight">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('serviceTitle', e.currentTarget.innerText)}
          >
            {getServiceValue('serviceTitle', serviceDetails.title)}
          </span>
        </h2>
        <div className="w-12 h-[1px] bg-[#bfa791]/30 mt-4"></div>
      </div>

      {/* Overview Block */}
      <div className="space-y-4 text-xs font-light text-[#634032]/80 leading-relaxed">
        <p className="font-serif italic text-sm text-[#a38c77]">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('serviceSubtitle', e.currentTarget.innerText)}
          >
            {getServiceValue('serviceSubtitle', 'Expert guidance. Practical strategies. Real results.')}
          </span>
        </p>
        <p>
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('serviceDescription', e.currentTarget.innerText)}
          >
            {getServiceValue('serviceDescription', 'This 1:1 consultation is designed to help you navigate your child\'s behavior with practical, developmentally appropriate strategies. You\'ll leave with clear tools you can start using immediately.')}
          </span>
        </p>
      </div>

      {/* Target Audiences */}
      <div className="space-y-2">
        <h4 className="text-[10px] uppercase tracking-widest text-[#a38c77] font-bold">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('consultWhoHeading', e.currentTarget.innerText)}
          >
            {getServiceValue('consultWhoHeading', 'Who This Is For')}
          </span>
        </h4>
        <ul className="text-xs font-light text-[#634032]/80 space-y-1.5 list-disc list-inside">
          <li>
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultWho1', e.currentTarget.innerText)}
            >
              {getServiceValue('consultWho1', 'Parents of children aged 0–7 years')}
            </span>
          </li>
          <li>
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultWho2', e.currentTarget.innerText)}
            >
              {getServiceValue('consultWho2', 'You are dealing with tantrums, stubbornness, or communication struggles')}
            </span>
          </li>
          <li>
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultWho3', e.currentTarget.innerText)}
            >
              {getServiceValue('consultWho3', 'You\'ve tried different approaches but nothing seems to work')}
            </span>
          </li>
          <li>
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultWho4', e.currentTarget.innerText)}
            >
              {getServiceValue('consultWho4', 'You want structured, realistic guidance, not guesswork...')}
            </span>
          </li>
        </ul>
      </div>

      {/* Core Outcomes Cabinet */}
      <div className="bg-[#efe9e4]/30 p-5 rounded-xs border border-[#bfa791]/15 space-y-3">
        <h4 className="text-[10px] uppercase tracking-widest text-[#634032] font-bold">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('consultGainHeading', e.currentTarget.innerText)}
          >
            {getServiceValue('consultGainHeading', 'What You\'ll Gain')}
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-light text-[#634032]/90">
          <p>
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultGain1', e.currentTarget.innerText)}
            >
              {getServiceValue('consultGain1', 'Stronger connection with your child')}
            </span>
          </p>
          <p>
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultGain2', e.currentTarget.innerText)}
            >
              {getServiceValue('consultGain2', 'More peace, less stress at home')}
            </span>
          </p>
          <p>
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultGain3', e.currentTarget.innerText)}
            >
              {getServiceValue('consultGain3', 'Confidence in parenting choices')}
            </span>
          </p>
          <p>
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultGain4', e.currentTarget.innerText)}
            >
              {getServiceValue('consultGain4', 'Practical strategies that actually work')}
            </span>
          </p>
        </div>
      </div>

      {/* Pre-Session Onboarding Instructions */}
      <div className="space-y-3 text-xs font-light text-[#634032]/80">
        <h4 className="text-[10px] uppercase tracking-widest text-[#a38c77] font-bold">
          <span
            contentEditable={inlineEditMode}
            suppressContentEditableWarning={inlineEditMode}
            className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
            onBlur={(e) => handleEditableBlur('consultPreSessionHeading', e.currentTarget.innerText)}
          >
            {getServiceValue('consultPreSessionHeading', 'Pre-Session Guide')}
          </span> 🤎</h4>
        <div className="space-y-2 bg-white border border-gray-100 p-4 rounded-xs">
          <p className="font-medium text-[#634032]">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultPreSessionIntro', e.currentTarget.innerText)}
            >
              {getServiceValue('consultPreSessionIntro', 'How to prepare:')}
            </span>
          </p>
          <p className="pl-2">
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultPreSession1', e.currentTarget.innerText)}
            >
              {getServiceValue('consultPreSession1', 'Think about 2–3 real situations with your child.')}
            </span>
          </p>
          <p className="pl-2">
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultPreSession2', e.currentTarget.innerText)}
            >
              {getServiceValue('consultPreSession2', 'Be ready to describe what happens before, during and after.')}
            </span>
          </p>
          <p className="pl-2">
            • <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('consultPreSession3', e.currentTarget.innerText)}
            >
              {getServiceValue('consultPreSession3', 'Note down what you have already tried so far.')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}