import React from 'react';
import { useNavigate } from 'react-router-dom';
import zeeImage from '../../assets/zee.jpeg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#bfa791] font-sans antialiased selection:bg-[#efe9e4] selection:text-[#a38c77]">
      
      {/* SECTION 1: ELEGANT ASYMMETRIC HERO */}
      <section className="w-full relative overflow-hidden bg-white pt-12">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Box: Warm Profile Frame Container (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end text-center lg:text-right relative">
            <div className="relative p-6 bg-[#efe9e4]/30 border border-[#bfa791]/10 rounded-sm max-w-[360px] w-full">
              {/* Floating decorative clean line layout asset */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t border-l border-[#bfa791]/30"></div>
              
              <h1 className="font-serif font-normal text-4xl md:text-5xl tracking-[0.2em] text-[#bfa791] uppercase leading-[1.2] mb-3">
                Zainab <br className="hidden md:inline"/>A. Ahmed
              </h1>
              <p className="font-serif text-xs md:text-sm tracking-[0.12em] text-[#a38c77] italic mb-6">
                Parenting & Child Development Consultant
              </p>
              
              {/* Premium Fine-Border Image Display Box linking to your asset */}
              <div className="w-full aspect-[3/4] bg-[#efe9e4]/60 border border-[#bfa791]/20 rounded-xs overflow-hidden shadow-xs">
                <img 
                  src={zeeImage}
                  alt="Zainab A. Ahmed" 
                  className="w-full h-full object-cover object-center grayscale-[15%] contrast-[105%] hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              </div>
            </div>
          </div>

          {/* Right Column Box: Welcoming Context Card (6 cols) */}
          <div className="lg:col-span-6 space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-[#efe9e4]/40 border border-[#bfa791]/20 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium text-[#a38c77]">
              Welcome & Support
            </div>
            <h2 className="font-serif text-3xl md:text-4xl italic text-[#a38c77] font-light tracking-wide leading-tight max-w-md">
              You don't have to figure it out completely alone.
            </h2>
            <div className="font-sans text-[14px] md:text-[15px] tracking-normal leading-relaxed space-y-4 font-light text-[#bfa791]/90">
              <p>
                Parenting can feel overwhelming when you're constantly trying to decode your child's behavior, navigate heavy emotional transitions, and figure out what actually works long-term. Some days feel beautifully calm... and other days feel like survival.
              </p>
              <p className="font-serif italic text-lg text-[#a38c77] pt-2">
                You are not failing. You just need the right framework.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: EDITORIAL PAIN POINTS BLOCK */}
      <section className="w-full bg-[#efe9e4]/40 border-y border-[#bfa791]/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— THE REALITY —</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] mb-12 font-light">
            Does your home feel more chaotic than connected?
          </h2>
          
          <div className="max-w-2xl mx-auto font-sans text-[14px] md:text-[15px] space-y-6 leading-relaxed font-light text-[#bfa791]/90">
            <p>
              You try to handle things with patience, but then exhaustion takes over. The reaction happens, followed immediately by that heavy cloud of parental guilt, promising yourself that tomorrow will be different.
            </p>
            
            {/* Elegant Quotation Spotlight Grid */}
            <div className="my-10 p-8 bg-white border border-[#bfa791]/15 rounded-xs space-y-4 shadow-2xs">
              <p className="font-serif italic text-xl text-[#a38c77] tracking-wide">
                "Some days it feels like your mind won't switch off..."
              </p>
              <div className="w-8 h-[1px] bg-[#bfa791]/30 mx-auto"></div>
              <div className="font-serif italic text-base md:text-lg space-y-1.5 opacity-80 text-[#bfa791]">
                <p>“Why isn't my child listening to me?”</p>
                <p>“Why did I lose my temper like that again?”</p>
                <p>“Am I missing something critical?”</p>
              </div>
            </div>

            <p>
              You want deep closeness... but instead find yourself caught in continuous, exhausting power struggles. It leaves you wondering if this stress cycle is just what modern parenting has to look like.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE TRANSFORMATION CARDS */}
      <section className="w-full bg-white relative">
          {/* Subtle geometric overlay with the coffee brown color */}
          <div className="absolute inset-0 opacity-10 bg-no-repeat bg-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm28-65c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm23-11c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM80 80c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 16c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm65 45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM27 70c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23634032' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        <div className="max-w-5xl mx-auto px-6 py-24 z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— THE VISION —</span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] font-light">
              Imagine shifting from survival to connection
            </h2>
          </div>
          
          {/* 2x2 Clean Minimal Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Grounded & Prepared Days", desc: "Even when your child faces intense emotions or resists transitions, you can pause, read the root cause, and choose a steady response instead of a reactive shortcut." },
              { title: "Reduced Friction & Struggles", desc: "Your home structure starts to settle into a lighter, predictable, and cooperative rhythm built on functional respect rather than loud authority." },
              { title: "Decode the Behavior Pattern", desc: "Instead of feeling blindsided or confused by sudden defiance, you can read exactly what your child's behavior is communicating." },
              { title: "Confidence replaces Overwhelm", desc: "The persistent second-guessing fades out because you finally hold a reliable toolkit that fits into your actual lifestyle." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-[#bfa791]/15 hover:border-[#bfa791]/40 rounded-sm transition-all duration-300 bg-[#efe9e4]/10 group">
                <div className="w-8 h-8 rounded-full bg-[#efe9e4] flex items-center justify-center text-xs text-[#a38c77] mb-4 font-serif italic group-hover:bg-[#bfa791] group-hover:text-white transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h4 className="font-serif italic text-lg md:text-xl text-[#a38c77] font-normal mb-2 leading-snug">
                  {item.title}
                </h4>
                <p className="font-sans text-[13px] md:text-[14px] text-[#bfa791]/80 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE FRAMEWORK OFFERING */}
      <section className="w-full bg-[#efe9e4]/30 border-t border-[#bfa791]/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a38c77]/70 font-medium block mb-3">— PROFESSIONAL SUPPORT —</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-[#a38c77] mb-4 font-light">
            The 1:1 Consultation Architecture
          </h2>
          <p className="font-serif italic text-base md:text-lg text-[#bfa791]/80 max-w-xl mx-auto mb-16">
            A secure space to design custom approaches tailored completely to your child's emotional ecosystem.
          </p>

          {/* Core Takeaways layout with the coffee brown dots */}
          <div className="max-w-xl mx-auto text-left grid grid-cols-1 gap-4 mb-16">
            {[
              "Deconstruct the root causes behind tantrums and shutdowns",
              "Practical communication anchors that scale down power struggles",
              "Positive discipline models that replace shouting with structure",
              "Tools to balance parental stress and handle triggers smoothly"
            ].map((text, idx) => (
              <div key={idx} className="flex gap-4 items-center font-sans text-[14px] md:text-[15px] text-[#bfa791]/90 font-light p-3 bg-white border border-[#bfa791]/10 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#634032] shrink-0"></span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Premium Call to Action Frame */}
          <div className="max-w-2xl mx-auto bg-white border border-[#bfa791]/20 rounded-xs p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xs relative">
            {/* Corner element in coffee brown */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#634032]/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="text-center md:text-left space-y-2 flex-1 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a38c77]">Private Client Advisory</span>
              <h3 className="font-serif text-2xl italic text-[#a38c77] font-light relative">Personal Consultation Session
                  {/* Subtle underline in coffee brown */}
                  <span className="absolute left-0 bottom-0 w-1/2 h-[1px] bg-[#634032]"></span>
              </h3>
              <p className="font-sans text-xs font-light text-[#bfa791]/80 leading-relaxed max-w-sm">
                A structured 60-minute evaluation session targeting your exact family dynamics.
              </p>
            </div>
            
            {/* Button in coffee brown with beige text */}
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