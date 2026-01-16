import { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import EventHeader from "../components/EventHeader";
import SearchAndFilter from "../components/SearchAndFilter";
import AttendeeCard from "../components/AttendeeCard";
import AddMemberModal from "../components/AddMemberModal";
import { API } from "../utils/api";

interface Attendee {
  id: string;
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
  const [event, setEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const eventData = await API.events.getById(parseInt(id));
        setEvent(eventData);

        const attendeesData = await API.attendees.getByEventId(parseInt(id));
        const mappedAttendees = attendeesData.map((a: any, idx: number) => {
          const initials = `${a.fname?.[0] || ""}${a.lname?.[0] || ""}`.toUpperCase();
          const colors = [
            "bg-blue-400", "bg-purple-400", "bg-pink-400", 
            "bg-orange-400", "bg-green-400", "bg-red-400",
          ];
          return {
            id: a.userId,
            name: `${a.fname} ${a.lname}`,
            email: a.email,
            status: (a.status === "present"
              ? "Present"
              : a.status === "absent"
                ? "Absent"
                : "No Status") as "Present" | "Absent" | "No Status",
            initials,
            avatar: "",
            bgColor: colors[idx % colors.length],
          };
        });
        setAttendees(mappedAttendees);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "All Statuses" || attendee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (userId: string, newStatus: "Present" | "Absent" | "No Status") => {
    try {
      const statusMap: Record<string, string> = {
        Present: "present",
        Absent: "absent",
        "No Status": "registered",
      };
      await API.attendees.updateStatus(
        parseInt(id!),
        userId,
        statusMap[newStatus] as any,
      );
      setAttendees(
        attendees.map((a) => (a.id === userId ? { ...a, status: newStatus } : a)),
      );
      setActiveDropdown(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await API.attendees.remove(parseInt(id!), userId);
      setAttendees(attendees.filter((a) => a.id !== userId));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to remove attendee");
    }
  };

  const handleAddMember = async () => {
    if (formData.name.trim() && formData.email.trim()) {
      try {
        await API.attendees.add(parseInt(id!), "0", "registered");
        setFormData({ name: "", email: "" });
        setShowAddModal(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to add member");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-[#2DBE8B] text-white";
      case "Absent": return "bg-[#E5484D] text-white";
      case "No Status":
      default: return "bg-[#FFCC00] text-black";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-semibold text-lg">Loading attendees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-20">
        {/* Navigation */}
        <button
          onClick={() => navigate("/created-events")}
          className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity mb-8"
        >
          <ArrowLeft size={24} />
          <span className="font-semibold text-2xl">Back</span>
        </button>

        {/* Dynamic Event Header */}
        {event && (
          <EventHeader
            title={event.eventDetail || "Event"}
            date={new Date(event.eventStartDate).toLocaleDateString()}
            location={event.contact || "TBA"}
            attendeeCount={attendees.length}
            image={
              event.eventIMG ||
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            }
          />
        )}

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

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            isFilterOpen={activeDropdown === "filter"}
            onFilterToggle={() =>
              setActiveDropdown(activeDropdown === "filter" ? null : "filter")
            }
          />

          {/* Attendee Cards Grid with padding from 'main' and spacing from 'feat/api' */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pb-24">
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