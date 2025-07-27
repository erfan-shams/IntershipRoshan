import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import SpeechToText from './SpeechToText';
import Archive from './archive/Archive';
import './App.css'; // For basic styling
import UserDropdown from './UserDropdown';

function App() {
  return (
    <Router>
      <div className="app-container">
      <UserDropdown />
        <Sidebar />
        <div className="content-area">
          <Routes>
            {/* Default route for Speech to Text */}
            <Route path="/" Active element={<SpeechToText />} />
            <Route path="/speech-to-text" element={<SpeechToText />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;