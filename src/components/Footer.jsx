import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#efe9e4]/20 border-t border-[#bfa791]/20 pt-16 pb-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Brand Statement (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-serif text-2xl tracking-[0.18em] text-[#634032] uppercase font-normal">
            Zainab A. Ahmed
          </h3>
          <p className="font-serif italic text-xs text-[#a38c77] tracking-wide max-w-xs leading-relaxed">
            Dedicated to helping parents move past survival mode and build deep, resilient connections with their children.
          </p>
        </div>

        {/* Middle Column: Navigation Quick Links (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#634032]">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs font-light text-[#bfa791]">
            <li>
              <Link to="/" className="hover:text-[#634032] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              {/* This matches your Book component route */}
              <Link to="/book" className="hover:text-[#634032] transition-colors duration-200">
                Book Session
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#634032] transition-colors duration-200">
                Privacy & Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Premium Structured Contact (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#634032]">
            Connect & Inquire
          </h4>
          <div className="flex flex-col gap-3 text-xs font-light text-[#bfa791]">
            <div className="flex justify-between border-b border-[#bfa791]/10 pb-1.5">
              <span className="opacity-60">Email</span>
              <a href="mailto:zainaabahmed05@gmail.com" className="hover:text-[#634032] font-normal transition-colors duration-200">
                zainaabahmed05@gmail.com
              </a>
            </div>
            <div className="flex justify-between border-b border-[#bfa791]/10 pb-1.5">
              <span className="opacity-60">Instagram</span>
              <a href="https://instagram.com/zaiinaab.ahmed" target="_blank" rel="noreferrer" className="hover:text-[#634032] font-normal transition-colors duration-200">
                @zaiinaab.ahmed
              </a>
            </div>
            <div className="flex justify-between opacity-80 pt-1">
              <span className="opacity-60">Location</span>
              <span className="font-normal text-[#634032]">Nigeria / Available Globally</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-6 border-t border-[#bfa791]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#bfa791]/70 font-light">
        <div>
          © {new Date().getFullYear()} Zainab A. Ahmed. All rights reserved.
        </div>
        <div className="flex items-center gap-1 opacity-80">
          <span> Secure Private Advisory Gateway</span>
        </div>
      </div>
    </footer>
  );
}