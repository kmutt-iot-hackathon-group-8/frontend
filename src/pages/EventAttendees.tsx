import { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import EventCard from '../components/EventCard';
import SearchAndFilter from "../components/SearchAndFilter";
import AttendeeCard from "../components/AttendeeCard";
import AddMemberModal from "../components/AddMemberModal";
import { Mosaic } from 'react-loading-indicators';
import type { Event } from '../components/EventCard';

interface Attendee {
  id: number;
  name: string;
  email: string;
  status: "Present" | "Absent" | "No Status";
  avatar: string;
  initials: string;
  bgColor: string;
}

const EventAttendees = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchEventAndAttendeesData = async () => {
      if (!id) return;
      
      try {
        // Fetch event data
        const eventResponse = await fetch(`http://localhost:3000/api/v1/events/${id}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          // Transform the API response to match Event interface
          const transformedEvent: Event = {
            eventid: eventData.eventid,
            title: eventData.title,
            eventstartdate: eventData.startDate,
            eventenddate: eventData.endDate,
            eventstarttime: eventData.startTime,
            eventendtime: eventData.endTime,
            image: eventData.image,
            location: eventData.location,
            attendeeCount: eventData.attendeeCount,
            description: eventData.description,
            regisstart: eventData.regisStart,
            regisend: eventData.regisEnd,
            contact: eventData.contact
          };
          setEvent(transformedEvent);
        } else {
          console.error('Failed to fetch event');
        }

        // Fetch attendees data
        const attendeesResponse = await fetch(`http://localhost:3000/api/v1/events/${id}/attendees`);
        if (attendeesResponse.ok) {
          const attendeesData = await attendeesResponse.json();
          // Transform API response to match Attendee interface
          const transformedAttendees: Attendee[] = attendeesData.map((attendee: any, index: number) => {
            const fullName = `${attendee.fname} ${attendee.lname}`;
            const initials = fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            
            // Map status from API to component format
            let status: "Present" | "Absent" | "No Status";
            switch (attendee.status) {
              case "present":
                status = "Present";
                break;
              case "absent":
                status = "Absent";
                break;
              default:
                status = "No Status";
            }

            const colors = [
              "bg-blue-400",
              "bg-purple-400",
              "bg-pink-400",
              "bg-orange-400",
              "bg-green-400",
              "bg-red-400",
            ];
            const bgColor = colors[index % colors.length];

            return {
              id: attendee.uid,
              name: fullName,
              email: attendee.email,
              status,
              avatar: "",
              initials,
              bgColor,
            };
          });
          setAttendees(transformedAttendees);
        } else {
          console.error('Failed to fetch attendees');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAttendeesData();
  }, [id]);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "All Statuses" || attendee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (
    id: number,
    newStatus: "Present" | "Absent" | "No Status",
  ) => {
    setAttendees(
      attendees.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
    setActiveDropdown(null);
  };

  const handleDelete = (id: number) => {
    setAttendees(attendees.filter((a) => a.id !== id));
  };

  const handleAddMember = () => {
    if (formData.name.trim() && formData.email.trim()) {
      const initials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      const colors = [
        "bg-blue-400",
        "bg-purple-400",
        "bg-pink-400",
        "bg-orange-400",
        "bg-green-400",
        "bg-red-400",
      ];
      const bgColor = colors[attendees.length % colors.length];

      const newAttendee: Attendee = {
        id: Math.max(...attendees.map((a) => a.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        status: "No Status",
        initials,
        avatar: "",
        bgColor,
      };

      setAttendees([...attendees, newAttendee]);
      setFormData({ name: "", email: "" });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-[#2DBE8B] text-white";
      case "Absent":
        return "bg-[#E5484D] text-white";
      case "No Status":
      default:
        return "bg-[#FFCC00] text-black";
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Mosaic color={["#2dbe8b", "#422dbe", "#be2d60", "#a8be2d"]} /></div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/created-events")}
          className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity mb-8"
        >
          <ArrowLeft size={24} />
          <span className="font-semibold text-2xl">Back</span>
        </button>

        {/* Event Header Component */}
         <EventCard key={event.eventid} event={event} showActions={true} />

        {/* Attendees Section */}
        <div className="mb-8 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-black">
              {filteredAttendees.length} Attendees
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#10726F] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Member
            </button>
          </div>

          {/* Search and Filter Component */}
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            isFilterOpen={activeDropdown === 0}
            onFilterToggle={() =>
              setActiveDropdown(activeDropdown === 0 ? null : 0)
            }
          />

          {/* Attendee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {filteredAttendees.map((attendee) => (
              <AttendeeCard
                key={attendee.id}
                attendee={attendee}
                isDropdownOpen={activeDropdown === attendee.id}
                onDropdownToggle={() =>
                  setActiveDropdown(
                    activeDropdown === attendee.id ? null : attendee.id,
                  )
                }
                onStatusChange={(newStatus) =>
                  handleStatusChange(attendee.id, newStatus)
                }
                onDelete={() => handleDelete(attendee.id)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal Component */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        formData={formData}
        onFormChange={(field, value) =>
          setFormData({ ...formData, [field]: value })
        }
        onSubmit={handleAddMember}
      />
    </div>
  );
};

export default EventAttendees;
