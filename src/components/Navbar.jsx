import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

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

  // UPDATED: Replaced '/book' with '/consultation' to accurately track the new dropdown route
  const isDropdownActive = ['/about', '/consultation', '/contact'].includes(location.pathname);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b 
      ${isScrolled 
        ? 'bg-white/90 backdrop-blur-md border-[#bfa791]/15 py-4 shadow-2xs' 
        : 'bg-white/0 border-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand/Logo Area */}
        <Link 
          to="/" 
          className="font-serif text-xl tracking-[0.18em] text-[#634032] uppercase font-normal transition-opacity duration-200 hover:opacity-80"
        >
          Zainab A. Ahmed
        </Link>

        {/* Clean Editorial Navigation Cluster */}
        <div className="flex items-center gap-8 text-[14px] tracking-wide font-sans">
          
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

          {/* "More" Hover Dropdown Container */}
          <div className="relative group py-1">
            <span 
              className={`transition-colors duration-200 flex items-center gap-1 cursor-pointer select-none
                ${isDropdownActive 
                  ? 'text-[#634032] font-normal' 
                  : 'text-[#bfa791] hover:text-[#634032]'
                }`}
            >
              More
              <svg 
                className="w-3 h-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </span>

            {/* Dropdown Menu Panel */}
            <div className="absolute right-0 top-full pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
              <div className="bg-white border border-[#bfa791]/20 shadow-xs py-1.5 flex flex-col text-left rounded-xs">
                
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

                {/* UPDATED: Path destination and active check switched over to /consultation */}
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