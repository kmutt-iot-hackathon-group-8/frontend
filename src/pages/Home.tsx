import { useState, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import CalendarWidget from '../components/CalendarWidget';
import EventCard, { type Event } from '../components/EventCard';
import FeaturedEvent from '../components/FeaturedEvent';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return events;
    return events.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear();
    });
  }, [selectedDate, events]);

  const upcomingEvent = events.find(e => true) || events[0]; // For now, just take the first event

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
                {loading ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                    <div className="text-zinc-500">Loading...</div>
                  </div>
                ) : upcomingEvent ? (
                  <FeaturedEvent event={upcomingEvent} />
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                    <div className="text-zinc-500">No upcoming events</div>
                  </div>
                )}
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
                {loading ? 'Loading...' : `${filteredEvents.length} result${filteredEvents.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6">
          <div className="max-w-7xl mx-auto w-full py-4 sm:py-6 pb-12 sm:pb-20">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-center py-20 bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 text-zinc-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Loading events...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard key={event.eventid} event={event} />
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
