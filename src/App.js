import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CustomSidebar from './components/ui/sidebar.tsx';
import CustomNavbar from './components/ui/navbar.tsx';
import Home from './pages/home-page.tsx';
import BedAllocation from './pages/bed-allocation.tsx';

function App() {
  return (
    <div className="App">
      <CustomSidebar />
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bed-allocation" element={<BedAllocation />} />
      </Routes>
    </div>
  );
}

export default App;
