import { Calendar, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export interface Event {
  eventId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  image: string;
  location: string;
  attendeeCount: number;
  status?: string;
  regisStart?: string;
  regisEnd?: string;
  contact?: string;
  regisURL?: string;
}

interface EventCardProps {
  event: Event;
  showActions?: boolean;
}

function EventCard({ event, showActions = false }: EventCardProps) {
  const navigate = useNavigate();
  const formattedDate = event.startDate 
    ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBD';
  const eventId = event.eventId;
  return (
    <div className="bg-white rounded-2xl sm:rounded-[26px] shadow-lg p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 relative cursor-pointer" onClick={() => navigate(`/event/${eventId}`)}>
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
            <div className={`w-25 h-7 sm:w-45.5 sm:h-12 ${
              event.status === 'present' 
                ? 'bg-[#2DBE8B]' 
                : event.status === 'absent'
                ? 'bg-[#FF383C]'
                : 'bg-[#FFCC00]'
            } rounded-[9px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0`}>
              <span className={`font-montserrat font-bold text-[10px] sm:text-[18px] leading-4.5 ${
                event.status === 'registered' ? 'text-black' : 'text-white'
              }`}>
                {event.status === 'present' ? 'Present' : event.status === 'absent' ? 'Absent' : 'Registered'}
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
        <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
          <User className="w-4 h-4" style={{ color: '#1BB3A9' }} />
          <span>{event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}</span>
        </div>
      </div>
      
      {showActions && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/event/edit/${eventId}`); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit className="w-7 h-7 text-gray-600 hover:text-blue-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Trash2 className="w-7 h-7 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
