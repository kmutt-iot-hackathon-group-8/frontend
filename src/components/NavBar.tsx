import { useState } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import profileIcon from '../assets/icons/profile.png';
import createdEventIcon from '../assets/icons/createdEvent.png';
import attEventIcon from '../assets/icons/attEvent.png';

const NavBar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 md:px-16 md:pt-10 md:pb-6 bg-white">
            <div className="flex items-center">
                <span className="font-montserrat font-bold text-2xl md:text-4xl md:-ml-5 md:mr-5 lg:ml-6 text-black">
                    ModTap
                </span>
            </div>

            <div className="flex items-center gap-4 md:gap-8 mr-6">
                <div className="relative hidden md:block w-95.5 h-16">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-8 h-8 ml-1" strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search an Event"
                        className="w-full h-full pl-17 pr-4 border-4 border-black rounded-2xl font-montserrat font-bold text-lg placeholder-[#B2B0B0] focus:outline-none focus:ring-0"
                    />
                </div>

                <button className="md:hidden p-2">
                    <Search className="w-6 h-6 text-black" strokeWidth={2.5} />
                </button>

                <div 
                    className="relative"
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                >
                    <button 
                        className="w-12 h-12 md:w-24 md:h-24 rounded-full flex items-center justify-center border-none cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(90deg, #AFEEDD 0%, #6CB2D7 100%)' }}
                    >
                         <User className="w-6 h-6 md:w-15 md:h-15" strokeWidth={2.5} stroke="#10726F" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 -mt-3 w-52 flex flex-col z-50 font-montserrat" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}>
                            <button className="flex items-center gap-3 pl-6 pr-4 h-11.75 bg-[#F4F7F8] rounded-t-md hover:bg-[#A8BFC6] transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <img src={profileIcon} alt="Profile" className="max-w-full max-h-full object-contain" />
                                </div>
                                <span className="font-bold text-[14px] leading-4.25 text-[#1E1E1E]">View Profile</span>
                            </button>

                            <button className="flex items-center gap-3 pl-6 pr-4 h-11.75 bg-[#F4F7F8] hover:bg-[#A8BFC6] transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <img src={createdEventIcon} alt="Created Events" className="max-w-full max-h-full object-contain" />
                                </div>
                                <span className="font-bold text-[14px] leading-4.25 text-[#1E1E1E]">Created Events</span>
                            </button>
                            
                            <button className="flex items-center gap-3 pl-6  pr-4 h-11.5 bg-[#F4F7F8] hover:bg-[#A8BFC6] transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <img src={attEventIcon} alt="Attended Events" className="max-w-full max-h-full object-contain" />
                                </div>
                                <span className="font-bold text-[14px] leading-4.25 text-[#1E1E1E]">Attended Events</span>
                            </button>

                            <button className="flex items-center gap-3 pl-6 pr-4 h-11.5 bg-[#F4F7F8] rounded-b-md hover:bg-[#A8BFC6] transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <LogOut className="w-full h-full text-black" strokeWidth={2} />
                                </div>
                                <span className="font-bold text-[14px] leading-4.25 text-[#1E1E1E]">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;