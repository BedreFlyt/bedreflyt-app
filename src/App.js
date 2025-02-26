import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CustomSidebar from './components/ui/sidebar.tsx';
import CustomNavbar from './components/ui/navbar.tsx';
import Home from './pages/home-page.tsx';
import BedAllocation from './pages/bed-allocation.tsx';
import DataInspector from './pages/inspect-data.tsx';
import ApiDocumentation from './pages/api-documentation.tsx';

function App() {
  return (
    <div className="App">
      <CustomSidebar />
      <CustomNavbar />
      <div style={{ marginLeft: '65px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bed-allocation" element={<BedAllocation />} />
          <Route path="/inspect" element={<DataInspector />} />
          <Route path="/api" element={<ApiDocumentation />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
