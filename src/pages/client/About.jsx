import React, { useState, useEffect, useRef } from 'react';
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
          observer.unobserve(entry.target); // Stops tracking once animated in
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' } // Fires slightly before full entry
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

export default function About({ inlineEditMode = false, externalState = null, setExternalState = null }) {
  const [liveContent, setLiveContent] = useState(null);

  // Hook assignments for distinct scroll animation triggers
  const bioHeaderRef = useScrollFadeIn();
  const bioFrameRef = useScrollFadeIn();
  const bioRightTextRef = useScrollFadeIn();
  const beyondSectionRef = useScrollFadeIn();

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
  const getAboutValue = (key, defaultValue) => {
    if (inlineEditMode && externalState && externalState[key] !== undefined) {
      return externalState[key];
    }
    if (!inlineEditMode && liveContent && liveContent[key] !== undefined) {
      return liveContent[key];
    }
    return defaultValue;
  };

  return (
    <div className="min-h-screen font-serif antialiased selection:bg-[#bfa791]/10 selection:text-[#bfa791] overflow-x-hidden">
      
      {/* SECTION 1: BIO & MAIN PROFILE */}
      <section 
        style={{ backgroundColor: 'rgb(239, 233, 228)' }} 
        className="text-[#bfa791] pt-28 pb-24 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Headings, Image and Subtitle Anchor (Sticky Wrapper) */}
          <div className="md:col-span-5 space-y-6 md:sticky md:top-28">
            
            {/* Headers Wrapper animated independently */}
            <div 
              ref={bioHeaderRef}
              className="space-y-1 text-left opacity-0 translate-y-8 transition-all duration-1000 ease-out"
            >
              <h1 className="text-[40px] leading-[48px] font-normal uppercase tracking-[0.05em] text-[#bfa791]">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none block' : ''}
                  onBlur={(e) => handleEditableBlur('aboutHeading1', e.currentTarget.innerText)}
                >
                  {getAboutValue('aboutHeading1', 'ABOUT')}
                </span>
              </h1>
              <h2 className="text-[40px] leading-[48px] font-normal uppercase tracking-[0.05em] text-[#bfa791]">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none block' : ''}
                  onBlur={(e) => handleEditableBlur('aboutHeading2', e.currentTarget.innerText)}
                >
                  {getAboutValue('aboutHeading2', 'ZAINAB AHMED')}
                </span>
              </h2>
            </div>

            {/* Premium Image Frame and Label animated as a single unit */}
            <div 
              ref={bioFrameRef}
              className="opacity-0 translate-y-8 transition-all duration-[1200ms] delay-100 ease-out"
            >
              <div className="w-full aspect-[3/4] bg-white/40 border border-[#bfa791]/30 rounded-xs overflow-hidden shadow-2xs">
                <img 
                  src={zeeImage}
                  alt="Zainab Ahmed" 
                  className="w-full h-full object-cover object-center grayscale-[10%] contrast-[102%] scale-102 hover:scale-100 transition-transform duration-700 ease-out"
                />
              </div>

              <p className="text-[18px] leading-[25.2px] font-bold italic text-[#bfa791] text-center tracking-wide pt-4">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('aboutImgSubtitle', e.currentTarget.innerText)}
                >
                  {getAboutValue('aboutImgSubtitle', 'Parenting & Child Development Consultant')}
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Narrative Editorial Bio Elements */}
          <div 
            ref={bioRightTextRef}
            className="md:col-span-7 space-y-7 text-[18px] leading-[28.8px] font-normal text-[#bfa791] tracking-normal pt-4 md:pt-24 opacity-0 translate-y-8 transition-all duration-[1200ms] delay-200 ease-out"
          >
            <p className="transform hover:translate-x-0.5 transition-transform duration-300">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={`font-bold italic text-[#bfa791] ${inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none mr-1' : ''}`}
                onBlur={(e) => handleEditableBlur('aboutBioP1Bold', e.currentTarget.innerText)}
              >
                {getAboutValue('aboutBioP1Bold', 'I’ve always been passionate about children and the environments they grow in.')}
              </span>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('aboutBioP1Normal', e.currentTarget.innerText)}
              >
                {getAboutValue('aboutBioP1Normal', ' That passion led me to study Early Childhood Education after earning my first degree in Business Administration. I’m currently pursuing my Master’s degree in Educational Administration and Planning, continuing to deepen my understanding of how children learn, grow, and thrive.')}
              </span>
            </p>

            <p className="transform hover:translate-x-0.5 transition-transform duration-300">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none block' : ''}
                onBlur={(e) => handleEditableBlur('aboutBioP2', e.currentTarget.innerText)}
              >
                {getAboutValue('aboutBioP2', 'What started as a passion for child development slowly grew into a deeper desire to support not just children, but the adults and systems shaping their everyday lives.')}
              </span>
            </p>

            <p className="transform hover:translate-x-0.5 transition-transform duration-300">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none block' : ''}
                onBlur={(e) => handleEditableBlur('aboutBioP3', e.currentTarget.innerText)}
              >
                {getAboutValue('aboutBioP3', 'I support parents as they navigate the ups and downs of raising children, and I also help schools and organizations build more intentional, child-friendly systems where children can feel safe, supported, confident, and seen.')}
              </span>
            </p>

            <p className="transform hover:translate-x-0.5 transition-transform duration-300">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-100/50 ring-1 ring-dashed ring-[#634032]/30 px-1 focus:outline-none block' : ''}
                onBlur={(e) => handleEditableBlur('aboutBioP4', e.currentTarget.innerText)}
              >
                {getAboutValue('aboutBioP4', 'At the heart of everything I do is a simple belief: when we better understand children, we can better support them. And when children are supported well, they grow into confident, capable, and emotionally secure individuals.')}
              </span>
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 2: BEYOND WORK */}
      <section 
        style={{ backgroundColor: 'rgb(255, 255, 255)' }} 
        className="w-full text-[#bfa791] py-24 border-t border-[#bfa791]/10 transition-colors duration-300"
      >
        <div 
          ref={beyondSectionRef}
          className="max-w-3xl mx-auto px-8 text-center space-y-8 opacity-0 translate-y-8 transition-all duration-[1000ms] ease-out"
        >
          
          {/* Centered Heading with Tighter Letter Spacing */}
          <h2 
            style={{ letterSpacing: '-2px', lineHeight: '40px' }}
            className="text-[40px] font-normal uppercase text-[#bfa791]"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791]/40 px-2 focus:outline-none inline-block' : ''}
              onBlur={(e) => handleEditableBlur('aboutBeyondHeading', e.currentTarget.innerText)}
            >
              {getAboutValue('aboutBeyondHeading', 'BEYOND WORK')}
            </span>
          </h2>

          {/* Centered Breathable Narrative Body block */}
          <p 
            style={{ lineHeight: '32.4px' }}
            className="text-[18px] font-normal text-[#bfa791] max-w-2xl mx-auto tracking-normal"
          >
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50 ring-1 ring-dashed ring-[#bfa791]/40 px-2 focus:outline-none block text-left md:text-center' : ''}
              onBlur={(e) => handleEditableBlur('aboutBeyondBody', e.currentTarget.innerText)}
            >
              {getAboutValue(
                'aboutBeyondBody', 
                "Outside of my work, I'm someone who genuinely enjoys learning, creating meaningful ideas, and having conversations that inspire growth and positive change. I am a Multipotentialite trying to balance a corporate job, exploring different passions & trying sooo many things at once, and learning to trust Allah's perfect plan through every season."
              )}
            </span>
          </p>

        </div>
      </section>

    </div>
  );
}