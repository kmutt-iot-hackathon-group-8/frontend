import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard, { type Event } from '../components/EventCard';

interface AttendedEventResponse {
  eventid: number;
  title: string;
  eventstartdate: string;
  eventenddate: string;
  eventstarttime: string;
  eventendtime: string;
  image: string;
  status: string;
  attendeeCount?: number;
}

const AttendedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) {
      navigate('/login');
      return;
    }

    const fetchAttendedEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${user.uid}/attended-events`);
        if (response.ok) {
          const data: AttendedEventResponse[] = await response.json();
          // Transform the data to match Event interface
          const transformedEvents: Event[] = data.map((item) => ({
            eventid: item.eventid,
            title: item.title,
            eventstartdate: item.eventstartdate,
            eventenddate: item.eventenddate,
            eventstarttime: item.eventstarttime,
            eventendtime: item.eventendtime,
            image: item.image,
            location: '', // Not in this endpoint
            attendeeCount: item.attendeeCount || 0,
            status: 'upcoming', // Default
            userStatus: item.status
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching attended events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendedEvents();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-6 sm:py-12">
      <div className="max-w-400 mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-16">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={43} className="text-black" />
          </button>
          <h1 className="text-3xl sm:text-4xl mb-2 lg:text-5xl font-bold leading-tight sm:leading-14.75">Attended Event List</h1>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 sm:gap-0 mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl font-bold text-[#6B7C85]">
            {loading ? 'Loading...' : `${events.length} events`}
          </p>
        
        </div>

        <div className="space-y-4 sm:space-y-8 max-w-375">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.eventid} event={event} userStatus={event.userStatus} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No attended events found</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AttendedEvents;