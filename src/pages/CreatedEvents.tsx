import { useState, useEffect } from 'react';
import { ArrowLeft, CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard, { type Event } from '../components/EventCard';
import clickToAddNewEvents from '../assets/icons/clicktoaddnewevents.webp';

interface CreatedEventResponse {
  eventid: number;
  eventtitle: string;
  eventstartdate: string;
  eventenddate: string;
  eventstarttime: string;
  eventendtime: string;
  eventimg: string;
  eventowner: string;
  eventdetail: string;
  eventlocation: string;
  contact: string;
  regisstart: string;
  regisend: string;
  attendeeCount?: number;
}

const CreatedEvents = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) {
      navigate('/login');
      return;
    }

    const fetchCreatedEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/event/created/${user.uid}`);
        if (response.ok) {
          const result = await response.json();
          // Handle the { success: true, events } response structure
          const data: CreatedEventResponse[] = result.events || [];
          // Transform the data to match Event interface
          const transformedEvents: Event[] = data.map((item) => ({
            eventid: item.eventid,
            title: item.eventtitle,
            eventstartdate: item.eventstartdate,
            eventenddate: item.eventenddate,
            eventstarttime: item.eventstarttime, 
            eventendtime: item.eventendtime,
            image: item.eventimg,
            location: item.eventlocation,
            attendeeCount: item.attendeeCount || 0,
            userStatus: 'owner' // Creator of the event
          }));
          console.log(user.uid);
          console.log('Fetched created events:', transformedEvents);
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching created events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedEvents();
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
          <h1 className="text-3xl sm:text-4xl mb-2 lg:text-5xl font-bold leading-tight sm:leading-14.75">Created Event List</h1>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 sm:gap-0 mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl font-bold text-[#6B7C85]">
            {loading ? 'Loading...' : `${events.length} events`}
          </p>
          <div className="relative flex flex-col items-center">
            <img 
              src={clickToAddNewEvents}
              alt="Click to Add New Events"
              className={`absolute -top-15 right-0 sm:mr-11 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ width: '200px', maxWidth: '200px' }}
            />
            <button 
              className="flex items-center mr-2 sm:mr-30 gap-3 hover:opacity-80 transition-opacity"
              onClick={() => navigate('/add-event')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CirclePlus size={45} className="text-[#10726F]" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-8 max-w-375">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard 
                key={event.eventid} 
                event={event} 
                showActions={true}
                onClick={() => navigate(`/event/${event.eventid}/attendees`)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No created events found</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreatedEvents;