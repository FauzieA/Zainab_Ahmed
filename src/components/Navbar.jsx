import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitors page scrolling to add an elegant background blur when moving down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown if clicking outside of the navigation panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically close the menu panel whenever the active route path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isDropdownActive = ['/about', '/consultation', '/resources', '/contact'].includes(location.pathname);

  return (
    /* CHANGED: Removed pb-6 on mobile to keep a tight, elegant header box constraint */
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b
      ${isScrolled || isMobileMenuOpen
        ? 'bg-white/95 backdrop-blur-md border-[#bfa791]/15 py-4 shadow-2xs' 
        : 'bg-white/0 border-transparent py-5'
      }`}
    >
      {/* CHANGED: Swapped flex-wrap to flex-nowrap to keep logo and navigation items securely pinned on a single horizontal row */}
      <div className="max-w-6xl mx-auto px-6 flex flex-nowrap items-center justify-between gap-x-4">
        
        {/* Brand/Logo Area */}
        {/* CHANGED: Added whitespace-nowrap and shrunk text size safely on small viewports so the brand name never breaks down into two lines */}
        <Link 
          to="/" 
          className="font-serif text-[16px] sm:text-xl tracking-[0.15em] sm:tracking-[0.18em] text-[#634032] uppercase font-normal transition-opacity duration-200 hover:opacity-80 whitespace-nowrap"
        >
          Zainab A. Ahmed
        </Link>

        {/* Clean Editorial Navigation Cluster */}
        {/* CHANGED: Swapped gap-8 to gap-4 on mobile (md:gap-8) so items don't crowd the viewport edges */}
        <div ref={dropdownRef} className="flex items-center gap-4 md:gap-8 text-[14px] tracking-wide font-sans">
          
          {/* Home Nav Item */}
          <Link 
            to="/" 
            className={`transition-colors duration-200 relative py-1
              ${location.pathname === '/' 
                ? 'text-[#634032] font-normal' 
                : 'text-[#bfa791] hover:text-[#634032]'
              }`}
          >
            Home
          </Link>

          {/* "More" Click & Hover Dropdown Container */}
          <div className="relative py-1 group">
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors duration-200 flex items-center gap-1 cursor-pointer select-none bg-transparent border-none p-0 text-[14px] tracking-wide font-sans outline-none
                ${isDropdownActive 
                  ? 'text-[#634032] font-normal' 
                  : 'text-[#bfa791] hover:text-[#634032]'
                }`}
            >
              More
              <svg 
                className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-180' : 'group-hover:rotate-180'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Panel */}
            {/* CHANGED: Fixed alignment cut-off bug from IMG_3848.jpg by setting absolute coordinates to right-[-12px] on mobile and restoring right-0 on desktop screens */}
            <div className={`absolute right-[-12px] md:right-0 top-full pt-3 w-52 sm:w-56 transition-all duration-200 ease-out z-50
              ${isMobileMenuOpen 
                ? 'opacity-100 visible' 
                : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}
            >
              <div className="bg-white border border-[#bfa791]/20 shadow-sm py-1.5 flex flex-col text-left rounded-xs">
                
                <Link 
                  to="/about" 
                  className={`px-4 py-2.5 text-[13px] transition-colors duration-150
                    ${location.pathname === '/about' 
                      ? 'bg-[#efe9e4]/50 text-[#634032] font-medium' 
                      : 'text-[#bfa791] hover:bg-[#efe9e4]/30 hover:text-[#634032]'
                    }`}
                >
                  About Me
                </Link>

                <Link 
                  to="/consultation" 
                  className={`px-4 py-2.5 text-[13px] transition-colors duration-150
                    ${location.pathname === '/consultation' 
                      ? 'bg-[#efe9e4]/50 text-[#634032] font-medium' 
                      : 'text-[#bfa791] hover:bg-[#efe9e4]/30 hover:text-[#634032]'
                    }`}
                >
                  Parenting Consultation
                </Link>

                <Link 
                  to="/resources" 
                  className={`px-4 py-2.5 text-[13px] transition-colors duration-150
                    ${location.pathname === '/resources' 
                      ? 'bg-[#efe9e4]/50 text-[#634032] font-medium' 
                      : 'text-[#bfa791] hover:bg-[#efe9e4]/30 hover:text-[#634032]'
                    }`}
                >
                  Resources & Archive
                </Link>

                <Link 
                  to="/contact" 
                  className={`px-4 py-2.5 text-[13px] transition-colors duration-150
                    ${location.pathname === '/contact' 
                      ? 'bg-[#efe9e4]/50 text-[#634032] font-medium' 
                      : 'text-[#bfa791] hover:bg-[#efe9e4]/30 hover:text-[#634032]'
                    }`}
                >
                  Contact
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}