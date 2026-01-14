import { Clock, MapPin, User } from 'lucide-react';

export interface CreatedEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
}

interface CreatedEventCardProps {
  event: CreatedEvent;
}

const CreatedEventCard = ({ event }: CreatedEventCardProps) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[26px] shadow-lg p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8 hover:shadow-xl transition-shadow">
      <div className="w-full h-30 sm:w-67.5 sm:h-38 bg-linear-to-r from-[#AFEEDD] to-[#6CB2D7] rounded-lg shrink-0" />
      
      <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-4">
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{event.title}</h3>
        
        <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
          <Clock size={20} className="text-[#1BB3A9] sm:w-6 sm:h-6" />
          <span>{event.date}</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl font-bold">
          <MapPin size={22} className="text-[#1BB3A9] sm:w-6.75 sm:h-6.75" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
        <User size={28} className="text-[#1BB3A9] sm:w-8.25 sm:h-8.25" />
        <span className="text-base sm:text-lg lg:text-xl font-bold">{event.attendees} attendees</span>
      </div>
    </div>
  );
};

export default CreatedEventCard;
