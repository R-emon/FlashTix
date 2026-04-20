import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function EventDetails() {
  const { id } = useParams(); 
  const user = useAuthStore((state) => state.user);
  
  // New State to track exactly which seat they clicked!
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  const [bookingStatus, setBookingStatus] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Event Info
  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    }
  });

  // 2. Fetch Live Ticket Inventory (Using our brand new Backend Endpoint!)
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ['tickets', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}/tickets`);
      return response.data;
    }
  });

  const handleBookTicket = async () => {
    if (!user) {
      setErrorMessage("Please log in first to book a ticket!");
      return;
    }
    if (!selectedTicketId) {
      setErrorMessage("Please select a seat from the matrix below!");
      return;
    }

    setBookingStatus('loading');
    setErrorMessage('');
    
    try {
      // BUG FIXED: We are now sending the exact True Ticket ID!
      await api.post('/orders', { 
         ticketIds: [selectedTicketId] 
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMessage(err.response?.data?.message || 'Transaction failed. Ticket might be sold out or locked.');
    }
  };

  if (loadingEvent) return <div className="text-white mt-40 font-bold text-center text-xl">Loading Secure Event Data...</div>;
  if (!event) return <div className="text-white mt-40 font-bold text-center text-xl">Event not found.</div>;

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="max-w-5xl mx-auto rounded-3xl bg-brand-card p-8 md:p-12 shadow-[0_0_50px_rgba(3,7,18,0.5)] border border-white/5"
      >
        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tight">{event.title}</h1>
        <p className="mt-4 text-brand-neon font-bold text-lg">📍 {event.venue?.name || "Venue TBA"}</p>
        <p className="mt-8 text-gray-400 text-lg leading-relaxed max-w-2xl">{event.description}</p>
        
        {/* =============== SEAT MATRIX UI =============== */}
        <div className="mt-12 mb-8">
          <h3 className="mb-6 text-2xl font-display font-bold text-white tracking-wide uppercase">Select Your Seat</h3>
          
          {loadingTickets ? (
            <div className="text-brand-neon animate-pulse font-bold">Decoding Seat Map...</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
              {tickets?.map(ticket => {
                const isAvailable = ticket.status === 'AVAILABLE';
                const isSelected = selectedTicketId === ticket.id;
                
                return (
                  <button
                    key={ticket.id}
                    disabled={!isAvailable}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`
                      relative flex h-12 w-full flex-col items-center justify-center rounded-lg border text-xs font-bold transition-all
                      ${!isAvailable ? 'bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed opacity-50 relative overflow-hidden' : ''}
                      ${isAvailable && !isSelected ? 'bg-brand-dark border-white/10 text-gray-400 hover:border-brand-neon hover:text-white hover:-translate-y-1' : ''}
                      ${isSelected ? 'bg-brand-neon border-brand-neon text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-110 z-10' : ''}
                    `}
                    title={ticket.seatIdentifier}
                  >
                    {!isAvailable && <div className="absolute inset-x-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 bg-red-500/30"></div>}
                    {isSelected ? '✓' : ticket.id}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        {/* =============== CHECKOUT UI =============== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-black/40 p-8 rounded-2xl border border-white/10">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-400 font-bold mb-1 tracking-widest">LIVE INVENTORY</p>
            <p className="text-4xl text-white font-black">{event.availableTickets} <span className="text-xl text-gray-500 font-medium">/ {event.totalTickets} left</span></p>
          </div>
          
          {bookingStatus === 'success' ? (
            <div className="bg-green-500/20 text-green-400 px-8 py-4 rounded-full font-bold border border-green-500/50 flex items-center">
              🎉 Transaction Successful (Seat #{selectedTicketId})!
            </div>
          ) : (
             <button 
              onClick={handleBookTicket}
              disabled={bookingStatus === 'loading' || !selectedTicketId}
              className="bg-brand text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {bookingStatus === 'loading' 
                ? 'Acquiring Distributed Lock...' 
                : !selectedTicketId 
                  ? 'Pick a Seat First' 
                  : `Secure Seat #${selectedTicketId} ($199)`}
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
