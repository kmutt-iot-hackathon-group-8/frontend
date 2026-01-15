import { useState } from 'react';
import { ArrowLeft, CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard, { type Event } from '../components/EventCard';
import clickToAddNewEvents from '../assets/icons/clicktoaddnewevents.webp';
const MOCK_CREATED_EVENTS: Event[] = [
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
    title: "Hack my butt",
    date: "5 FEB 2026",
    location: "Male dormitory",
    attendees: 3,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"  
  },
  {
    id: 3,
    title: "Hack my butt",
    date: "5 FEB 2026",
    location: "Male dormitory",
    attendees: 3,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"  
  },
  {
    id: 4,
    title: "Hack my butt",
    date: "5 FEB 2026",
    location: "Male dormitory",
    attendees: 3,
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop"  
  },
  {
    id: 5,
    title: "Hack my butt",
    date: "5 FEB 2026",
    location: "Male dormitory",
    attendees: 3,
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1997&auto=format&fit=crop"  
  }
];

const CreatedEvents = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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
            {MOCK_CREATED_EVENTS.length} events
          </p>
          <div className="relative flex flex-col items-center">
            <img 
              src={clickToAddNewEvents}
              alt="Click to Add New Events"
              className={`absolute -top-15 mr-2 sm:mr-30 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ width: '250px', minWidth: '250px' }}
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
          {MOCK_CREATED_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default CreatedEvents;