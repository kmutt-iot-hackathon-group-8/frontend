import { Calendar, MapPin } from 'lucide-react';

export interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  image: string;
  registered: boolean;
  description: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => (
  <div className="group bg-white border border-zinc-200 rounded-xl p-3 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 transition-all hover:shadow-md cursor-pointer relative overflow-hidden items-start">
    <div className="w-full h-32 sm:w-64 sm:h-44 shrink-0 rounded-lg overflow-hidden bg-linear-to-r from-[#AFEEDD] to-[#6CB2D7]">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>

    <div className="flex flex-col justify-start py-0 flex-1 w-full sm:w-auto">
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <h4 className="font-bold text-zinc-900 text-lg sm:text-2xl leading-tight flex-1">
          {event.title}
        </h4>
        {event.registered && (
          <div className="w-25 h-7 sm:w-40.5 sm:h-10 bg-[#FFCC00] rounded-[9px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0">
            <span className="font-montserrat font-bold text-[10px] sm:text-[14px] leading-4.5 text-black">
              Registered
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: '#1BB3A0' }} />
          <span>{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: '#1BB3A0' }} />
          <span className="truncate max-w-62.5">{event.location}</span>
        </div>
      </div>
    </div>
  </div>
);

export default EventCard;
