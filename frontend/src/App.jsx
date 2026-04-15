import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Login from './views/Login'
import EventDetails from './views/EventDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark">
        <Navbar />
        {/* The Routes component is a placeholder where different pages get injected! */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
