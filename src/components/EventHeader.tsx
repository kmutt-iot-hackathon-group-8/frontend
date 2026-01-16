import { Edit, Trash2 } from "lucide-react";

interface EventHeaderProps {
  title: string;
  date: string;
  location: string;
  attendeeCount: number;
  image: string;
}

const EventHeader = ({
  title,
  date,
  location,
  attendeeCount,
  image,
}: EventHeaderProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 sm:p-8 mb-8 flex flex-col sm:flex-row gap-6 relative">
      {/* Event Image */}
      <div className="w-full sm:w-64 h-48 sm:h-56 rounded-lg overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Event Details */}
      <div className="flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
          {title}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">📅</span>
            <span className="text-gray-700">{date}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">📍</span>
            <span className="text-gray-700">{location}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">👥</span>
            <span className="text-gray-700">{attendeeCount} Attendees</span>
          </div>
        </div>
      </div>

      {/* Edit and Delete Icons - Top Right */}
      <div className="absolute top-6 right-6 flex gap-3">
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <Edit size={20} className="text-black" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <Trash2 size={20} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default EventHeader;
