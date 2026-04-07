import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion'; // React's equivalent to Anime.js!

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-brand-dark/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-display text-2xl font-black tracking-tighter text-white">
          FLASH<span className="text-brand-neon">TIX</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-gray-400 transition hover:text-white">Log In</button>
          <button className="rounded-full bg-brand px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition hover:bg-indigo-500">
            Sign Up
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function App() {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/events');
      return response.data;
    }
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-brand-neon">Loading...</div>;
  if (isError) return <div className="flex min-h-screen items-center justify-center text-red-500">Error fetching data. Is Spring Boot running?</div>;

  const displayEvents = events?.length > 0 ? [...events, ...events, ...events, ...events, ...events, ...events] : [];

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <div className="relative overflow-hidden px-6 pb-20 pt-40">
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-black uppercase tracking-tight md:text-8xl"
          >
            The Best Seats.<br />
            <span className="bg-gradient-to-r from-brand to-brand-neon bg-clip-text text-transparent">
              Zero Hassle.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
          >
            Experience the future of ticketing. Instant booking, zero double-sells, pure adrenaline.
          </motion.p>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-10 font-display text-3xl font-bold uppercase tracking-wide text-white">
          Trending Events
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event, index) => (
            
            // 🌟 Framer Motion Animated Card 🌟
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={`${event.id}-${index}`} 
              className="group flex flex-col overflow-hidden rounded-2xl bg-brand-card transition-all hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]"
            >
              {/* Working Image Placeholder */}
              <div className="h-52 w-full overflow-hidden border-b border-white/5 bg-gray-900">
                <img 
                  src={`https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`} 
                  alt="Concert" 
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                />
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-neon backdrop-blur-md">
                  {event.availableTickets} Tickets Left
                </div>
                
                <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                <p className="mt-2 text-sm font-medium text-gray-400">📍 {event.venue.name}</p>
                
                <div className="mt-6 flex items-center justify-between pt-4">
                  <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand-dark transition hover:scale-105 hover:bg-gray-200 active:scale-95">
                    Grab Ticket
                  </button>
                </div>
              </div>
            </motion.div>

          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
