import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from './components/Navbar';

function App() {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/events');
      return response.data;
    }
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading events...</div>;
  if (isError) return <div className="flex min-h-screen items-center justify-center text-red-500">Error fetching data. Is Spring Boot running?</div>;

  // Let's artificially duplicate your 1 event into an array of 6 so we can test the Navbar glass scrolling!
  const displayEvents = events.length > 0 ? [...events, ...events, ...events, ...events, ...events, ...events] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* 🌟 New Hero Section 🌟 */}
      <div className="bg-foreground px-6 py-24 text-background">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            Exclusive access.<br />
            <span className="text-gray-400">Unforgettable moments.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300">
            FlashTix secures your spot at the world's most demanded events using our ultra-fast, double-booking-proof engine.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Trending Now
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event, index) => (
            
            <div key={`${event.id}-${index}`} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              
              <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1540039155732-d68f1165a251?auto=format&fit=crop&q=80&w=800" 
                  alt="Concert Crowd" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{event.venue.name} • {event.venue.address}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {event.availableTickets} left
                  </span>
                  <button className="rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
                    Get Tickets
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
