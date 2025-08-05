import { useState } from 'react';
import { new_hacathon_backend } from 'declarations/new_hacathon_backend';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UniversityPage from './pages/UniversityPage';
import StudentPage from './pages/StudentPage';
import LandingPage from './pages/landingPage';
import AIDemoPage from './pages/AIDemoPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
           <Route path="/" element={<LandingPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/university" element={<UniversityPage />} />
            <Route path="/ai-demo" element={<AIDemoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
