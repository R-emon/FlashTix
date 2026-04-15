import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark">
        <Navbar />
        {/* The Routes component is a placeholder where different pages get injected! */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div className="pt-40 text-center text-white">Login Page Coming Soon!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
