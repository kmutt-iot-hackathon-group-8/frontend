import { Calendar, Clock, MapPin, ArrowRight, User, Info, Timer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../components/EventCard';
// Extended Event Interface for detail view
interface DetailedEvent extends Event {
  fullDescription: string;
  eventStart: Date;
  eventEnd: Date;
  registrationStart: Date;
  registrationEnd: Date;
  contact: {
    name: string;
    contactInformation: string;
    role: string;
  };
}

// Mock Data - In production, this would come from API/props
const MOCK_DETAIL_EVENT: DetailedEvent = {
  id: 1,
  title: "System Design Architecture Workshop",
  date: new Date(2025, 0, 24),
  time: "10:00 AM",
  location: "Tech Hub, Room 404",
  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  status: "registered",
  description: "Scalable system design",
  fullDescription: "Join us for an intensive workshop on building scalable, reliable, and maintainable systems. We will cover distributed patterns, database partitioning, and microservices trade-offs. This session is designed for intermediate to senior engineers looking to level up their architectural decision-making skills.",
  eventStart: new Date(2025, 0, 24, 10, 0),
  eventEnd: new Date(2025, 0, 24, 16, 0),
  registrationStart: new Date(2024, 11, 1, 9, 0),
  registrationEnd: new Date(2025, 0, 20, 17, 0),
  contact: {
    name: "Sarah Jenkins",
    role: "Workshop Coordinator",
    contactInformation: "For any questions about the workshop, please reach out to Sarah Jenkins at events@techhub.com or call +1 (555) 123-4567. Additional information can be found on our website."
  }
};

const EventDetail = () => {
  const navigate = useNavigate();
  const event = MOCK_DETAIL_EVENT;

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-montserrat pb-20 relative">
      
      {/* Back Button */}
      <div className="absolute -top-10  left-4 sm:left-20 md:left-10 lg:left-20 z-30">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={43} className="text-black" />
        </button>
      </div>

      <div className="max-w-7xl mt-9 mx-auto w-full p-3 sm:p-6">
        
        {/* Featured Header */}
        <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden relative group text-white flex flex-col shadow-lg mb-6 sm:mb-8" style={{ backgroundColor: '#0D5958' }}>
          <div className="absolute inset-0">
            <img
              src={event.image}
              alt="Featured"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a3d3c 0%, rgba(13, 89, 88, 0.6) 50%, transparent 100%)' }} />
          </div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col h-full justify-end">
            {event.status && (
              <div className={`absolute top-6 right-6 ${event.status === 'present' ? 'bg-[#2DBE8B] text-white' : 'bg-[#FFCC00] text-black'} text-xs font-bold px-3 py-1.5 rounded-lg shadow-md`}>
                {event.status === 'present' ? 'Present' : 'Registered'}
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight max-w-3xl">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-zinc-200 text-sm sm:text-base mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: '#1BB3A0' }} />
                {typeof event.date === 'string' ? event.date : event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: '#1BB3A0' }} />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: '#1BB3A0' }} />
                {event.location}
              </div>
            </div>
            
            <div className="w-full h-px bg-white/20" />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Details Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <Info className="w-6 h-6" style={{ color: '#1BB3A0' }} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Details</h2>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-zinc-700 leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Event Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Event Schedule
                  </h3>
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 relative overflow-hidden">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-200" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-[#1BB3A0] ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-[#1BB3A0] uppercase tracking-wide block mb-0.5">Start</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.eventStart)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.eventStart)}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block mb-0.5">End</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.eventEnd)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.eventEnd)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Registration
                  </h3>
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 relative overflow-hidden">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-200" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-[#1BB3A0] ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-[#1BB3A0] uppercase tracking-wide block mb-0.5">Opens</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.registrationStart)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.registrationStart)}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block mb-0.5">Closes</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.registrationEnd)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.registrationEnd)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <User className="w-6 h-6" style={{ color: '#1BB3A0' }} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Contact Us</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Organizer</h3>
                  <p className="text-lg font-medium text-zinc-900">{event.contact.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Contact Information</h3>
                  <p className="text-zinc-700 leading-relaxed">{event.contact.contactInformation}</p>
                </div>
              </div>
            </div>
            
            {/* Register Button */}
            <div className="mt-auto pt-8 flex justify-end">
              <button 
                className="flex items-center justify-center gap-2 text-white font-bold text-lg hover:opacity-95 transition-opacity active:scale-95 duration-200 w-50.25 h-14 rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                style={{
                  background: 'linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)'
                }}
              >
                Register
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EventDetail;