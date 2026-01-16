import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  User,
  Info,
  Timer,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const data = await API.events.getById(parseInt(id));
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      await API.attendees.register(parseInt(id!), user.uid);
      alert("Successfully registered for event!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to register");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  const formatTime = (timeStr: string) => timeStr || "00:00";

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-montserrat pb-20 relative">
      <div className="absolute -top-10  left-4 sm:left-20 md:left-10 lg:left-20 z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={43} className="text-black" />
        </button>
      </div>

      <div className="max-w-7xl mt-9 mx-auto w-full p-3 sm:p-6">
        <div
          className="w-full h-80 sm:h-96 rounded-xl overflow-hidden relative group text-white flex flex-col shadow-lg mb-6 sm:mb-8"
          style={{ backgroundColor: "#0D5958" }}
        >
          <div className="absolute inset-0">
            <img
              src={
                event.eventIMG ||
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              }
              alt="Event"
              className="w-full h-full object-cover opacity-40"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #0a3d3c 0%, rgba(13, 89, 88, 0.6) 50%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col h-full justify-end">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight max-w-3xl">
              {event.eventDetail || "Event"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-zinc-200 text-sm sm:text-base mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: "#1BB3A0" }} />
                {formatDate(event.eventStartDate)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: "#1BB3A0" }} />
                {formatTime(event.eventStartTime)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: "#1BB3A0" }} />
                {event.contact || "TBA"}
              </div>
            </div>

            <div className="w-full h-px bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <Info className="w-6 h-6" style={{ color: "#1BB3A0" }} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Details</h2>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-zinc-700 leading-relaxed">
                  {event.eventDetail || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Event Schedule
                  </h3>
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#1BB3A0] uppercase tracking-wide">
                          Start
                        </p>
                        <p className="font-semibold text-zinc-900">
                          {formatDate(event.eventStartDate)}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {formatTime(event.eventStartTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                          End
                        </p>
                        <p className="font-semibold text-zinc-900">
                          {formatDate(event.eventEndDate)}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {formatTime(event.eventEndTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Registration
                  </h3>
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#1BB3A0] uppercase tracking-wide">
                          Opens
                        </p>
                        <p className="font-semibold text-zinc-900">
                          {formatDate(event.regisStart)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                          Closes
                        </p>
                        <p className="font-semibold text-zinc-900">
                          {formatDate(event.regisEnd)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <User className="w-6 h-6" style={{ color: "#1BB3A0" }} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Contact</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Organizer
                  </h3>
                  <p className="text-lg font-medium text-zinc-900">
                    {event.fname} {event.lname}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Contact Information
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    {event.contact || "No contact info"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 flex justify-end">
              <button
                onClick={handleRegister}
                className="flex items-center justify-center gap-2 text-white font-bold text-lg hover:opacity-95 transition-opacity active:scale-95 duration-200 w-50.25 h-14 rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)",
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

