import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';
import zeeImage from '../../assets/zee.jpeg';

export default function Home({ inlineEditMode = false, externalState = null, setExternalState = null }) {
  const navigate = useNavigate();
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
  const getHomeValue = (key, defaultValue) => {
    if (inlineEditMode && externalState && externalState[key] !== undefined) {
      return externalState[key];
    }
    if (!inlineEditMode && liveContent && liveContent[key] !== undefined) {
      return liveContent[key];
    }
    return defaultValue;
  };

  return (
    <div className="min-h-screen bg-white text-[#bfa791] font-sans antialiased selection:bg-[#efe9e4] selection:text-[#a38c77]">
      {/* =========================================================================
          1. HERO HEADER SECTION (WIX TYPOGRAPHY MATRICES + PIXEL ALIGNMENT MATCH)
          ========================================================================= */}
      <section className="w-full bg-white pt-16 pb-24 subpixel-antialiased">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-12 lg:gap-x-20 items-start">
          
          {/* ROW 1: Identity Branding Header Header Block */}
          <div className="lg:col-span-6 flex flex-col items-center text-center mb-10 lg:mb-14">
            {/* 1. Main Name (ZAINAB AHMED) */}
            <h1 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '82px', 
                lineHeight: '82px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="text-center max-w-[340px] mx-auto break-words tracking-normal uppercase"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none block' : 'block'}
                onBlur={(e) => handleEditableBlur('homeHeroTitle', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHeroTitle', 'Zainab A. Ahmed')}
              </span>
            </h1>

            {/* 2. Professional Title */}
            <p 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '18px', 
                lineHeight: '25.2px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="mt-5 tracking-normal"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHeroSubtitle', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHeroSubtitle', 'Parenting & Child Development Consultant')}
              </span>
            </p>
          </div>

          {/* Desktop Right Spacer - Keeps layout aligned without breaking grid flow */}
          <div className="hidden lg:col-span-6 lg:block"></div>


          {/* ROW 2: Media and Editorial Core Pitch (Guaranteed Top Alignment Match) */}
          {/* Left Column: Profile Media Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center mb-12 lg:mb-0">
            <div className="w-full max-w-[380px] aspect-[3/4] overflow-hidden">
              <img 
                src={zeeImage}
                alt="Zainab A. Ahmed" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Text Content starting precisely with top of image */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* System Key Tag - Preserved & visible only when editing */}
            {inlineEditMode && (
              <div className="p-2 border border-dashed border-[#bfa791]/40 bg-yellow-50/20 rounded text-xs mb-4 font-sans">
                <span className="text-[10px] font-mono text-[#a38c77] block mb-1">System Tag (Hidden in Production):</span>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className="bg-yellow-50/40 px-1 focus:outline-none"
                  onBlur={(e) => handleEditableBlur('homeHeroWelcomeTag', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroWelcomeTag', 'Welcome & Support')}
                </span>
              </div>
            )}

            {/* 3. Tagline (You don't have to figure it out alone) */}
            <h2 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '30px', 
                lineHeight: '33px', 
                fontWeight: '700',
                color: 'rgb(191, 167, 145)',
                fontStyle: 'italic'
              }}
              className="text-left tracking-normal mb-6"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHeroMainHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHeroMainHeading', "You don't have to figure it out alone.")}
              </span>
            </h2>

            {/* 4. Body Paragraphs */}
            <div 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '18px', 
                lineHeight: '27px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="space-y-6 text-left tracking-normal"
            >
              <p>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroP1', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroP1', "Parenting can feel overwhelming when you're constantly trying to decode your child's behavior, navigate heavy emotional transitions, and figure out what actually works long-term. Some days feel beautifully calm... and other days feel like survival.")}
                </span>
              </p>
              <p>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroP2', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroP2', 'You are not failing. You just need the right support.')}
                </span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. THE REALITY SECTION (WIX TYPOGRAPHY & COMPACT VIEWPORT RATIO MATCH)
          ========================================================================= */}
      <section 
        style={{ backgroundColor: 'rgb(239, 233, 228)' }} 
        className="w-full py-16 md:py-20 subpixel-antialiased"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* 2. Heading Container with Balanced Horizontal Rules */}
          <div className="flex items-center justify-center gap-6 mb-8 select-none">
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
            <h2 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '56px', 
                lineHeight: '56px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="tracking-normal uppercase"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeRealityHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeRealityHeading', 'SOUNDS FAMILIAR?')}
              </span>
            </h2>
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
          </div>
          
          {/* Core Content Flow: Tightened, unified vertical flow matching Wix footprint */}
          <div 
            style={{ 
              fontFamily: '"times new roman", times, serif', 
              fontSize: '18px', 
              lineHeight: '27px', 
              fontWeight: '400',
              color: 'rgb(191, 167, 145)'
            }}
            className="max-w-2xl mx-auto space-y-5 text-center tracking-normal"
          >
            {/* 3. Main Body Text Block */}
            <p>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeRealityP1', e.currentTarget.innerText)}
              >
                {getHomeValue('homeRealityP1', 'You’re doing your best to be a good parent... but sometimes you still find yourself reacting in ways you didn’t. The guilt comes after, and you promise yourself “tomorrow I’ll handle it better”... yet the same patterns keep showing up, and it leaves you feeling drained.')}
              </span>
            </p>
            
            <p>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeQuotation', e.currentTarget.innerText)}
              >
                {getHomeValue('homeQuotation', 'Some days it feels like your mind won’t switch off...')}
              </span>
            </p>

            {/* 4. Emphasized Internal Monologue Questions Block */}
            <div className="space-y-2">
              <p style={{ fontWeight: '700', fontStyle: 'italic' }}>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeQuotationQ1', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeQuotationQ1', '“Why isn’t my child listening?”')}
                </span>
              </p>
              <p style={{ fontWeight: '700', fontStyle: 'italic' }}>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeQuotationQ2', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeQuotationQ2', '“Why did I react like that again?”')}
                </span>
              </p>
              <p style={{ fontWeight: '700', fontStyle: 'italic' }}>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeQuotationQ3', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeQuotationQ3', '“What am I doing wrong?”')}
                </span>
              </p>
            </div>

            {/* 5. Closing Statements Block */}
            <p>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeRealityP2', e.currentTarget.innerText)}
              >
                {getHomeValue('homeRealityP2', 'You want closeness and connection... but it often turns into conflict instead. You want calm in your home... but everything feels overwhelming in the moment. And quietly... you’re beginning to wonder if this cycle is just how parenting is going to be.')}
              </span>
            </p>
          </div>

        </div>
      </section>
      {/* =========================================================================
          3. THE VISION SECTION (EXACT LINE-BREAK & EDITORIAL FOOTPRINT MATCH)
          ========================================================================= */}
      <section className="w-full bg-white py-16 md:py-20 subpixel-antialiased">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Balanced Header Row flaked with minimalist rules */}
          <div className="flex items-center justify-center gap-6 mb-12 select-none">
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
            <h2 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '56px', 
                lineHeight: '56px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="tracking-normal uppercase text-center"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeVisionHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeVisionHeading', 'IMAGINE THIS INSTEAD')}
              </span>
            </h2>
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
          </div>
          
          {/* Core Content Layout Column - space-y-8 manages the clean empty lines between blocks */}
          <div className="max-w-2xl mx-auto space-y-8 text-left">
            {[
              { 
                titleKey: 'homeCard1Title', 
                descKey: 'homeCard1Desc',
                defaultTitle: 'You wake up feeling more grounded and prepared for the day ahead…',
                defaultDesc: 'Even when your child has big emotions or resists instructions, you’re able to pause, understand what’s really going on, and respond with calm instead of frustration.'
              },
              { 
                titleKey: 'homeCard2Title', 
                descKey: 'homeCard2Desc',
                defaultTitle: 'The constant power struggles start to reduce…',
                defaultDesc: 'Your home feels lighter, more predictable, and more connected.'
              },
              { 
                titleKey: 'homeCard3Title', 
                descKey: 'homeCard3Desc',
                defaultTitle: 'You begin to understand your child’s behavior instead of feeling confused by it…',
                defaultDesc: 'and instead of second-guessing yourself, you start to trust your responses.'
              },
              { 
                titleKey: 'homeCard4Title', 
                descKey: 'homeCard4Desc',
                defaultTitle: 'The guilt and overwhelm don’t define your days anymore…',
                defaultDesc: 'because you finally have practical tools that actually work in real life.'
              }
            ].map((item, idx) => (
              <div key={idx} className="w-full">
                {/* Line 1: Featured Key Points - Bold & Italic */}
                <p 
                  style={{ 
                    fontFamily: '"times new roman", times, serif',
                    fontSize: '18px',
                    fontWeight: '700', 
                    fontStyle: 'italic', 
                    lineHeight: '25.2px',
                    color: 'rgb(191, 167, 145)' 
                  }}
                  className="tracking-normal flex items-start"
                >
                  <span className="mr-2 select-none shrink-0">🤎</span>
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur(item.titleKey, e.currentTarget.innerText)}
                  >
                    {getHomeValue(item.titleKey, item.defaultTitle)}
                  </span>
                </p>

                {/* Line 2: Supporting Body Text - Drops to next line, aligned with text above */}
                <p 
                  style={{ 
                    fontFamily: '"times new roman", times, serif', 
                    fontSize: '18px',
                    fontWeight: '400', 
                    lineHeight: '27px', 
                    color: 'rgb(191, 167, 145)' 
                  }}
                  className="tracking-normal pl-7 mt-1"
                >
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur(item.descKey, e.currentTarget.innerText)}
                  >
                    {getHomeValue(item.descKey, item.defaultDesc)}
                  </span>
                </p>
              </div>
            ))}

            {/* Closing Summary Text Block - Separated by an elegant top margin gap */}
            <p 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '18px', 
                fontWeight: '700', 
                lineHeight: '25.2px', 
                color: 'rgb(191, 167, 145)' 
              }}
              className="text-center pt-8 tracking-normal"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeVisionSummary', e.currentTarget.innerText)}
              >
                {getHomeValue('homeVisionSummary', 'And slowly… parenting starts to feel less like survival, and more like connection.')}
              </span>
            </p>
          </div>

        </div>
      </section>
{/* =========================================================================
          4. THE HELP YOU NEED SECTION (EXACT WIX PIXEL-PERFECT SPECIFICATION)
          ========================================================================= */}
      <section style={{ backgroundColor: 'rgb(239, 233, 228)' }} className="w-full py-20 md:py-24 subpixel-antialiased">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Section Heading Row flaked with minimalist rules */}
          <div className="flex items-center justify-center gap-6 mb-10 select-none">
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
            <h2 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '56px', 
                lineHeight: '56px', 
                fontWeight: '400',
                color: 'rgb(191, 167, 145)'
              }}
              className="tracking-normal uppercase text-center"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHelpHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHelpHeading', 'THE HELP YOU NEED')}
              </span>
            </h2>
            <div className="w-16 h-[1px]" style={{ backgroundColor: 'rgb(191, 167, 145)' }}></div>
          </div>

          {/* Sub-headings & Intro Statements */}
          <div className="space-y-4 mb-10">
            <p 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '20px', 
                fontWeight: '700', 
                lineHeight: '28px',
                color: 'rgb(191, 167, 145)' 
              }}
              className="italic tracking-normal text-center"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHelpIntro1', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHelpIntro1', 'Ready to feel more calm, confident, and in control as a parent?')}
              </span>
            </p>
            <p 
              style={{ 
                fontFamily: '"times new roman", times, serif', 
                fontSize: '20px', 
                fontWeight: '700', 
                lineHeight: '28px',
                color: 'rgb(191, 167, 145)' 
              }}
              className="italic tracking-normal text-center"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHelpIntro2', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHelpIntro2', 'This is exactly what I help you do in the 1:1 parenting consultations')}
              </span>
            </p>
          </div>

          {/* "What you'll learn" Emphasis Subheading */}
          <p 
            style={{ 
              fontFamily: '"times new roman", times, serif', 
              fontSize: '20px', 
              fontWeight: '700', 
              lineHeight: '28px',
              color: 'rgb(191, 167, 145)' 
            }}
            className="italic tracking-normal text-center mb-8"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('homeHelpSubheading', e.currentTarget.innerText)}
            >
              {getHomeValue('homeHelpSubheading', "What you'll learn")}
            </span>
          </p>

          {/* List Items Container with precise alignment & padded line layouts */}
          <div className="max-w-2xl mx-auto text-left space-y-4 mb-12">
            {[
              { key: 'homeHelpTakeaway1', text: "Understanding your child’s behavior and emotional needs" },
              { key: 'homeHelpTakeaway2', text: "Identifying what is really behind tantrums, defiance, or shutdowns" },
              { key: 'homeHelpTakeaway3', text: "Practical strategies for responding instead of reacting" },
              { key: 'homeHelpTakeaway4', text: "Positive discipline approaches that don’t rely on shouting or punishment" },
              { key: 'homeHelpTakeaway5', text: "How to reduce daily stress and improve cooperation" },
              { key: 'homeHelpTakeaway6', text: "Clear practical strategies tailored specifically to your situation" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start tracking-normal">
                <span className="mr-3 select-none shrink-0" style={{ fontSize: '18px' }}>🤎</span>
                <p 
                  style={{ 
                    fontFamily: '"times new roman", times, serif', 
                    fontSize: '18px',
                    fontWeight: '400', 
                    lineHeight: '28.8px', 
                    color: 'rgb(191, 167, 145)' 
                  }}
                >
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur(item.key, e.currentTarget.innerText)}
                  >
                    {getHomeValue(item.key, item.text)}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <p 
            style={{ 
              fontFamily: '"times new roman", times, serif', 
              fontSize: '18px', 
              fontWeight: '400', 
              lineHeight: '25.2px', 
              color: 'rgb(191, 167, 145)' 
            }}
            className="max-w-2xl mx-auto tracking-normal mb-10 text-center"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('homeHelpClosing', e.currentTarget.innerText)}
            >
              {getHomeValue('homeHelpClosing', "Let’s work together to understand your child and create practical solutions that fit your real life.")}
            </span>
          </p>

          {/* Minimalist Square Button Match featuring crisp Avenir typography */}
          <div className="flex justify-center items-center mt-6">
            <button 
              onClick={() => navigate('/book')} 
              style={{ 
                fontFamily: 'avenir-lt-w01_35-light1475496, avenir-lt-w05_35-light, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '400',
                color: 'rgb(255, 255, 255)',
                backgroundColor: 'rgb(191, 167, 145)',
                letterSpacing: '0.1em'
              }}
              className="px-10 py-3.5 tracking-wider uppercase transition-all duration-300 hover:opacity-90 cursor-pointer rounded-none shadow-none border-none"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/20 ring-1 ring-dashed ring-white/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHelpBtnText', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHelpBtnText', 'Work With Me')}
              </span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}