import { Mail, Edit, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
interface Attendee {
  id: number;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm relative flex flex-col"
      style={{ zIndex: isDropdownOpen ? 50 : 1 }}
    >
      {/* Status Badge*/}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit size={18} className="text-gray-600" />
        </motion.button>
        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }} // Light red bg on hover
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
        >
          <Trash2 size={18} className="text-gray-600 group-hover:text-red-500 transition-colors" />
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className={`w-14 h-14 rounded-full ${attendee.bgColor} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}
          >
            {attendee.initials}
          </motion.div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 pr-16">
            <h4 className="font-bold text-lg text-black truncate">{attendee.name}</h4>
            <div className="flex items-center gap-2 mb-3 text-gray-500">
              <Mail size={16} />
              <span className="text-sm truncate">{attendee.email}</span>
            </div>

            {/* Status Pill */}
            <motion.span
              layout
              className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-300 ${getStatusColor(
                attendee.status
              )}`}
            >
              {attendee.status === "No Status" && <CircleAlert size={16} />}
              {attendee.status === "Present" && <CircleCheck size={16} />}
              {attendee.status === "Absent" && <CircleX size={16} />}
              {attendee.status}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Footer: Status Dropdown */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onDropdownToggle}
            className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 w-full sm:w-auto"
          >
            <span>{attendee.status}</span>
            {/* Animated Chevron Rotation */}
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-500" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu Animation */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 min-w-37.5 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden origin-top-left"
              >
                {["Present", "Absent", "No Status"].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ backgroundColor: "#F3F4F6" }} // Tailwind gray-100 equivalent
                    onClick={() =>
                      onStatusChange(status as "Present" | "Absent" | "No Status")
                    }
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 block"
                  >
                    {status}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendeeCard;
