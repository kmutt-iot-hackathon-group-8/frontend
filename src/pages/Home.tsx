import { useState, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import CalendarWidget from '../components/CalendarWidget';
import EventCard, { type Event } from '../components/EventCard';
import FeaturedEvent from '../components/FeaturedEvent';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchEventsAndUserStatus = async () => {
      try {
        // Fetch all events
        const eventsResponse = await fetch(`${BASE_URL}/api/v1/events`);
        let transformedEvents: Event[] = [];
        
        if (eventsResponse.ok) {
          const data = await eventsResponse.json();
          // Transform API response (camelCase) to match Event interface (snake_case)
          transformedEvents = data.map((event: any) => ({
            eventid: event.eventid,
            title: event.title,
            description: event.description,
            eventstartdate: event.startDate,
            eventenddate: event.endDate,
            eventstarttime: event.startTime,
            eventendtime: event.endTime,
            image: event.image,
            location: event.location,
            attendeeCount: event.attendeeCount,
            status: event.status,
            regisstart: event.regisStart,
            regisend: event.regisEnd,
            contact: event.contact
          }));
          setEvents(transformedEvents);
        }

        // Fetch user's registered events to get status
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.uid) {
          try {
            const userEventsResponse = await fetch(`${BASE_URL}/api/v1/users/${user.uid}/registered-events`);
            if (userEventsResponse.ok) {
              const userEvents = await userEventsResponse.json();
              // Create a map of eventid -> status
              const statusMap: Record<number, string> = {};
              userEvents.forEach((event: any) => {
                statusMap[event.eventid] = event.status;
              });
              setUserStatuses(statusMap);
            }
          } catch (error) {
            console.error('Error fetching user events:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndUserStatus();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return events;
    return events.filter(e => {
      const eventDate = new Date(e.eventstartdate);
      return eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear();
    });
  }, [selectedDate, events]);

  const upcomingEvent = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.eventenddate) > now)
      .sort((a, b) => new Date(a.eventstartdate).getTime() - new Date(b.eventstartdate).getTime())[0];
  }, [events]);

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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-500"></div>
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
                {loading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-zinc-400 inline-block mr-1"></div> : `${filteredEvents.length} result${filteredEvents.length !== 1 ? 's' : ''}`}
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400 mx-auto mb-3"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard 
                    key={event.eventid} 
                    event={event} 
                    userStatus={userStatuses[event.eventid]}
                  />
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
