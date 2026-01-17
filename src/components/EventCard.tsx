import { Calendar, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export interface Event {
  eventid: number;
  title: string;
  description?: string;
  eventstartdate: string;
  eventenddate: string;
  eventstarttime: string;
  eventendtime: string;
  image: string;
  location: string;
  attendeeCount: number;
  status?: string;
  regisstart?: string;
  regisend?: string;
  contact?: string;
  regisURL?: string;
  userStatus?: string;
}

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  userStatus?: string;
  onClick?: () => void;
}

function EventCard({ event, showActions = false, userStatus, onClick }: EventCardProps) {
  const navigate = useNavigate();
  const formattedDate = event.eventstartdate 
    ? new Date(event.eventstartdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBD';
  const isRegistrationEnded = event.regisend ? (() => {
    const regisEnd = new Date(event.regisend);
    regisEnd.setHours(23, 59, 59, 999);
    return new Date() > regisEnd;
  })() : false;
  
  const handleClick = onClick || (() => navigate(`/event/${event.eventid}`));
  
  return (
    <div className="bg-white rounded-2xl sm:rounded-[26px] shadow-lg p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 relative cursor-pointer" onClick={handleClick}>
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
          <div className="flex gap-2">
            {event.status && (
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                event.status === 'ended' 
                  ? 'bg-gray-600 text-white' 
                  : event.status === 'ongoing'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {event.status === 'ended' ? 'Ended' : event.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
              </div>
            )}
            {userStatus && (
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                userStatus === 'present' 
                  ? 'bg-[#2DBE8B] text-white' 
                  : userStatus === 'absent'
                  ? 'bg-[#FF383C] text-white'
                  : userStatus === 'owner'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#FFCC00] text-black'
              }`}>
                {userStatus === 'present' ? 'Present' : userStatus === 'absent' ? 'Absent' : userStatus === 'owner' ? 'Owner' : 'Registered'}
              </div>
            )}
            {isRegistrationEnded && (
              <div className="px-2 py-1 rounded text-xs font-bold bg-red-600 text-white">
                Registration Ended
              </div>
            )}
          </div>
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
          <button onClick={(e) => { e.stopPropagation(); navigate(`/event/edit/${event.eventid}`); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
