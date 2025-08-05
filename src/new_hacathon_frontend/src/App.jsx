import { useState } from 'react';
import { new_hacathon_backend } from 'declarations/new_hacathon_backend';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentPage from './pages/StudentPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/student" element={<StudentPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
