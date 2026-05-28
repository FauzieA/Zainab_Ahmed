import React from 'react';

export default function AdminAnalytics({ bookings, slots }) {
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0); 
  const uniqueClients = [...new Set(bookings.map(b => b.client_email))].length;
  const currentMonthBookings = confirmedBookings.filter(b => b.date_booked.includes('/05/2026')).length;

  const hourCounts = {};
  confirmedBookings.forEach(b => { hourCounts[b.time_booked] = (hourCounts[b.time_booked] || 0) + 1; });
  const topHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, "None");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white border border-[#bfa791]/20 p-4 rounded-sm">
        <span className="text-[10px] text-[#a38c77] uppercase font-semibold tracking-wider block mb-0.5">Total Revenue</span>
        <span className="text-lg font-serif font-bold text-[#634032]">NGN {totalRevenue.toLocaleString()}</span>
      </div>
      <div className="bg-white border border-[#bfa791]/20 p-4 rounded-sm">
        <span className="text-[10px] text-[#a38c77] uppercase font-semibold tracking-wider block mb-0.5">Total Clients</span>
        <span className="text-lg font-serif font-bold text-[#634032]">{uniqueClients} Unique Profiles</span>
      </div>
      <div className="bg-white border border-[#bfa791]/20 p-4 rounded-sm">
        <span className="text-[10px] text-[#a38c77] uppercase font-semibold tracking-wider block mb-0.5">Bookings This Month</span>
        <span className="text-lg font-serif font-bold text-[#634032]">{currentMonthBookings} Appointments</span>
      </div>
      <div className="bg-white border border-[#bfa791]/20 p-4 rounded-sm">
        <span className="text-[10px] text-[#a38c77] uppercase font-semibold tracking-wider block mb-0.5">Most Popular Hour</span>
        <span className="text-lg font-mono font-bold text-emerald-700 text-sm block mt-0.5">{topHour}</span>
      </div>
    </div>
  );
}