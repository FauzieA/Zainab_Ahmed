import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config';

export default function Contact({ inlineEditMode = false, externalState = null, setExternalState = null }) {
  const [liveContent, setLiveContent] = useState(null);

  const handleEditableBlur = (key, newContent) => {
    if (setExternalState && externalState) {
      setExternalState({ ...externalState, [key]: newContent });
    }
  };

  useEffect(() => {
    if (!inlineEditMode) {
      fetch(`${CONFIG.API_BASE_URL.replace(/\/$/, "")}/meta/`)
        .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
        .then((data) => {
          if (data.site_content) {
            setLiveContent(data.site_content);
          }
        })
        .catch(() => {});
    }
  }, [inlineEditMode]);

  // STRICT 3-TIER RESOLUTION CHAIN
  const getContactValue = (key, defaultValue) => {
    if (inlineEditMode && externalState && externalState[key] !== undefined) {
      return externalState[key];
    }
    if (!inlineEditMode && liveContent && liveContent[key] !== undefined) {
      return liveContent[key];
    }
    return defaultValue;
  };

  return (
    <div className="min-h-screen bg-[#fff] font-serif antialiased text-[#bfa791] pt-32 pb-24 selection:bg-[#efe9e4] selection:text-[#a38c77]">
      <div className="max-w-5xl mx-auto px-8 md:px-12">
        
        {/* Unified Header Group */}
        <div className="text-center pb-16">
          <h1 className="text-[40px] md:text-[48px] font-normal uppercase tracking-[0.15em] text-[#bfa791] leading-none">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791]/50 px-3 focus:outline-none inline-block' : ''}
              onBlur={(e) => handleEditableBlur('contactHeading', e.currentTarget.innerText)}
            >
              {getContactValue('contactHeading', 'GET IN TOUCH')}
            </span>
          </h1>
        </div>

        {/* Minimal Editorial Border Line */}
        <div className="border-t border-[#bfa791]/30 w-full mb-16" />

        {/* Cohesive Lower Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Left Side: Brand Identity */}
          <div className="md:col-span-5">
            <h2 className="text-[32px] md:text-[36px] font-normal tracking-wide text-[#bfa791] leading-tight">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('contactBrandName', e.currentTarget.innerText)}
              >
                {getContactValue('contactBrandName', 'Zainab A Ahmed')}
              </span>
            </h2>
          </div>

          {/* Right Side: Clean Typography Data Rows */}
          <div className="md:col-span-7 space-y-6 md:pl-12">
            
            {/* Phone Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#bfa791]/10 pb-4 gap-1">
              <span 
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[14px] tracking-[0.2em] uppercase font-sans opacity-75 ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1 focus:outline-none' : ''}`}
                onBlur={(e) => handleEditableBlur('contactPhoneLabel', e.currentTarget.innerText)}
              >
                {getContactValue('contactPhoneLabel', 'Phone')}
              </span>
              <a 
                href={`tel:${getContactValue('contactPhoneValue', '+2347031689490')}`}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[17px] text-[#bfa791] font-normal hover:opacity-70 transition-opacity focus:outline-none ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('contactPhoneValue', e.currentTarget.innerText)}
                onClick={(e) => inlineEditMode && e.preventDefault()}
              >
                {getContactValue('contactPhoneValue', '+2347031689490')}
              </a>
            </div>

            {/* Email Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#bfa791]/10 pb-4 gap-1">
              <span 
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[14px] tracking-[0.2em] uppercase font-sans opacity-75 ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1 focus:outline-none' : ''}`}
                onBlur={(e) => handleEditableBlur('contactEmailLabel', e.currentTarget.innerText)}
              >
                {getContactValue('contactEmailLabel', 'Email')}
              </span>
              <a 
                href={`mailto:${getContactValue('contactEmailValue', 'zainaabahmed05@gmail.com')}`}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[17px] text-[#bfa791] font-normal hover:opacity-70 transition-opacity focus:outline-none break-all ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('contactEmailValue', e.currentTarget.innerText)}
                onClick={(e) => inlineEditMode && e.preventDefault()}
              >
                {getContactValue('contactEmailValue', 'zainaabahmed05@gmail.com')}
              </a>
            </div>

            {/* Instagram Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#bfa791]/10 pb-4 gap-1">
              <span 
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[14px] tracking-[0.2em] uppercase font-sans opacity-75 ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1 focus:outline-none' : ''}`}
                onBlur={(e) => handleEditableBlur('contactInstagramLabel', e.currentTarget.innerText)}
              >
                {getContactValue('contactInstagramLabel', 'Instagram')}
              </span>
              <a 
                href={`https://instagram.com/${getContactValue('contactInstagramValue', 'zaiinaab.ahmed')}`}
                target="_blank"
                rel="noopener noreferrer"
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[17px] text-[#bfa791] font-normal hover:opacity-70 transition-opacity focus:outline-none ${inlineEditMode ? 'bg-yellow-50/60 ring-1 ring-dashed ring-[#bfa791]/40 px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('contactInstagramValue', e.currentTarget.innerText)}
                onClick={(e) => inlineEditMode && e.preventDefault()}
              >
                {getContactValue('contactInstagramValue', 'zaiinaab.ahmed')}
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}