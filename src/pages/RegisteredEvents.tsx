import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard, { type Event } from '../components/EventCard';

const RegisteredEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) {
      navigate('/login');
      return;
    }

    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${user.uid}/registered-events`);
        if (response.ok) {
          const data: { eventid: number; title: string; startDate: string; endDate: string; startTime: string; endTime: string; image: string; location: string; attendeeCount: number; status: string; scannedat?: string }[] = await response.json();
          // Transform the data to match Event interface
          const transformedEvents: Event[] = data.map((item) => ({
            eventid: item.eventid,
            title: item.title,
            eventstartdate: item.startDate,
            eventenddate: item.endDate,
            eventstarttime: item.startTime,
            eventendtime: item.endTime,
            image: item.image,
            location: item.location,
            attendeeCount: item.attendeeCount || 0,
            status: 'upcoming', // Default status for the event itself
            userStatus: item.status // User's registration status for this event
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching registered events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
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
          <h1 className="text-3xl sm:text-4xl mb-2 lg:text-5xl font-bold leading-tight sm:leading-14.75">Registered Event List</h1>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 sm:gap-0 mb-6 sm:mb-8">
          <div className="text-xl sm:text-2xl font-bold text-[#6B7C85]">
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B7C85] inline-block mr-2"></div> : `${events.length} events`}
          </div>
        
        </div>

        <div className="space-y-4 sm:space-y-8 max-w-375">
          {loading ? (
            <div className="text-center py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.eventid} event={event} userStatus={event.userStatus} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No registered events found</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RegisteredEvents;