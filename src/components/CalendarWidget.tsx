import { useState } from 'react';

interface CalendarWidgetProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2025 + i);

const CalendarWidget = ({ selectedDate, onSelectDate }: CalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (selectedDate && newDate.getTime() === selectedDate.getTime()) {
      onSelectDate(null);
    } else {
      onSelectDate(newDate);
    }
  };

  return (
    <div className="bg-white border-2 border-zinc-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-left items-center mb-6 gap-2">
        <select
          value={currentDate.getMonth()}
          onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
          className="bg-transparent font-bold text-zinc-900 text-lg border-none focus:ring-0 cursor-pointer hover:bg-zinc-50 rounded px-2 py-1"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>

        <select
          value={currentDate.getFullYear()}
          onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
          className="bg-transparent font-bold text-zinc-900 text-lg border-none focus:ring-0 cursor-pointer hover:bg-zinc-50 rounded px-2 py-1"
        >
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-xs font-medium text-zinc-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1 content-start">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`
              h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all duration-200
              ${isSelected(day)
                ? 'text-white font-medium shadow-md scale-110'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'}
            `}
            style={isSelected(day) ? { backgroundColor: '#1BB3A0' } : undefined}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
