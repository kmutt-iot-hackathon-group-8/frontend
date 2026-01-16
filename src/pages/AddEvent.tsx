import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  CirclePlus, 
  CalendarDays, 
  Clock, 
  ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEvent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-6 sm:py-12 pb-32 font-sans overflow-x-hidden">
            <style>{`
                .react-datepicker__triangle { display: none; }
                .react-datepicker { border: none !important; font-family: inherit !important; }
                .react-datepicker__header { background-color: #F0FDFA !important; border-bottom: 1px solid #CCFBF1 !important; padding-top: 1rem !important; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="max-w-400 mx-auto">
                {/* --- Header --- */}
                <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-16">
                    <button onClick={() => navigate('/')} className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors p-2">
                        <ArrowLeft size={36} className="text-gray-800" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                        Add Your Event
                    </h1>
                </div>

                {/* --- Main Content --- */}
                <div className="flex flex-col xl:flex-row gap-12 lg:gap-20">
                    <div className="shrink-0">
                        <div className="relative w-4/5 aspect-[1.18] sm:w-115 sm:h-97.5 rounded-3xl shadow-lg bg-linear-to-b from-[#AFEEDD] to-[#6CB2D7] flex items-center justify-center group cursor-pointer hover:shadow-xl transition-all mx-auto xl:mx-0">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <CirclePlus className="text-[#10726F] w-20 h-20 sm:w-26.5 sm:h-26.5 drop-shadow-sm transition-transform group-hover:scale-110" strokeWidth={1.5} />
                            </div>
                            <input type="file" className="opacity-0 absolute inset-0 cursor-pointer" />
                        </div>
                    </div>

                    <div className="grow flex flex-col gap-6 sm:gap-8 w-full">
                        <div className="w-full">
                            <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Title</label>
                            <input type="text" placeholder="Event Name" className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" />
                        </div>

                        <div className="w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#6B7C85] mb-4 sm:mb-6">On-Site Event</h2>
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                <div className="order-1">
                                    <InputWithIcon label="Start Date" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} type="date" />
                                </div>
                                <div className="order-2">
                                    <InputWithIcon label="End Date" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} type="date" />
                                </div>
                                {/* NEW INFINITE CYCLING TIME PICKERS */}
                                <div className="order-3">
                                    <InfiniteTimePicker label="Start Time" />
                                </div>
                                <div className="order-4">
                                    <InfiniteTimePicker label="End Time" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 w-full xl:w-1/2">
                            <InputWithIcon label="Register Open" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} type="date" />
                            <InputWithIcon label="Register Close" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} type="date" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-12 flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-20">
                    <div className="w-full xl:w-136 shrink-0">
                        <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Brief Details</label>
                        <textarea className="w-full h-31.25 sm:h-49 bg-white border-2 border-gray-200 rounded-2xl p-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"></textarea>
                    </div>

                    <div className="grow flex flex-col justify-between gap-8">
                        <div className="flex flex-col gap-6">
                            <div className="w-full">
                                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Contact Information</label>
                                <input type="text" className="w-full h-13 sm:h-15 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" />
                            </div>
                            <div className="w-full">
                                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Register Link</label>
                                <input type="text" className="w-full h-13 sm:h-18 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" />
                            </div>
                        </div>

                        <div className="flex justify-start sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-12">
                            <button className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-gray-100 text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                            <button className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-lg sm:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENT: INFINITE CYCLING TIME PICKER ---
const InfiniteTimePicker = ({ label }: { label: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeValue, setTimeValue] = useState("12:00");
    
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // CONFIGURATION
    const ITEM_HEIGHT = 40;
    
    // Original Arrays
    const hoursOriginal = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutesOriginal = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    // Triple Arrays for Infinite Loop Effect [Set 1, Set 2 (Middle), Set 3]
    const hoursLooped = [...hoursOriginal, ...hoursOriginal, ...hoursOriginal];
    const minutesLooped = [...minutesOriginal, ...minutesOriginal, ...minutesOriginal];

    // Scroll to the middle set on open
    useEffect(() => {
        if (isOpen && hourRef.current && minuteRef.current) {
            const [h, m] = timeValue.split(':');
            const hIndex = parseInt(h);
            const mIndex = parseInt(m);
            
            // Scroll to the Middle Set (Start of Set 2) + Current Index
            // Set 1 has length 24. So Middle set starts at index 24.
            hourRef.current.scrollTop = (24 + hIndex) * ITEM_HEIGHT;
            
            // Set 1 has length 60. Middle set starts at index 60.
            minuteRef.current.scrollTop = (60 + mIndex) * ITEM_HEIGHT;
        }
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
        const el = e.currentTarget;
        const scrollTop = el.scrollTop;
        
        // 1. INFINITE LOOP LOGIC
        // Calculate height of one complete set (e.g., 00-23)
        const count = type === 'hour' ? 24 : 60;
        const setPixelHeight = count * ITEM_HEIGHT;
        
        // If we scroll into the top buffer (Set 1), jump forward to Set 2
        if (scrollTop < setPixelHeight / 2) {
            el.scrollTop = scrollTop + setPixelHeight;
            return; // Skip update to prevent jitter
        }
        // If we scroll into the bottom buffer (Set 3), jump backward to Set 2
        if (scrollTop > setPixelHeight * 1.5) {
            el.scrollTop = scrollTop - setPixelHeight;
            return;
        }

        // 2. AUTO-SELECT VALUE
        // Which index is visually in the center?
        const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
        const normalizedIndex = rawIndex % count; // Modulo to get 0-23 or 0-59

        if (type === 'hour') {
            const h = hoursOriginal[normalizedIndex];
            // Only update state if it changed to avoid excessive re-renders
            setTimeValue(prev => {
                const currentH = prev.split(':')[0];
                return currentH === h ? prev : `${h}:${prev.split(':')[1]}`;
            });
        } else {
            const m = minutesOriginal[normalizedIndex];
            setTimeValue(prev => {
                const currentM = prev.split(':')[1];
                return currentM === m ? prev : `${prev.split(':')[0]}:${m}`;
            });
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full relative" ref={containerRef}>
            <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600 truncate transition-colors">
                {label}
            </label>
            
            <div className="relative group">
                <input 
                    type="time" 
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    onFocus={() => setIsOpen(false)}
                    className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl pl-4 pr-12 text-base sm:text-lg text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all duration-200 [&::-webkit-calendar-picker-indicator]:hidden"
                />
                
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#54B0A8] hover:text-[#54B0A8] transition-colors focus:outline-none"
                >
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full mt-2 left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center h-48 relative">
                        
                        {/* SELECTION BAR */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-10 bg-[#F0FDFA] border-y border-[#54B0A8]/30 pointer-events-none z-0"></div>

                        {/* HOURS WHEEL */}
                        <div 
                            ref={hourRef}
                            onScroll={(e) => handleScroll(e, 'hour')}
                            className="flex-1 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-10 text-center"
                        >
                            <div className="h-20"></div>
                            {hoursLooped.map((h, i) => (
                                <div key={i} className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all duration-150 ${timeValue.split(':')[0] === h ? 'text-[#10726F] font-bold text-xl scale-110' : 'text-gray-400 opacity-60'}`}>
                                    {h}
                                </div>
                            ))}
                            <div className="h-20"></div>
                        </div>

                        <div className="text-[#54B0A8] font-bold text-xl pb-1 z-10">:</div>

                        {/* MINUTES WHEEL */}
                        <div 
                            ref={minuteRef}
                            onScroll={(e) => handleScroll(e, 'minute')}
                            className="flex-1 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-10 text-center"
                        >
                            <div className="h-20"></div>
                            {minutesLooped.map((m, i) => (
                                <div key={i} className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all duration-150 ${timeValue.split(':')[1] === m ? 'text-[#10726F] font-bold text-xl scale-110' : 'text-gray-400 opacity-60'}`}>
                                    {m}
                                </div>
                            ))}
                            <div className="h-20"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- STANDARD DATE INPUT ---
interface InputProps { label: string; icon: React.ReactNode; type?: 'text' | 'date'; }

// Move CustomInput outside to prevent recreation on every render
const CustomInput = React.forwardRef(({ value, onClick, icon }: any, ref: any) => (
    <div className="relative group/input" onClick={onClick}>
        <input ref={ref} value={value} readOnly placeholder="Select Date"
            className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl pl-4 pr-12 text-base sm:text-lg text-gray-800 font-medium placeholder-gray-400 cursor-pointer focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all duration-200"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/input:text-[#54B0A8] transition-colors">{icon}</div>
    </div>
));

const InputWithIcon = ({ label, icon }: InputProps) => {
    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <div className="w-full">
            <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600 truncate transition-colors">{label}</label>
            <DatePicker 
                selected={startDate} 
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="MMMM d, yyyy"
                customInput={<CustomInput icon={icon} />}
                calendarClassName="bg-white border-0 shadow-2xl rounded-2xl font-sans overflow-hidden"
                dayClassName={(date) => startDate && date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth() ? "bg-[#54B0A8] text-white font-bold rounded-lg hover:bg-[#4a9b94]" : "text-gray-700 hover:bg-[#AFEEDD] hover:text-[#10726F] rounded-lg transition-colors"}
            />
        </div>
    );
};

export default AddEvent;