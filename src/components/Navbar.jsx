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

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b 
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-[#bfa791]/15 py-4 shadow-2xs' 
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

        {/* Clean Link Cluster */}
        <div className="flex items-center gap-8 text-xs font-medium uppercase tracking-[0.15em]">
          <Link 
            to="/" 
            className={`transition-colors duration-200 relative py-1
              ${location.pathname === '/' 
                ? 'text-[#634032]' 
                : 'text-[#bfa791] hover:text-[#634032]'
              }`}
          >
            Home
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#634032]"></span>
            )}
          </Link>

          {/* Premium Call to Action Nav Anchor */}
          <Link 
            to="/book" 
            className={`px-5 py-2.5 rounded-xs font-serif italic text-sm tracking-wide transition-all duration-300 border
              ${location.pathname === '/book'
                ? 'bg-[#634032] text-[#efe9e4] border-[#634032]'
                : 'border-[#634032] text-[#634032] bg-transparent hover:bg-[#634032] hover:text-[#efe9e4]'
              }`}
          >
            Book Session
          </Link>
        </div>

      </div>
    </nav>
  );
}