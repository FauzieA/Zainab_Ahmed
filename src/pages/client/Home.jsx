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
      <section className="w-full relative overflow-hidden bg-white pt-12">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end text-center lg:text-right relative">
            <div className="relative p-6 bg-[#efe9e4]/30 border border-[#bfa791]/10 rounded-sm max-w-[360px] w-full">
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t border-l border-[#bfa791]/30"></div>
              
              <h1 className="font-serif font-normal text-4xl md:text-5xl tracking-[0.2em] text-[#bfa791] uppercase leading-[1.2] mb-3">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none block' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroTitle', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroTitle', 'Zainab A. Ahmed')}
                </span>
              </h1>
              <p className="font-serif text-xs md:text-sm tracking-[0.12em] text-[#a38c77] italic mb-6">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroSubtitle', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroSubtitle', 'Parenting & Child Development Consultant')}
                </span>
              </p>
              
              <div className="w-full aspect-[3/4] bg-[#efe9e4]/60 border border-[#bfa791]/20 rounded-xs overflow-hidden shadow-xs">
                <img 
                  src={zeeImage}
                  alt="Zainab A. Ahmed" 
                  className="w-full h-full object-cover object-center grayscale-[15%] contrast-[105%] hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-[#efe9e4]/40 border border-[#bfa791]/20 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium text-[#a38c77]">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHeroWelcomeTag', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHeroWelcomeTag', 'Welcome & Support')}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl italic text-[#a38c77] font-light tracking-wide leading-tight max-w-md">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeHeroMainHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeHeroMainHeading', 'You don\'t have to figure it out completely alone.')}
              </span>
            </h2>
            <div className="font-sans text-[14px] md:text-[15px] tracking-normal leading-relaxed space-y-4 font-light text-[#bfa791]/90">
              <p>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroP1', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroP1', 'Parenting can feel overwhelming when you\'re constantly trying to decode your child\'s behavior, navigate heavy emotional transitions, and figure out what actually works long-term. Some days feel beautifully calm... and other days feel like survival.')}
                </span>
              </p>
              <p className="font-serif italic text-lg text-[#a38c77] pt-2">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeHeroP2', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeHeroP2', 'You are not failing. You just need the right framework.')}
                </span>
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="w-full bg-[#efe9e4]/40 border-y border-[#bfa791]/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— THE REALITY —</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] mb-12 font-light">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('homeRealityHeading', e.currentTarget.innerText)}
            >
              {getHomeValue('homeRealityHeading', 'Does your home feel more chaotic than connected?')}
            </span>
          </h2>
          
          <div className="max-w-2xl mx-auto font-sans text-[14px] md:text-[15px] space-y-6 leading-relaxed font-light text-[#bfa791]/90">
            <p>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeRealityP1', e.currentTarget.innerText)}
              >
                {getHomeValue('homeRealityP1', 'You try to handle things with patience, but then exhaustion takes over. The reaction happens, followed immediately by that heavy cloud of parental guilt, promising yourself that tomorrow will be different.')}
              </span>
            </p>
            
            <div className="my-10 p-8 bg-white border border-[#bfa791]/15 rounded-xs space-y-4 shadow-2xs">
              <p className="font-serif italic text-xl text-[#a38c77] tracking-wide">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homeQuotation', e.currentTarget.innerText)}
                >
                  {getHomeValue('homeQuotation', '"Some days it feels like your mind won\'t switch off..."')}
                </span>
              </p>
              <div className="w-8 h-[1px] bg-[#bfa791]/30 mx-auto"></div>
              <div className="font-serif italic text-base md:text-lg space-y-1.5 opacity-80 text-[#bfa791]">
                <p>
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur('homeQuotationQ1', e.currentTarget.innerText)}
                  >
                    {getHomeValue('homeQuotationQ1', '"Why isn\'t my child listening to me?"')}
                  </span>
                </p>
                <p>
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur('homeQuotationQ2', e.currentTarget.innerText)}
                  >
                    {getHomeValue('homeQuotationQ2', '"Why did I lose my temper like that again?"')}
                  </span>
                </p>
                <p>
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur('homeQuotationQ3', e.currentTarget.innerText)}
                  >
                    {getHomeValue('homeQuotationQ3', '"Am I missing something critical?"')}
                  </span>
                </p>
              </div>
            </div>

            <p>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeRealityP2', e.currentTarget.innerText)}
              >
                {getHomeValue('homeRealityP2', 'You want deep closeness... but instead find yourself caught in continuous, exhausting power struggles. It leaves you wondering if this stress cycle is just what modern parenting has to look like.')}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white relative">
        <div className="absolute inset-0 opacity-10 bg-no-repeat bg-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm28-65c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm23-11c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM80 80c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 16c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm65 45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM27 70c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23634032' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        <div className="max-w-5xl mx-auto px-6 py-24 z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— THE VISION —</span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] font-light">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning={inlineEditMode}
                className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                onBlur={(e) => handleEditableBlur('homeVisionHeading', e.currentTarget.innerText)}
              >
                {getHomeValue('homeVisionHeading', 'Imagine shifting from survival to connection')}
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { 
                title: getHomeValue('homeCard1Title', 'Grounded & Prepared Days'), 
                desc: getHomeValue('homeCard1Desc', 'Even when your child faces intense emotions or resists transitions, you can pause, read the root cause, and choose a steady response instead of a reactive shortcut.'),
                titleKey: 'homeCard1Title',
                descKey: 'homeCard1Desc'
              },
              { 
                title: getHomeValue('homeCard2Title', 'Reduced Friction & Struggles'), 
                desc: getHomeValue('homeCard2Desc', 'Your home structure starts to settle into a lighter, predictable, and cooperative rhythm built on functional respect rather than loud authority.'),
                titleKey: 'homeCard2Title',
                descKey: 'homeCard2Desc'
              },
              { 
                title: getHomeValue('homeCard3Title', 'Decode the Behavior Pattern'), 
                desc: getHomeValue('homeCard3Desc', 'Instead of feeling blindsided or confused by sudden defiance, you can read exactly what your child\'s behavior is communicating.'),
                titleKey: 'homeCard3Title',
                descKey: 'homeCard3Desc'
              },
              { 
                title: getHomeValue('homeCard4Title', 'Confidence replaces Overwhelm'), 
                desc: getHomeValue('homeCard4Desc', 'The persistent second-guessing fades out because you finally hold a reliable toolkit that fits into your actual lifestyle.'),
                titleKey: 'homeCard4Title',
                descKey: 'homeCard4Desc'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-[#bfa791]/15 hover:border-[#bfa791]/40 rounded-sm transition-all duration-300 bg-[#efe9e4]/10 group">
                <div className="w-8 h-8 rounded-full bg-[#efe9e4] flex items-center justify-center text-xs text-[#a38c77] mb-4 font-serif italic group-hover:bg-[#bfa791] group-hover:text-white transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h4 className="font-serif italic text-lg md:text-xl text-[#a38c77] font-normal mb-2 leading-snug">
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur(item.titleKey, e.currentTarget.innerText)}
                  >
                    {item.title}
                  </span>
                </h4>
                <p className="font-sans text-[13px] md:text-[14px] text-[#bfa791]/80 font-light leading-relaxed">
                  <span
                    contentEditable={inlineEditMode}
                    suppressContentEditableWarning={inlineEditMode}
                    className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                    onBlur={(e) => handleEditableBlur(item.descKey, e.currentTarget.innerText)}
                  >
                    {item.desc}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#efe9e4]/30 border-t border-[#bfa791]/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— PROFESSIONAL SUPPORT —</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] mb-4 font-light">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('homeFrameworkHeading', e.currentTarget.innerText)}
            >
              {getHomeValue('homeFrameworkHeading', 'The 1:1 Consultation Architecture')}
            </span>
          </h2>
          <p className="font-serif italic text-base md:text-lg text-[#bfa791]/80 max-w-xl mx-auto mb-16">
            <span
              contentEditable={inlineEditMode}
              suppressContentEditableWarning={inlineEditMode}
              className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
              onBlur={(e) => handleEditableBlur('homeFrameworkSubtitle', e.currentTarget.innerText)}
            >
              {getHomeValue('homeFrameworkSubtitle', 'A secure space to design custom approaches tailored completely to your child\'s emotional ecosystem.')}
            </span>
          </p>

          <div className="max-w-xl mx-auto text-left grid grid-cols-1 gap-4 mb-16">
            {[
              { text: getHomeValue('homeTakeaway1', 'Deconstruct the root causes behind tantrums and shutdowns'), key: 'homeTakeaway1' },
              { text: getHomeValue('homeTakeaway2', 'Practical communication anchors that scale down power struggles'), key: 'homeTakeaway2' },
              { text: getHomeValue('homeTakeaway3', 'Positive discipline models that replace shouting with structure'), key: 'homeTakeaway3' },
              { text: getHomeValue('homeTakeaway4', 'Tools to balance parental stress and handle triggers smoothly'), key: 'homeTakeaway4' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center font-sans text-[14px] md:text-[15px] text-[#bfa791]/90 font-light p-3 bg-white border border-[#bfa791]/10 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#634032] shrink-0"></span>
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur(item.key, e.currentTarget.innerText)}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-[#bfa791]/20 rounded-xs p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xs relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#634032]/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="text-center md:text-left space-y-2 flex-1 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a38c77]">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homePanelLabel', e.currentTarget.innerText)}
                >
                  {getHomeValue('homePanelLabel', 'Private Client Advisory')}
                </span>
              </span>
              <h3 className="font-serif text-2xl italic text-[#a38c77] font-light relative">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homePanelTitle', e.currentTarget.innerText)}
                >
                  {getHomeValue('homePanelTitle', 'Personal Consultation Session')}
                </span>
                  <span className="absolute left-0 bottom-0 w-1/2 h-[1px] bg-[#634032]"></span>
              </h3>
              <p className="font-sans text-xs font-light text-[#bfa791]/80 leading-relaxed max-w-sm">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning={inlineEditMode}
                  className={inlineEditMode ? 'bg-yellow-50/40 ring-1 ring-dashed ring-[#a38c77]/40 px-1 focus:outline-none' : ''}
                  onBlur={(e) => handleEditableBlur('homePanelDescription', e.currentTarget.innerText)}
                >
                  {getHomeValue('homePanelDescription', 'A structured 60-minute evaluation session targeting your exact family dynamics.')}
                </span>
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/book')} 
              className="w-full md:w-auto bg-[#634032] text-[#efe9e4] px-8 py-3.5 font-serif italic text-base tracking-wide hover:bg-[#a38c77] rounded-xs transition-all duration-300 cursor-pointer shadow-xs whitespace-nowrap z-10"
            >
              Secure Your Session
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}