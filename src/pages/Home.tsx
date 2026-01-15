import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import CalendarWidget from '../components/CalendarWidget';
import EventCard, { type Event } from '../components/EventCard';
import FeaturedEvent from '../components/FeaturedEvent';

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "System Design Architecture Workshop",
    date: new Date(2025, 0, 24),
    time: "10:00 AM",
    location: "Tech Hub, Room 404",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    status: "registered",
    description: "Scalable system design",
    attendees: 45
  },
  {
    id: 2,
    title: "React Server Components Deep Dive",
    date: new Date(2025, 0, 24),
    time: "2:00 PM",
    location: "Virtual",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    description: "RSC and new rendering patterns",
    attendees: 32
  },
  {
    id: 3,
    title: "UI/UX Minimalist Principles",
    date: new Date(2025, 0, 25),
    time: "11:00 AM",
    location: "Creative Loft B",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    status: "registered",
    description: "Minimalist design approach",
    attendees: 28
  },
  {
    id: 4,
    title: "Legacy Code Refactoring Strategy",
    date: new Date(2025, 0, 26),
    time: "9:00 AM",
    location: "Main Hall",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
    description: "Refactoring techniques",
    attendees: 67
  },
  {
    id: 5,
    title: "Async Javascript Patterns",
    date: new Date(2025, 0, 28),
    time: "4:30 PM",
    location: "Dev Den",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1997&auto=format&fit=crop",
    description: "Async/await patterns",
    attendees: 19
  },
  {
    id: 6,
    title: "TypeScript Generics Masterclass",
    date: new Date(2025, 0, 24),
    time: "6:00 PM",
    location: "Online",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
    status: "registered",
    description: "Advanced TypeScript",
    attendees: 89
  },
];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return MOCK_EVENTS;
    return MOCK_EVENTS.filter(e => {
      if (typeof e.date !== 'object') return false;
      return e.date.getDate() === selectedDate.getDate() &&
        e.date.getMonth() === selectedDate.getMonth() &&
        e.date.getFullYear() === selectedDate.getFullYear();
    });
  }, [selectedDate]);

  const upcomingEvent = MOCK_EVENTS.find(e => e.status === "registered") || MOCK_EVENTS[0];

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col font-montserrat">
      <div className="p-3 sm:p-6 pb-2">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 h-auto lg:h-95">
            <div className="lg:col-span-4 flex flex-col">
              <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Pick Your Date</h2>
              <div className="flex-1">
                <CalendarWidget selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col">
              <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Your Upcoming Event</h2>
              <div className="flex-1">
                <FeaturedEvent event={upcomingEvent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col mt-4 sm:mt-8">
        <div className="px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto w-full border-b border-zinc-300 pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-2 sm:gap-3">
                All Events
                {selectedDate && (
                  <span className="text-xs sm:text-sm font-normal text-white px-2 py-1 rounded-md whitespace-nowrap" style={{ backgroundColor: '#1BB3A0' }}>
                    Filtered: {selectedDate.toLocaleDateString()}
                  </span>
                )}
              </h2>
              <span className="text-zinc-400 text-xs sm:text-sm font-medium">
                {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6">
          <div className="max-w-7xl mx-auto w-full py-4 sm:py-6 pb-12 sm:pb-20">
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-20 bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 text-zinc-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events found for this date.</p>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-4 text-sm font-semibold text-zinc-900 underline hover:text-zinc-600"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
