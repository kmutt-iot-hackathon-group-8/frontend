import { Calendar, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Event {
  id: number;
  title: string;
  date: string | Date;
  time?: string;
  location: string;
  image: string;
  status?: "present" | "registered";
  description?: string;
  attendees?: number;
}

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  const formattedDate = typeof event.date === 'string' ? event.date : event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl sm:rounded-[26px] shadow-lg p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleClick}>
      <div className="w-full h-40 sm:w-72 sm:h-48 bg-linear-to-r from-[#AFEEDD] to-[#6CB2D7] rounded-lg shrink-0 relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover absolute inset-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-4">
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <h3 className="font-bold text-zinc-900 text-lg sm:text-2xl leading-tight flex-1">
            {event.title}
          </h3>
          {event.status && (
            <div className={`w-25 h-7 sm:w-40.5 sm:h-10 ${event.status === 'present' ? 'bg-[#2DBE8B]' : 'bg-[#FFCC00]'} rounded-[9px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0`}>
              <span className={`font-montserrat font-bold text-[10px] sm:text-[14px] leading-4.5 ${event.status === 'present' ? 'text-white' : 'text-black'}`}>
                {event.status === 'present' ? 'Present' : 'Registered'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
          <Calendar className="w-4 h-4" style={{ color: '#1BB3A0' }} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
          <MapPin className="w-4 h-4" style={{ color: '#1BB3A0' }} />
          <span className="truncate max-w-62.5">{event.location}</span>
        </div>
        {event.attendees && (
          <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
            <User className="w-4 h-4" style={{ color: '#1BB3A9' }} />
            <span>{event.attendees} attendees</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
