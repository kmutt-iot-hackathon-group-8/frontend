import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import type { Event } from './EventCard';

interface FeaturedEventProps {
  event: Event | undefined;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  if (!event) {
    return (
      <div className="h-full bg-zinc-50 border border-zinc-200 border-dashed rounded-xl flex items-center justify-center text-zinc-400">
        No upcoming registered events
      </div>
    );
  }

  return (
    <div className="h-full rounded-xl overflow-hidden relative group cursor-pointer text-white flex flex-col" style={{ backgroundColor: '#0D5958' }}>
      <div className="absolute inset-0">
        <img
          src={event.image}
          alt="Featured"
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a3d3c 0%, rgba(13, 89, 88, 0.6) 50%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full justify-end">
        <h2 className="text-2xl font-bold mb-3 leading-tight max-w-md">{event.title}</h2>

        <div className="flex items-center gap-4 text-zinc-300 text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" style={{ color: '#1BB3A0' }} />
            {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" style={{ color: '#1BB3A0' }} />
            {event.time}
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-4" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <MapPin className="w-4 h-4" style={{ color: '#1BB3A0' }} />
            {event.location}
          </div>
          <button className="p-2 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
