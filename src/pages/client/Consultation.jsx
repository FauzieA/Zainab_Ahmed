import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import zeeImage from '../../assets/zee.jpeg';

// Custom lightweight Intersection Observer wrapper hook for elegant scroll fading
function useScrollFadeIn() {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.disconnect();
    };
  }, []);

  return elementRef;
}

export default function Consultation({ inlineEditMode = false, externalState = null, setExternalState = null }) {
  const [liveContent, setLiveContent] = useState(null);

  // Initialize animation refs for each major section
  const heroRef = useScrollFadeIn();
  const cycleRef = useScrollFadeIn();
  const bioRef = useScrollFadeIn();
  const processRef = useScrollFadeIn();

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
  const getConsultValue = (key, defaultValue) => {
    if (inlineEditMode && externalState && externalState[key] !== undefined) {
      return externalState[key];
    }
    if (!inlineEditMode && liveContent && liveContent[key] !== undefined) {
      return liveContent[key];
    }
    return defaultValue;
  };

  return (
    /* CHANGED: Changed pt-24 to pt-0 md:pt-24 so the entire wrapper wrapper does not push down on mobile */
    <div className="min-h-screen bg-[#fff] font-serif antialiased text-[#bfa791] pt-0  selection:bg-[#efe9e4] selection:text-[#a38c77] overflow-x-hidden">
      
{/* SECTION 1: HERO / INTRO OVERVIEW */}
      <section 
        ref={heroRef}
        /* CHANGED: Changed py-20 to pt-12 pb-20 md:py-20 to trim the remaining top-heavy padding area on mobile screens */
        className="bg-[#efe9e4] pt-12 pb-20 md:py-20 px-6 md:px-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Stacked Title Left-Aligned Directly Above Your Imported Image */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 
                style={{ 
                  fontFamily: "'Times New Roman', times, serif",
                  fontSize: '82px',
                  fontWeight: '400',
                  lineHeight: '82px',
                  letterSpacing: '-4.1px',
                  color: 'rgb(191, 167, 145)'
                }}
                className="uppercase select-all w-full"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block' : 'block'}
                  onBlur={(e) => handleEditableBlur('consultHeroFirstName', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroFirstName', 'ZAINAB')}
                </span>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block mt-2' : 'block mt-2'}
                  onBlur={(e) => handleEditableBlur('consultHeroLastName', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroLastName', 'AHMED')}
                </span>
              </h1>

              {/* Portrait Frame - Utilizing your imported zeeImage variable */}
              <div className="w-full max-w-[360px] mt-10 aspect-[3/4] bg-[#fff] overflow-hidden border border-[#bfa791]/10 rounded-xs shadow-xs">
                <img 
                  src={zeeImage} 
                  alt="Zainab Ahmed Portrait Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Inline Typography Content Block */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-left md:pt-48">
              
              {/* Section Heading */}
              <h2 
                style={{
                  fontFamily: "Helvetica, 'w01-roman', sans-serif",
                  fontSize: '30px',
                  fontWeight: '700',
                  color: 'rgb(191, 167, 145)'
                }}
                className="mb-8 tracking-tight text-center md:text-left w-full"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultHeroTitle', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroTitle', 'Why 1:1 Parenting Consultation?')}
                </span>
              </h2>
              
              {/* Body Paragraphs block */}
              <div 
                style={{
                  fontFamily: "'Times New Roman', times, serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  lineHeight: '25.2px',
                  color: 'rgb(191, 167, 145)'
                }}
                className="space-y-6 text-justify md:text-left"
              >
                <p
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultHeroText1', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroText1', 'Raising and supporting children comes with moments of uncertainty, burnout, and “what do we do next?” I understand how you feel.')}
                </p>
                <p
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultHeroText2', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroText2', 'There are moments in parenting when you feel tired, unsure, and even overwhelmed by your child’s behavior or emotions. You may be trying different things and still feeling stuck.')}
                </p>
                <p
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultHeroText3', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultHeroText3', 'I want you to know this: you’re not alone, and nothing is “wrong” with you as a parent. I’m here to walk with you, offering support that helps you feel more grounded, calm, and confident in your parenting journey.')}
                </p>
              </div>

              {/* Call to Action Button */}
              <div className="mt-10 w-full flex justify-center md:justify-start">
                <Link 
                  to="/book"
                  style={{
                    fontFamily: "Helvetica, 'w01-roman', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: 'rgb(255, 255, 255)',
                    backgroundColor: 'rgb(191, 167, 145)'
                  }}
                  className="px-10 py-3.5 tracking-[0.15em] uppercase transition-colors duration-300 hover:bg-[#634032] text-center"
                >
                  Book Session
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: THE CYCLE SEGMENT */}
      <section 
        ref={cycleRef}
        className="bg-white py-24 px-6 text-center opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Section Heading: THE CYCLE... */}
          <h2 
            style={{
              fontFamily: "Helvetica, 'w01-roman', sans-serif",
              fontSize: '40px',
              fontWeight: '550',
              lineHeight: '40px',
              letterSpacing: '-2px',
              color: 'rgb(191, 167, 145)'
            }}
            className="mb-8"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultCycleTitle', e.currentTarget.innerText)}
            >
              {getConsultValue('consultCycleTitle', 'THE CYCLE...')}
            </span>
          </h2>
          
          {/* Main Sequence & Secondary Text */}
          <div 
            style={{
              fontFamily: "'Times New Roman', times, serif",
              fontSize: '18px',
              fontWeight: '400',
              lineHeight: '25.2px',
              color: 'rgb(191, 167, 145)'
            }}
            className="space-y-4"
          >
            <p
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block' : 'block'}
              onBlur={(e) => handleEditableBlur('consultCycleText1', e.currentTarget.innerText)}
            >
              {getConsultValue('consultCycleText1', 'The overwhelm → the frustration → the guilt → the confusion → the exhaustion.')}
            </p>
            <p
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block' : 'block'}
              onBlur={(e) => handleEditableBlur('consultCycleText2', e.currentTarget.innerText)}
            >
              {getConsultValue('consultCycleText2', 'And then starting all over again.')}
            </p>
          </div>

          {/* Supporting Statement (No border/line) */}
          <div className="pt-6">
            <p
              style={{
                fontFamily: "'Times New Roman', times, serif",
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '25.2px',
                color: 'rgb(191, 167, 145)'
              }}
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={`max-w-2xl mx-auto ${inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
              onBlur={(e) => handleEditableBlur('consultCycleText3', e.currentTarget.innerText)}
            >
              {getConsultValue('consultCycleText3', 'If this feels like your reality right now, I want you to know I see it—and I’m here to help you move from overwhelm to understanding, and from reaction to calm confidence in your parenting.')}
            </p>
          </div>
        </div>
      </section>

     {/* SECTION 3: DEEP EXTENDED BIO */}
      <section 
        ref={bioRef}
        className="bg-[#efe9e4] py-12 px-6 md:px-12 opacity-0 translate-y-8 transition-all duration-[1100ms] ease-out"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-28 items-start">
          
          {/* Left Column: Stacked Title Left-Aligned Directly Above Managed Image Frame */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 
              style={{ 
                fontFamily: "'Times New Roman', times, serif",
                fontSize: '44px',
                fontWeight: '400',
                lineHeight: '48px',
                letterSpacing: '-1.5px',
                color: 'rgb(191, 167, 145)'
              }}
              className="uppercase mb-8 w-full text-center md:text-left"
            >
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block' : 'block'}
                onBlur={(e) => handleEditableBlur('consultAboutHeader1', e.currentTarget.innerText)}
              >
                {getConsultValue('consultAboutHeader1', 'ABOUT')}
              </span>
              <div className="mt-2">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1 block' : 'block'}
                  onBlur={(e) => handleEditableBlur('consultAboutHeader2', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultAboutHeader2', 'ZAINAB AHMED')}
                </span>
              </div>
            </h2>

            {/* Slightly reduced max-width portrait layout frame to sit even with right content flow height */}
            <div className="w-full max-w-[300px] max-h-[350px] aspect-[3/4] bg-[#fff] overflow-hidden border border-[#bfa791]/10 rounded-xs shadow-xs">
              <img 
                src={zeeImage} 
                alt="Zainab Ahmed Portrait Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bold and Italic Consultant Title - Placed Directly Underneath the Image Container */}
            <p className="text-[12px] md:text-[15px]  text-[#bfa791] font-sans mt-5 italic font-bold w-full text-center md:text-left">
              Parenting & Child Development Consultant
            </p>
          </div>

          {/* Right Column: Expanded Width Text Layout Block */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-left md:pt-36">
            
            {/* Body Paragraphs - Swapped to global text-justify alignment */}
            <div 
              style={{
                fontFamily: "'Times New Roman', times, serif",
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '25.2px',
                color: 'rgb(191, 167, 145)'
              }}
              className="space-y-6 text-justify w-full"
            >
              <p
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                onBlur={(e) => handleEditableBlur('consultAboutBio1', e.currentTarget.innerText)}
              >
                {inlineEditMode ? (
                  getConsultValue('consultAboutBio1', "I’ve always been passionate about children and the environments they grow in. That passion led me to study Early Childhood Education after earning my first degree in Business Administration. I’m currently pursuing my Master’s degree in Educational Administration and Planning, continuing to deepen my understanding of how children learn, grow, and thrive.")
                ) : (
                  <>
                    <strong className="italic font-bold">I’ve always been passionate about children and the environments they grow in.</strong>
                    {" That passion led me to study Early Childhood Education after earning my first degree in Business Administration. I’m currently pursuing my Master’s degree in Educational Administration and Planning, continuing to deepen my understanding of how children learn, grow, and thrive."}
                  </>
                )}
              </p>
              
              <p
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                onBlur={(e) => handleEditableBlur('consultAboutBio2', e.currentTarget.innerText)}
              >
                {inlineEditMode ? (
                  getConsultValue('consultAboutBio2', "But for me, it was never just about studying children. I became more interested in the people, systems, and environments shaping their everyday experiences. The parents raising them, the schools teaching them, and the communities supporting them.")
                ) : (
                  <>
                    {"But for me, it was never just about studying children. I became more interested in the "}
                    <strong className="italic font-bold">people, systems, and environments</strong>
                    {" shaping their everyday experiences. The parents raising them, the schools teaching them, and the communities supporting them."}
                  </>
                )}
              </p>

              <p
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-white/80 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                onBlur={(e) => handleEditableBlur('consultAboutBio3', e.currentTarget.innerText)}
              >
                {getConsultValue('consultAboutBio3', 'At the heart of everything I do is a simple belief: when we better understand children, we can better support them. And when children are supported well, they grow into confident, capable, and emotionally secure individuals.')}
              </p>
            </div>
          </div>

        </div>
      </section>

{/* SECTION 4: THE STEP-BY-STEP PROCESS */}
      <section 
        ref={processRef}
        className="bg-white py-24 px-6 md:px-12 text-center opacity-0 translate-y-8 transition-all duration-[1200ms] ease-out"
      >
        <div className="max-w-5xl mx-auto">
          
          {/* Main Section Header */}
          <h2 
            style={{ 
              fontFamily: "'Times New Roman', times, serif",
              color: 'rgb(191, 167, 145)'
            }}
            className="text-[36px] md:text-[44px] tracking-[0.15em] uppercase font-normal mb-20"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultProcessTitle', e.currentTarget.innerText)}
            >
              {getConsultValue('consultProcessTitle', 'THE PROCESS')}
            </span>
          </h2>

          {/* Clean Minimal Matrix Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 text-center items-start relative">
            
            {/* Vertical Center Divider for Desktop Layouts */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-[#efe9e4] transform -translate-x-1/2" />

            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4 px-4">
              <h3 
                style={{ fontFamily: "'Times New Roman', times, serif", color: 'rgb(191, 167, 145)' }}
                className="text-[22px] md:text-[24px] font-normal tracking-wide"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultProc1Title', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultProc1Title', 'Book Consultation')}
                </span>
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Times New Roman', times, serif", 
                  color: 'rgb(191, 167, 145)',
                  lineHeight: '26px'
                }}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-center max-w-sm ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc1Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc1Desc', 'Choose a time that works for you and share a little about what’s been feeling difficult in your parenting journey.')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4 px-4">
              <h3 
                style={{ fontFamily: "'Times New Roman', times, serif", color: 'rgb(191, 167, 145)' }}
                className="text-[22px] md:text-[24px] font-normal tracking-wide"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultProc2Title', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultProc2Title', 'Discovery')}
                </span>
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Times New Roman', times, serif", 
                  color: 'rgb(191, 167, 145)',
                  lineHeight: '26px'
                }}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-center max-w-sm ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc2Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc2Desc', 'During our session, we’ll explore your child’s behavior, your current challenges, daily patterns, triggers, routines, and emotional dynamics—without judgment or pressure.')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4 px-4">
              <h3 
                style={{ fontFamily: "'Times New Roman', times, serif", color: 'rgb(191, 167, 145)' }}
                className="text-[22px] md:text-[24px] font-normal tracking-wide max-w-xs leading-tight"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultProc3Title', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultProc3Title', 'Personalized Support')}
                </span>
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Times New Roman', times, serif", 
                  color: 'rgb(191, 167, 145)',
                  lineHeight: '26px'
                }}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-center max-w-sm ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc3Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc3Desc', 'Together, we’ll uncover what may be happening beneath the behavior so you can respond with more clarity, confidence, and calm. You’ll leave with realistic strategies and tools tailored to your child, your parenting style, and your everyday life')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-4 px-4">
              <h3 
                style={{ fontFamily: "'Times New Roman', times, serif", color: 'rgb(191, 167, 145)' }}
                className="text-[22px] md:text-[24px] font-normal tracking-wide"
              >
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                  onBlur={(e) => handleEditableBlur('consultProc4Title', e.currentTarget.innerText)}
                >
                  {getConsultValue('consultProc4Title', 'Follow-up')}
                </span>
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Times New Roman', times, serif", 
                  color: 'rgb(191, 167, 145)',
                  lineHeight: '26px'
                }}
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-center max-w-sm ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc4Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc4Desc', 'Parenting support doesn’t end after one conversation. Follow-up sessions help us check progress, adjust strategies where needed, answer new concerns, and continue supporting you as your child grows and changes.')}
              </p>
            </div>

          </div>

          {/* Call to Action Button */}
          <div className="mt-24">
            <Link 
              to="/book"
              style={{ fontFamily: "'Times New Roman', times, serif" }}
              className="px-12 py-3 bg-[#bca693] text-white text-[16px] tracking-wide rounded-none hover:bg-[#a99380] transition-colors duration-300 inline-block"
            >
              Book Session
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}