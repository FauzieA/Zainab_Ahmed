import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import zeeImage from '../../assets/zee.jpeg';
export default function Consultation({ inlineEditMode = false, externalState = null, setExternalState = null }) {
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
    <div className="min-h-screen bg-[#fff] font-serif antialiased text-[#bfa791] pt-24 selection:bg-[#efe9e4] selection:text-[#a38c77]">
      
{/* SECTION 1: HERO / INTRO OVERVIEW */}
      <section className="bg-[#efe9e4] py-20 px-6 md:px-12 transition-all duration-300">
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
                  suppressContentWarning={inlineEditMode}
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
      <section className="bg-white py-24 px-6 text-center border-y border-[#bfa791]/15">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* 1. Section Heading: THE CYCLE... */}
          <h2 
            style={{
              fontFamily: "Helvetica, 'w01-roman', sans-serif",
              fontSize: '40px',
              fontWeight: '400',
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
          
          {/* 2 & 3. Main Sequence & Secondary Text */}
          <div 
            style={{
              fontFamily: "Helvetica, 'w01-roman', sans-serif",
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

          {/* 4. Supporting Statement */}
          <div className="pt-6 border-t border-[#bfa791]/20">
            <p
              style={{
                fontFamily: "Helvetica, 'w01-roman', sans-serif",
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
      <section className="bg-[#efe9e4]/30 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-[28px] md:text-[34px] tracking-wide text-[#bfa791] font-normal leading-tight uppercase">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-white ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
                onBlur={(e) => handleEditableBlur('consultAboutTitle', e.currentTarget.innerText)}
              >
                {getConsultValue('consultAboutTitle', 'ABOUT ZAINAB AHMED')}
              </span>
            </h2>
            <div className="w-full max-w-[280px] mt-8 aspect-square rounded-full overflow-hidden bg-neutral-100 border-2 border-white shadow-xs">
              <img 
                src="/images/zainab-avatar.png" 
                alt="Zainab Ahmed Avatar Circle" 
                className="w-full h-full object-cover grayscale-10"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Zainab+Profile"; }}
              />
            </div>
            <p className="text-[13px] uppercase tracking-widest text-[#bfa791]/70 font-sans mt-4 italic">
              Parenting & Child Development Consultant
            </p>
          </div>

          <div className="md:col-span-7 space-y-6 text-[16px] md:text-[17px] text-[#bfa791] font-serif leading-relaxed text-left opacity-95">
            <p
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultAboutBio1', e.currentTarget.innerText)}
            >
              {getConsultValue('consultAboutBio1', 'I’ve always been passionate about children and the environments they grow in. That passion led me to study Early Childhood Education after earning my first degree in Business Administration. I’m currently pursuing my Master’s degree in Educational Administration and Planning, continuing to deepen my understanding of how children learn, grow, and thrive.')}
            </p>
            <p
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultAboutBio2', e.currentTarget.innerText)}
            >
              {getConsultValue('consultAboutBio2', 'But for me, it was never just about studying children. I became more interested in the people, systems, and environments shaping their everyday experiences. The parents raising them, the schools teaching them, and the communities supporting them.')}
            </p>
            <p
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-white ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultAboutBio3', e.currentTarget.innerText)}
            >
              {getConsultValue('consultAboutBio3', 'At the heart of everything I do is a simple belief: when we better understand children, we can better support them. And when children are supported well, they grow into confident, capable, and emotionally secure individuals.')}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: THE STEP-BY-STEP PROCESS */}
      <section className="bg-white py-24 px-6 md:px-12 text-center">
        <div className="max-w-5xl mx-auto">
          
          <h2 className="text-[30px] md:text-[36px] tracking-[0.2em] uppercase text-[#bfa791] font-normal mb-16">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}
              onBlur={(e) => handleEditableBlur('consultProcessTitle', e.currentTarget.innerText)}
            >
              {getConsultValue('consultProcessTitle', 'THE PROCESS')}
            </span>
          </h2>

          {/* Balanced 2x2 Clean Minimal Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 text-left items-start">
            
            {/* Step 1 */}
            <div className="space-y-2 border-l-2 border-[#efe9e4] pl-6">
              <h3 className="text-[19px] md:text-[21px] font-normal text-[#bfa791]">
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
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-[#bfa791]/90 font-serif leading-relaxed ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc1Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc1Desc', 'Choose a time that works for you and share a little about what’s been feeling difficult in your parenting journey.')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 border-l-2 border-[#efe9e4] pl-6">
              <h3 className="text-[19px] md:text-[21px] font-normal text-[#bfa791]">
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
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-[#bfa791]/90 font-serif leading-relaxed ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc2Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc2Desc', 'During our session, we’ll explore your child’s behavior, your current challenges, daily patterns, triggers, routines, and emotional dynamics—without judgment or pressure.')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 border-l-2 border-[#efe9e4] pl-6">
              <h3 className="text-[19px] md:text-[21px] font-normal text-[#bfa791]">
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
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-[#bfa791]/90 font-serif leading-relaxed ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc3Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc3Desc', 'Together, we’ll uncover what may be happening beneath the behavior so you can respond with more clarity, confidence, and calm. You’ll leave with realistic strategies and tools tailored to your child, your parenting style, and your everyday life')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-2 border-l-2 border-[#efe9e4] pl-6">
              <h3 className="text-[19px] md:text-[21px] font-normal text-[#bfa791]">
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
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`text-[15px] md:text-[16px] text-[#bfa791]/90 font-serif leading-relaxed ${inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791] px-1' : ''}`}
                onBlur={(e) => handleEditableBlur('consultProc4Desc', e.currentTarget.innerText)}
              >
                {getConsultValue('consultProc4Desc', 'Parenting support doesn’t end after one conversation. Follow-up sessions help us check progress, adjust strategies where needed, answer new concerns, and continue supporting you as your child grows and changes.')}
              </p>
            </div>

          </div>

          {/* Final Call to Action Link */}
          <div className="mt-20 pt-4">
            <Link 
              to="/book"
              className="px-10 py-4 bg-[#bfa791] text-white font-sans text-[13px] uppercase tracking-[0.2em] rounded-xs shadow-xs hover:bg-[#a38c77] transition-colors duration-300 inline-block"
            >
              Book Session
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}