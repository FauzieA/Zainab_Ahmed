import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { CONFIG } from './config'; // Make sure this path points correctly to your config file

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/client/Home';
import Book from './pages/client/Booking'; 
import About from './pages/client/About'; 
import Contact from './pages/client/Contact';
import Consultation from './pages/client/Consultation.jsx';
import Resources from './pages/client/Resources'; 

// New Administrative Dashboard View Layouts
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';

// A small nested structural helper component to hide public headers inside admin layouts
function MasterLayoutSwitcher({ systemConfig }) {
  const location = useLocation();
  
  // Checks if the active URL window segment path begins with the /admin key
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#efe9e4]/10">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    );
  }

  // Fallback structural rendering layout for your public booking ecosystem views
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dynamic Global Header Integration */}
      <Navbar />
      
      {/* Added top padding helper to cleanly push content below the fixed header layout */}
      <div className="flex-1 pt-16">
        <Routes>
          {/* We pass systemConfig data as liveContent to keep the public ecosystem entirely dynamic */}
          <Route path="/" element={<Home liveContent={systemConfig} />} />
          <Route path="/book" element={<Book liveContent={systemConfig} />} />
          <Route path="/consultation" element={<Consultation liveContent={systemConfig} />} />
          
          {/* 👑 CRITICAL MATCH LINK: Feeds the custom book rows straight into the parser */}
          <Route path="/resources" element={<Resources liveContent={systemConfig} />} />
          
          <Route path="/about" element={<About liveContent={systemConfig} />} />
          <Route path="/contact" element={<Contact liveContent={systemConfig} />} />
         </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  const [systemConfig, setSystemConfig] = useState(null);

  // Synchronize database records on page load
  useEffect(() => {
    const baseUrl = CONFIG.API_BASE_URL.replace(/\/$/, "");
    fetch(`${baseUrl}/meta/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to sync layout context parameters.");
        return res.json();
      })
      .then((data) => {
        setSystemConfig(data);
      })
      .catch((err) => console.error("Database settings sync unfulfilled:", err));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop behavior="auto" />
      <MasterLayoutSwitcher systemConfig={systemConfig} />
    </BrowserRouter>
  );
}

export default App;