import React, { useState } from 'react';

export default function BookingsDatabase({ bookings, isPastDate, handleCancelBooking, setFocusedDate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // --- SORTING ARCHITECTURE STATES ---
  const [sortKey, setSortKey] = useState('id'); // Default tracking anchor
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Helper utility to convert DD/MM/YYYY target records to sortable epoch integers
  const parseDateToComparable = (dateStr) => {
    if (!dateStr) return 0;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return 0;
    return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
  };

  // Header click handler configuration
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  // 1. Filter Execution Pass
  const filtered = bookings.filter(b => {
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      b.client_email.toLowerCase().includes(query) || 
      b.booking_reference.toLowerCase().includes(query) ||
      (b.client_name && b.client_name.toLowerCase().includes(query));
    
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 2. Sort Execution Pass
  const sortedAndFilteredBookings = [...filtered].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    // Special parsing hooks for relative object metrics
    if (sortKey === 'date_booked') {
      valA = parseDateToComparable(a.date_booked);
      valB = parseDateToComparable(b.date_booked);
    }

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (typeof valA === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  return (
    <div className="bg-white border border-[#bfa791]/20 rounded-sm p-6 space-y-6 selection:bg-[#efe9e4]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-serif text-lg font-normal text-[#634032]">All Bookings</h3>
          <p className="text-xs text-[#a38c77]">View and manage bookings.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="text" 
            placeholder="Search Name, Email, Reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#efe9e4]/30 border border-[#bfa791]/30 text-xs px-3 py-2 outline-none focus:border-[#634032] rounded-2xs w-64 placeholder-gray-400"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#bfa791]/30 text-xs px-2 py-2 outline-none focus:border-[#634032] rounded-2xs cursor-pointer text-[#634032]"
          >
            <option value="ALL">All statuses</option>
            <option value="CONFIRMED">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto border border-gray-100 rounded-2xs">
        <table className="w-full text-left text-xs text-[#634032] border-collapse">
          <thead>
            <tr className="bg-[#efe9e4]/40 border-b border-[#bfa791]/20 text-[10px] uppercase font-bold tracking-wider text-[#a38c77]">
              <th onClick={() => requestSort('booking_reference')} className="p-3 cursor-pointer hover:bg-[#efe9e4] transition-colors">
                Reference {sortKey === 'booking_reference' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('client_name')} className="p-3 cursor-pointer hover:bg-[#efe9e4] transition-colors">
                Parent Name {sortKey === 'client_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => requestSort('date_booked')} className="p-3 cursor-pointer hover:bg-[#efe9e4] transition-colors">
                Date {sortKey === 'date_booked' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="p-3">Time</th>
              <th onClick={() => requestSort('status')} className="p-3 cursor-pointer hover:bg-[#efe9e4] transition-colors">
                Status {sortKey === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedAndFilteredBookings.length > 0 ? (
              sortedAndFilteredBookings.map((b) => {
                const isExpanded = expandedRowId === b.id;
                const past = isPastDate(b.date_booked);
                
                return (
                  <React.Fragment key={b.id}>
                    <tr className={`hover:bg-gray-50/60 transition-colors ${isExpanded ? 'bg-[#efe9e4]/10' : ''}`}>
                      <td className="p-3 font-mono font-medium text-gray-900">{b.booking_reference}</td>
                      <td className="p-3 font-medium">{b.client_name || 'Unspecified'}</td>
                      <td className="p-3">{b.date_booked}</td>
                      <td className="p-3 font-mono text-gray-500">{b.time_booked}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                          b.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border border-green-100' :
                          b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button 
                          onClick={() => setExpandedRowId(isExpanded ? null : b.id)}
                          className="text-[#a38c77] hover:text-[#634032] underline tracking-wide cursor-pointer"
                        >
                          {isExpanded ? 'Hide details' : 'View details'}
                        </button>
                        {!past && b.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* EXPANDED PROFILE CARD HOOK CONTAINER */}
                    {isExpanded && (
                      <tr className="bg-[#efe9e4]/10">
                        <td colSpan="6" className="p-4 border-t border-b border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs bg-white p-4 rounded-xs border border-[#bfa791]/15 shadow-2xs">
                            
                            {/* Col 1: Contact */}
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] text-[#a38c77] block uppercase font-bold tracking-wider mb-1">Parent details</span>
                              <p><span className="text-gray-400">Name:</span> <span className="font-medium">{b.client_name || 'N/A'}</span></p>
                              <p><span className="text-gray-400">Email:</span> <span className="font-medium underline">{b.client_email}</span></p>
                              <p><span className="text-gray-400">Phone:</span> <span className="font-medium">{b.client_phone || 'N/A'}</span></p>
                            </div>
                            
                            {/* Col 2: Child Specific Diagnostic Flags */}
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] text-[#a38c77] block uppercase font-bold tracking-wider mb-1">Child Information</span>
                              <p><span className="text-gray-400">Age:</span> <span className="font-medium">{b.child_age ? `${b.child_age} years old` : 'Unspecified'}</span></p>
                              <p><span className="text-gray-400">Gender:</span> <span className="font-medium">{b.child_gender || 'Unspecified'}</span></p>
                              <p><span className="text-gray-400">School Status:</span> <span className="font-medium">{b.school_status || 'Unspecified'}</span></p>
                            </div>
                            
                            {/* Col 3: Diagnostic Briefing */}
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] text-[#a38c77] block uppercase font-bold tracking-wider mb-1">Intake notes</span>
                              <div className="bg-gray-50/50 p-2.5 border border-gray-100 rounded-2xs italic text-gray-600 max-h-32 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                                {b.intake_notes || "No notes provided."}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs italic text-gray-400 bg-gray-50/20">No matching scheduling history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}