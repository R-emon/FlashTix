import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function EventDetails() {
  // Grab the event ID from the URL (e.g. localhost:5173/event/1)
  const { id } = useParams(); 
  
  const user = useAuthStore((state) => state.user);
  const [bookingStatus, setBookingStatus] = useState(null); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the specific event data based on the ID
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    }
  });

  const handleBookTicket = async () => {
    if (!user) {
      setErrorMessage("Please log in first to book a ticket!");
      return;
    }

    setBookingStatus('loading');
    setErrorMessage('');
    
    try {
      // Warning: Ensure '/orders' and the JSON shape below matches your Java OrderController exactly!
      await api.post('/orders', { 
         ticketIds: [parseInt(id)] // We assume the user is buying 1 ticket based on your earlier Redis logic
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      // If Redis Lock throws an exception (e.g. "Ticket reserved!"), display it here!
      setErrorMessage(err.response?.data?.message || 'Transaction failed. Ticket might be sold out or locked.');
    }
  };

  if (isLoading) return <div className="text-white mt-40 font-bold text-center">Loading Secure Event Data...</div>;
  if (!event) return <div className="text-white mt-40 font-bold text-center">Event not found.</div>;

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto rounded-3xl bg-brand-card p-10 shadow-[0_0_50px_rgba(3,7,18,0.5)] border border-white/5"
      >
        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tight">{event.title}</h1>
        <p className="mt-4 text-brand-neon font-bold text-lg">📍 {event.venue?.name || "Venue TBA"}</p>
        
        <p className="mt-8 text-gray-400 text-lg leading-relaxed">{event.description}</p>
        
        <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between bg-black/40 p-8 rounded-2xl border border-white/10">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-400 font-bold mb-1 tracking-widest">LIVE INVENTORY</p>
            <p className="text-4xl text-white font-black">{event.availableTickets} <span className="text-xl text-gray-500 font-medium">/ {event.totalTickets} left</span></p>
          </div>
          
          {bookingStatus === 'success' ? (
            <div className="bg-green-500/20 text-green-400 px-8 py-4 rounded-full font-bold border border-green-500/50 flex items-center">
              🎉 Transaction Successful!
            </div>
          ) : (
             <button 
              onClick={handleBookTicket}
              disabled={bookingStatus === 'loading'}
              className="bg-brand text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {bookingStatus === 'loading' ? 'Acquiring Distributed Lock...' : 'Secure 1 Ticket ($199)'}
            </button>
          )}
        </div>
        
        {errorMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-red-500/10 text-red-400 p-5 rounded-xl border border-red-500/30 text-center font-medium">
            ⚠️ {errorMessage}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
