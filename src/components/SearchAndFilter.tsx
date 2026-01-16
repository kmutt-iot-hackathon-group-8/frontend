import { Search, ChevronDown } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
}

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  isFilterOpen,
  onFilterToggle,
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search attendees..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Status Filter */}
      <div className="relative min-w-48">
        <button
          onClick={onFilterToggle}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>{filterStatus}</span>
          <ChevronDown size={20} />
        </button>
        {isFilterOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {["All Statuses", "Present", "Absent", "No Status"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    onFilterChange(status);
                    onFilterToggle();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {status}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
