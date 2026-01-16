import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventHeader from "../components/EventHeader";
import SearchAndFilter from "../components/SearchAndFilter";
import AttendeeCard from "../components/AttendeeCard";
import AddMemberModal from "../components/AddMemberModal";

interface Attendee {
  id: number;
  name: string;
  email: string;
  status: "Present" | "Absent" | "No Status";
  avatar: string;
  initials: string;
  bgColor: string;
}

const MOCK_ATTENDEES: Attendee[] = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah.c@skynet.com",
    status: "Present",
    initials: "SC",
    avatar: "",
    bgColor: "bg-blue-400",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Absent",
    initials: "JD",
    avatar: "",
    bgColor: "bg-purple-400",
  },
  {
    id: 3,
    name: "Emily Blunt",
    email: "emily.b@hollywood.com",
    status: "No Status",
    initials: "EB",
    avatar: "",
    bgColor: "bg-pink-400",
  },
  {
    id: 4,
    name: "Michael Scott",
    email: "m.scott@dunder.com",
    status: "Present",
    initials: "MS",
    avatar: "",
    bgColor: "bg-orange-400",
  },
  {
    id: 5,
    name: "Dwight Schrute",
    email: "beets@farms.com",
    status: "Present",
    initials: "DS",
    avatar: "",
    bgColor: "bg-green-400",
  },
  {
    id: 6,
    name: "Jim Halpert",
    email: "jim.h@dunder.com",
    status: "Absent",
    initials: "JH",
    avatar: "",
    bgColor: "bg-red-400",
  },
];

const EVENT_DATA = {
  title: "2026 IoT Hackaton Challenge",
  date: "24 JAN 2026",
  location: "Tech Hub, Room 404",
  attendeeCount: 8,
  image:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
};

const EventAttendees = () => {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<Attendee[]>(MOCK_ATTENDEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

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
        return "bg-green-500 text-white";
      case "Absent":
        return "bg-red-500 text-white";
      case "No Status":
      default:
        return "bg-yellow-400 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/created-events")}
          className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity mb-8"
        >
          <ArrowLeft size={24} />
          <span className="font-semibold">Back</span>
        </button>

        {/* Event Header Component */}
        <EventHeader
          title={EVENT_DATA.title}
          date={EVENT_DATA.date}
          location={EVENT_DATA.location}
          attendeeCount={EVENT_DATA.attendeeCount}
          image={EVENT_DATA.image}
        />

        {/* Attendees Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-black">
              {filteredAttendees.length} Attendees
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold w-full sm:w-auto"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
