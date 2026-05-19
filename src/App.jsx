import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/client/Home';
import Book from './pages/client/Booking'; 

// New Administrative Dashboard View Layouts
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';

// A small nested structural helper component to hide public headers inside admin layouts
function MasterLayoutSwitcher() {
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
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    // Your basename preserves your specific project subfolder navigation path keys flawlessly
    <BrowserRouter basename="/Zainab_Ahmed/">
      <MasterLayoutSwitcher />
    </BrowserRouter>
  );
}

export default App;