import { useState, useEffect } from "react";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard, { type Event } from "../components/EventCard";
import clickToAddNewEvents from "../assets/icons/clicktoaddnewevents.webp";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CreatedEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!user) return;
        setIsLoading(true);
        const data = await API.events.getAll(undefined, user.id);
        const mappedEvents = data.map((e: any) => ({
          id: e.eventId,
          title: e.eventDetail || "Event",
          date: new Date(e.eventStartDate),
          time: e.eventStartTime || "00:00",
          location: e.contact || "TBA",
          image:
            e.eventIMG ||
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
          status: "registered",
          description: e.eventDetail || "",
          attendees: e.attendeeCount || 0,
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch created events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your events</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-6 sm:py-12">
      <div className="max-w-400 mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={43} className="text-black" />
          </button>
          <h1 className="text-3xl sm:text-4xl mb-2 lg:text-5xl font-bold leading-tight sm:leading-14.75">
            Created Event List
          </h1>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 sm:gap-0 mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl font-bold text-[#6B7C85]">
            {events.length} events
          </p>
          <div className="relative flex flex-col items-center">
            <img
              src={clickToAddNewEvents}
              alt="Click to Add New Events"
              className={`absolute -top-15 right-0 sm:mr-11 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ width: "200px", maxWidth: "200px" }}
            />
            <button
              className="flex items-center mr-2 sm:mr-30 gap-3 hover:opacity-80 transition-opacity"
              onClick={() => navigate("/add-event")}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CirclePlus
                size={45}
                className="text-[#10726F]"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading your events...</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-8 max-w-375">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="text-center py-20 bg-gray-100 rounded-lg">
                <p className="text-gray-500">No events created yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedEvents;
