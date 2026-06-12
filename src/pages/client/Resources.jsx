import React from 'react';

export default function Resources({ liveContent }) {
  // --- ROBUST DB PARSER LAYER ---
  // Checks all possible nested locations where the database object could arrive
  const books = 
    liveContent?.site_content?.libraryBooks || 
    liveContent?.site_content?.site_content?.libraryBooks || 
    liveContent?.libraryBooks || 
    [];

  // Fallback placeholder logic: Only displays if the database specifically has ZERO custom books
  const displayBooks = books.length > 0 ? books : [
    {
      id: 'default-book-1',
      title: "THE PEACEFUL BLUEPRINT",
      subtitle: "Navigating early childhood tantrums with structural clarity without losing your peace.",
      downloadUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#efe9e4]/10 selection:bg-[#efe9e4] text-[#634032]">
      
      {/* Editorial Page Header */}
      <header className="max-w-5xl mx-auto pt-24 pb-16 px-6 text-center space-y-4">
        <h1 style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-4xl md:text-5xl font-normal uppercase tracking-widest text-[#634032]">
          RESOURCES & ARCHIVE
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#a38c77]">
          Literature, Toolkits & Curated Guides for Intentional Parents
        </p>
        <div className="w-20 h-[1px] bg-[#bfa791]/40 mx-auto mt-6" />
      </header>

      {/* Main Content Layout Block */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
          {displayBooks.map((book) => (
            <div 
              key={book.id} 
              className="flex flex-col sm:flex-row gap-8 items-center sm:items-start group border-b border-[#bfa791]/10 pb-10 last:border-b-0 sm:last:border-b sm:pb-10"
            >
              
              {/* Premium Book Cover Showcase Frame (Enlarged Frame) */}
              <div className="w-44 h-64 bg-white border border-[#bfa791]/40 p-2 shadow-xs transition-transform duration-500 group-hover:-translate-y-1 rounded-none flex-shrink-0">
                <div className="w-full h-full bg-gray-50 overflow-hidden relative">
                  <img 
                    src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"} 
                    alt={book.title} 
                    className="w-full h-full object-cover filter grayscale-20 contrast-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>

              {/* Editorial Typography Details Block */}
              <div className="flex flex-col justify-between h-64 text-center sm:text-left space-y-4 pt-2">
                <div className="space-y-3">
                  {/* Significantly Bigger Book Title */}
                  <h2 style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-xl md:text-2xl text-[#634032] uppercase tracking-wide font-normal leading-tight">
                    {book.title}
                  </h2>
                  {/* Highly Readable Subtitle/Description */}
                  <p className="text-sm text-[#a38c77] font-serif italic leading-relaxed">
                    {book.subtitle}
                  </p>
                </div>

                {/* Clean Monospace Action Trigger */}
                <div className="pt-0">
                  <a 
                    href={book.downloadUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-[#634032] border-b border-[#634032] pb-1 hover:text-[#a38c77] hover:border-[#a38c77] transition-all duration-300 font-semibold"
                  >
                    Download Guide 
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="max-w-5xl mx-auto pb-16 text-center">
        <p style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-sm italic text-[#a38c77]/70">
          All materials are authored and curated by Zainab Ahmed.
        </p>
      </footer>

    </div>
  );
}