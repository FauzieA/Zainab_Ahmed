import React from 'react';

export default function Resources({ liveContent }) {
  // Gracefully parse the dynamic database field, or fallback to a standard elegant initial array
  const books = liveContent?.site_content?.libraryBooks || liveContent?.libraryBooks || [
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
      <header className="max-w-4xl mx-auto pt-20 pb-12 px-6 text-center space-y-3">
        <h1 style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-3xl md:text-4xl font-normal uppercase tracking-widest text-[#634032]">
          RESOURCES & ARCHIVE
        </h1>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#a38c77]">
          Literature, Toolkits & Curated Guides for Intentional Parents
        </p>
        <div className="w-16 h-[1px] bg-[#bfa791]/40 mx-auto mt-6" />
      </header>

      {/* Main Content Layout Block */}
      <main className="max-w-4xl mx-auto px-6 pb-24">
        {books.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#bfa791]/20">
            <p className="text-xs italic font-serif text-[#a38c77]">The digital library is currently being curated. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="flex flex-col sm:flex-row gap-6 items-center sm:items-start group border-b border-[#bfa791]/10 pb-8 last:border-b-0 sm:last:border-b sm:pb-8"
              >
                
                {/* Premium Book Cover Showcase Frame */}
                <div className="w-36 h-52 bg-white border border-[#bfa791]/40 p-2 shadow-xs transition-transform duration-500 group-hover:-translate-y-1 rounded-none flex-shrink-0">
                  <div className="w-full h-full bg-gray-50 overflow-hidden relative">
                    <img 
                      src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"} 
                      alt={book.title} 
                      className="w-full h-full object-cover filter grayscale-20 contrast-105 group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Editorial Typography Details Block */}
                <div className="flex flex-col justify-between h-52 text-center sm:text-left space-y-3 pt-1">
                  <div className="space-y-2">
                    <h2 style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-lg text-[#634032] uppercase tracking-wide font-normal leading-tight">
                      {book.title}
                    </h2>
                    <p className="text-xs text-[#a38c77] font-serif italic leading-relaxed">
                      {book.subtitle}
                    </p>
                  </div>

                  {/* Clean Monospace Action Trigger */}
                  <div className="pt-2">
                    <a 
                      href={book.downloadUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[#634032] border-b border-[#634032] pb-1 hover:text-[#a38c77] hover:border-[#a38c77] transition-all duration-300"
                    >
                      Download Guide 📥
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* Subtle Footer Note */}
      <footer className="max-w-4xl mx-auto pb-12 text-center">
        <p style={{ fontFamily: "'Times New Roman', times, serif" }} className="text-xs italic text-[#a38c77]/70">
          All materials are authored and curated by Zainab Ahmed.
        </p>
      </footer>

    </div>
  );
}