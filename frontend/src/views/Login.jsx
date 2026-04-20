// frontend/src/views/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      
      const response = await api.post('/auth/login', { email, password });
      
      
      const { token, email: userEmail, firstName, lastName, role } = response.data;

      const userObj = { email: userEmail, firstName, lastName, role };
      
      // Saveto Zustand global state!
      setLogin(userObj, token);
      
      // Redirect back to the Home page
      navigate('/'); 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-brand-card p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)]"
      >
        <h2 className="mb-6 text-center font-display text-3xl font-bold tracking-wide text-white">
          Welcome Back
        </h2>
        
        {error && <div className="mb-4 rounded bg-brand-neon/20 p-3 text-sm text-brand-neon">{error}</div>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition focus:border-brand-neon focus:ring-1 focus:ring-brand-neon" 
              placeholder="you@example.com" 
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition focus:border-brand-neon focus:ring-1 focus:ring-brand-neon" 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" 
            className="mt-4 w-full rounded-full bg-brand py-3 font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition hover:scale-[1.02] hover:bg-indigo-500"
          >
            Log In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
