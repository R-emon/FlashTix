import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore(); // Reading from our new global state!

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-brand-dark/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* We use <Link> instead of <a> tags so React instantly loads pages without refreshing! */}
        <Link to="/" className="font-display text-2xl font-black tracking-tighter text-white">
          FLASH<span className="text-brand-neon">TIX</span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-400">Hi, {user.firstName}</span>
              <button onClick={logout} className="text-sm font-medium text-brand-neon transition hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-400 transition hover:text-white">Log In</Link>
              <button className="rounded-full bg-brand px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition hover:bg-indigo-500">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
