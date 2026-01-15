import React from 'react';
import { 
  ArrowLeft, 
  CirclePlus, 
  CalendarDays, 
  Clock, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-6 sm:py-12 pb-32 font-sans overflow-x-hidden">
            <div className="max-w-400 mx-auto">
                {/* --- Header --- */}
                <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-16">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={43} className="text-black" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl mb-2 lg:text-5xl font-bold leading-tight sm:leading-14.75">
                        Add Your Event
                    </h1>
                </div>

                {/* --- Main Content Layout --- */}
                <div className="flex flex-col xl:flex-row gap-12 lg:gap-20">
                    
                    {/* --- LEFT SIDE: Image Input --- */}
                    <div className="shrink-0">
                        {/* Gradient Box */}
                        {/* Desktop: 460x390, Mobile: ~363x308 */}
                        <div className="relative w-4/5 aspect-[1.18]  sm:w-115 sm:h-97.5 rounded-4xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-linear-to-b from-[#AFEEDD] to-[#6CB2D7] flex items-center justify-center group cursor-pointer hover:opacity-95 transition-opacity mx-auto xl:mx-0">
                            
                           

                            {/* Circle Plus Icon - CENTERED */}
                            <div className="absolute inset-0 flex items-center justify-center  pointer-events-none">
                                    <CirclePlus 
                                        className="text-[#10726F] w-20 h-20 sm:w-26.5 sm:h-26.5" 
                                        strokeWidth={1} 
                                    />
                            </div>
                            
                            <input type="file" className="opacity-0 absolute inset-0 cursor-pointer" />
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: Form Inputs --- */}
                    <div className="grow flex flex-col gap-6 sm:gap-8 w-full">
                        
                        {/* Title Input */}
                        <div className="w-full">
                            <label className="block text-base sm:text-xl font-bold mb-2 text-black">Title</label>
                            <input 
                                type="text" 
                                className="w-full h-13 sm:h-16 bg-[#F4F7F8] border-4 border-black rounded-2xl px-4 text-base sm:text-lg focus:outline-none focus:border-[#10726F] transition-colors"
                            />
                        </div>

                        {/* On Site Registration Section */}
                        <div className="w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#6B7C85] mb-4 sm:mb-3">On-Site Registration</h2>
                            
                            {/* Grid Layout Strategy:
                                Mobile (grid-cols-2): We use 'order' classes to force [Date][Date] then [Time][Time].
                                Desktop (grid-cols-4): We use 'xl:order' to force logical flow [StartDate][StartTime][EndTime][EndDate].
                            */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                {/* Register Start Date (Mobile: Top Left, Desktop: 1st) */}
                                <div className="order-1 xl:order-1">
                                    <InputWithIcon label="Register Start Date" icon={<CalendarDays className="w-6 h-6 sm:w-8.25 sm:h-8.25 text-[#1BB3A9]" />} />
                                </div>

                                {/* Register End Date (Mobile: Top Right, Desktop: 4th) */}
                                <div className="order-2 xl:order-4">
                                    <InputWithIcon label="Register End Date" icon={<CalendarDays className="w-6 h-6 sm:w-8.25 sm:h-8.25 text-[#1BB3A9]" />} />
                                </div>
                                
                                {/* Register Start Time (Mobile: Bottom Left, Desktop: 2nd) */}
                                <div className="order-3 xl:order-2">
                                    <InputWithIcon label="Register Start Time" icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#1BB3A9]" />} />
                                </div>

                                {/* Register End Time (Mobile: Bottom Right, Desktop: 3rd) */}
                                <div className="order-4 xl:order-3">
                                    <InputWithIcon label="Register End Time" icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#1BB3A9]" />} />
                                </div>
                            </div>
                        </div>

                        {/* Event Start/End Dates */}
                        <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 w-full xl:w-1/2">
                            <InputWithIcon label="Event Start Date" icon={<CalendarDays className="w-6 h-6 sm:w-8.25 sm:h-8.25 text-[#1BB3A9]" />} />
                            <InputWithIcon label="Event End Date" icon={<CalendarDays className="w-6 h-6 sm:w-8.25 sm:h-8.25 text-[#1BB3A9]" />} />
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="mt-8 sm:mt-12 flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-20">
                    
                    {/* Left Col: Brief Details */}
                    <div className="w-full xl:w-136 shrink-0">
                        <label className="block text-base sm:text-xl font-bold mb-2 text-black">Brief Details</label>
                        <textarea 
                            className="w-full h-31.25 sm:h-49 bg-[#F4F7F8] border-4 border-black rounded-2xl p-4 text-base sm:text-lg resize-none focus:outline-none focus:border-[#10726F] transition-colors"
                        ></textarea>
                    </div>

                    {/* Right Col: Contact & Link + Buttons */}
                    <div className="grow flex flex-col justify-between gap-8">
                        <div className="flex flex-col gap-6">
                            <div className="w-full">
                                <label className="block text-base sm:text-xl font-bold mb-2 text-black">Contact Information</label>
                                <input 
                                    type="text" 
                                    className="w-full h-13 sm:h-15 bg-[#F4F7F8] border-4 border-black rounded-2xl px-4 text-base sm:text-lg focus:outline-none focus:border-[#10726F]"
                                />
                            </div>
                            <div className="w-full">
                                <label className="block text-base sm:text-xl font-bold mb-2 text-black">Register Link</label>
                                <input 
                                    type="text" 
                                    className="w-full h-13 sm:h-18 bg-[#F4F7F8] border-4 border-black rounded-2xl px-4 text-base sm:text-lg focus:outline-none focus:border-[#10726F]"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-12">
                            <button className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-[#A8BFC6] text-white text-lg sm:text-xl font-bold rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:brightness-95 transition-all">
                                Cancel
                            </button>
                            <button className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-lg sm:text-xl font-bold rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:brightness-110 transition-all">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Component for Inputs with Icons
const InputWithIcon = ({ label, icon }: { label: string, icon: React.ReactNode }) => {
    return (
        <div className="w-full">
            <label className="block text-base sm:text-xl font-bold mb-2 text-black truncate">{label}</label>
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full h-13 sm:h-16 bg-[#F4F7F8] border-4 border-black rounded-2xl pl-3 sm:pl-4 pr-10 sm:pr-12 text-base sm:text-lg focus:outline-none focus:border-[#10726F] transition-colors"
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default AddEvent;