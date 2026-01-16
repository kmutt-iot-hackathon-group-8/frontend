import { Mail, Edit, Trash2, ChevronDown } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: "Present" | "Absent" | "No Status";
  avatar: string;
  initials: string;
  bgColor: string;
}

interface AttendeeCardProps {
  attendee: Attendee;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onStatusChange: (status: "Present" | "Absent" | "No Status") => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
}

const AttendeeCard = ({
  attendee,
  isDropdownOpen,
  onDropdownToggle,
  onStatusChange,
  onDelete,
  getStatusColor,
}: AttendeeCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(attendee.status)}`}
        >
          {attendee.status}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Edit size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Trash2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-full ${attendee.bgColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
          >
            {attendee.initials}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-black">{attendee.name}</h4>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Mail size={16} />
          <span className="text-sm">{attendee.email}</span>
        </div>
      </div>

      {/* Footer: Status Dropdown */}
      <div className="flex items-center gap-3 -mx-6 -mb-6 px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <div className="relative flex-1">
          <button
            onClick={onDropdownToggle}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm font-semibold"
          >
            <span>{attendee.status}</span>
            <ChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {["Present", "Absent", "No Status"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    onStatusChange(status as "Present" | "Absent" | "No Status")
                  }
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeCard;
