import { Calendar, Clock, ArrowRight, User, Info, Timer, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Event } from '../components/EventCard';

// Extended Event Interface for detail view
interface DetailedEvent extends Event {
  description?: string;
  fullDescription?: string;
  eventStart?: Date;
  eventEnd?: Date;
  registrationStart?: Date;
  registrationEnd?: Date;
  contact?: string;
  regisURL?: string;
}

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<DetailedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          console.error('Failed to fetch event');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.uid || !id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/v1/events/${id}/attendees`);
        if (response.ok) {
          const attendees = await response.json();
          const userAttendee = attendees.find((a: any) => a.uid === user.uid);
          setUserStatus(userAttendee ? userAttendee.status : null);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    if (id) {
      fetchEventDetail();
      fetchUserStatus();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleRegister = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Registered successfully!');
        setUserStatus('registered');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

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
            {userStatus && (
              <div className={`absolute top-6 right-6 ${userStatus === 'present' ? 'bg-[#2DBE8B] text-white' : userStatus === 'absent' ? 'bg-[#FF383C] text-white' : 'bg-[#FFCC00] text-black'} text-xs font-bold px-3 py-1.5 rounded-lg shadow-md`}>
                {userStatus === 'present' ? 'Present' : userStatus === 'absent' ? 'Absent' : 'Registered'}
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight max-w-3xl">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-zinc-200 text-sm sm:text-base mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: '#1BB3A0' }} />
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: '#1BB3A0' }} />
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: '#1BB3A0' }} />
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
                  {event.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Attendees</h3>
                <p className="text-zinc-700 leading-relaxed">
                  {event.attendeeCount} registered {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
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
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.startDate)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.startTime)}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block mb-0.5">End</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.endDate)}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">{formatTime(event.endTime)}</p>
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
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.regisStart)}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white mt-1.5 shrink-0 z-10 shadow-sm" />
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block mb-0.5">Closes</span>
                          <p className="font-semibold text-zinc-900 leading-tight">{formatDate(event.regisEnd)}</p>
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
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Location</h3>
                  <p className="text-lg font-medium text-zinc-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Contact Information</h3>
                  <p className="text-zinc-700 leading-relaxed">{event.contact}</p>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-auto pt-8 flex justify-end">
              {!userStatus && (
                <button 
                  onClick={handleRegister}
                  className="flex items-center justify-center gap-2 text-white font-bold text-lg hover:opacity-95 transition-opacity active:scale-95 duration-200 w-50.25 h-14 rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                  style={{
                    background: 'linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)'
                  }}
                >
                  Register
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              {userStatus === 'registered' && (
                <div className="flex items-center justify-center gap-2 text-gray-600 font-medium text-lg">
                  Check in using your registered card at the event
                </div>
              )}
              {userStatus === 'present' && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-lg">
                  ✓ Checked In
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EventDetail;