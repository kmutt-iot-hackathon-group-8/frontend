import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  CirclePlus, 
  CalendarDays, 
  Clock, 
  ChevronDown 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface DetailedEvent {
  eventid?: number;
  eventtitle?: string;
  eventimg?: string;
  eventdetail?: string;
  eventstartdate?: string;
  eventstarttime?: string;
  eventenddate?: string;
  eventendtime?: string;
  regisstart?: string;
  regisend?: string;
  contact?: string;
  eventlocation?: string;
}

const EditEvent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    // State for all form fields
    const [title, setTitle] = useState('');
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState('12:00');
    const [endTime, setEndTime] = useState('12:00');
    const [regisStart, setRegisStart] = useState<Date | null>(null);
    const [regisEnd, setRegisEnd] = useState<Date | null>(null);
    const [eventlocation, setEventLocation] = useState('');
    const [details, setDetails] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [event, setEvent] = useState<DetailedEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        console.log('Fetching event with ID:', eventId);
        const response = await fetch(`http://localhost:3000/api/event/${eventId}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Event data received:', data);
          // Extract the event object from the response
          if (data.success && data.event) {
            setEvent(data.event);
          } else {
            setEvent(data);
          }
        } else {
          console.error('Failed to fetch event, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);

  // Populate form fields when event data is loaded
  useEffect(() => {
    if (event) {
      console.log('Populating form with event data:', event);
      
      // Set title
      if (event.eventtitle) setTitle(event.eventtitle);
      
      // Set image preview
      if (event.eventimg) setImagePreview(event.eventimg);
      
      // Set description
      if (event.eventdetail) setDetails(event.eventdetail);
      
      // Set contact
      if (event.contact) setContact(event.contact);
      
      // Set location
      if (event.eventlocation) setEventLocation(event.eventlocation);
      
      // Set start date and time
      if (event.eventstartdate) {
        const startDate = new Date(event.eventstartdate);
        console.log('Start date:', startDate);
        setStartDate(startDate);
        
        // Set start time from eventstarttime (format: "HH:MM:SS")
        if (event.eventstarttime) {
          const timeStr = event.eventstarttime.substring(0, 5); // Get HH:MM
          console.log('Start time:', timeStr);
          setStartTime(timeStr);
        }
      }
      
      // Set end date and time
      if (event.eventenddate) {
        const endDate = new Date(event.eventenddate);
        console.log('End date:', endDate);
        setEndDate(endDate);
        
        // Set end time from eventendtime (format: "HH:MM:SS")
        if (event.eventendtime) {
          const timeStr = event.eventendtime.substring(0, 5); // Get HH:MM
          console.log('End time:', timeStr);
          setEndTime(timeStr);
        }
      }
      
      // Set registration start
      if (event.regisstart) {
        console.log('Registration start:', event.regisstart);
        setRegisStart(new Date(event.regisstart));
      }
      
      // Set registration end
      if (event.regisend) {
        console.log('Registration end:', event.regisend);
        setRegisEnd(new Date(event.regisend));
      }
      
      console.log('Form populated successfully');
    }
  }, [event]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }
    const userId = JSON.parse(localStorage.getItem('user') || '{}');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEventImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Validate required fields
            if (!title || !startDate || !endDate || !regisStart || !regisEnd) {
                alert('Please fill in all required fields');
                return;
            }

            // Combine date and time into single datetime values
            const startDateTime = new Date(startDate);
            const [startHour, startMinute] = startTime.split(':').map(Number);
            startDateTime.setHours(startHour, startMinute, 0, 0);
            
            const endDateTime = new Date(endDate);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            endDateTime.setHours(endHour, endMinute, 0, 0);

            // Prepare event data matching backend expectations
            // Use current values if changed, otherwise keep original values
            const eventData = {
                eventOwner: userId,
                eventtitle: title || event.eventtitle || '',
                eventDetail: details || event.eventdetail || '',
                eventImg: event.eventimg, // Keep exact original image value (null or URL)
                eventStartDate: startDateTime.toISOString(),
                eventEndDate: endDateTime.toISOString(),
                eventStartTime: startDateTime.toISOString(),
                eventEndTime: endDateTime.toISOString(),
                regisStart: regisStart.toISOString(),
                regisEnd: regisEnd.toISOString(),
                contact: contact || event.contact || '',
                eventlocation: eventlocation || event.eventlocation || '',
            };

            console.log('Sending event data:', eventData);

            // Step 1: Update the event
            let response;
            try {
                response = await fetch(`http://localhost:3000/api/event/${event.eventid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                });
            } catch (error) {
                console.error('Network error:', error);
                throw new Error('Cannot connect to server. Please ensure the backend is running at http://localhost:3000');
            }

            // Get response text first
            const responseText = await response.text();
            console.log('Raw response:', { status: response.status, text: responseText.substring(0, 500) });

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response:', data);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                throw new Error(`Server returned invalid JSON (${response.status}): ${responseText.substring(0, 200)}`);
            }

            if (response.ok && data.success) {
                // Step 2: Upload image ONLY if a new image file was selected
                if (eventImage && eventId) {
                    try {
                        const formData = new FormData();
                        formData.append('image', eventImage);
                        formData.append('eventid', eventId.toString());

                        const uploadResponse = await fetch('http://localhost:3000/api/upload', {
                            method: 'POST',
                            body: formData, // No Content-Type header - browser sets it automatically with boundary
                        });

                        // Get response text first
                        const uploadText = await uploadResponse.text();
                        console.log('Image upload response:', { status: uploadResponse.status, text: uploadText });
                        
                        let uploadData;
                        try {
                            uploadData = JSON.parse(uploadText);
                            console.log('Parsed upload response:', uploadData);
                        } catch (e) {
                            console.error('Failed to parse upload response:', uploadText.substring(0, 200));
                            throw new Error('Invalid JSON response from image upload');
                        }
                        
                        if (!uploadResponse.ok || !uploadData.success) {
                            console.error('Image upload failed:', uploadData);
                            alert('Event updated but image upload failed. You can edit the event to add an image later.');
                        } else {
                            console.log('Image uploaded successfully:', uploadData.image?.eventIMG);
                        }
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError);
                        alert('Event updated but image upload failed. You can edit the event to add an image later.');
                    }
                }

                alert('Event updated successfully!');
                navigate('/created-events');
            } else {
                alert(`Failed to update event: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Error updating event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            setShowDeleteModal(false);

            const response = await fetch(`http://localhost:3000/api/event/${event.eventid}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Event deleted successfully!');
                navigate('/created-events');
            } else {
                const data = await response.json();
                alert(`Failed to delete event: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

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
                        Edit Your Event
                    </h1>
                </div>

                {/* --- Main Content --- */}
                <div className="flex flex-col xl:flex-row gap-12 lg:gap-20">
                    <div className="shrink-0">
                        <div className="relative w-4/5 aspect-[1.18] sm:w-115 sm:h-97.5 rounded-3xl shadow-lg bg-linear-to-b from-[#AFEEDD] to-[#6CB2D7] flex items-center justify-center group cursor-pointer hover:shadow-xl transition-all mx-auto xl:mx-0 overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Event preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <CirclePlus className="text-[#10726F] w-20 h-20 sm:w-26.5 sm:h-26.5 drop-shadow-sm transition-transform group-hover:scale-110" strokeWidth={1.5} />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="opacity-0 absolute inset-0 cursor-pointer" 
                            />
                        </div>
                    </div>

                    <div className="grow flex flex-col gap-6 sm:gap-8 w-full">
                        <div className="w-full">
                            <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Title</label>
                            <input 
                                type="text" 
                                placeholder="Event Name" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" 
                            />
                        </div>

                        <div className="w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#6B7C85] mb-4 sm:mb-6">On-Site Event</h2>
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                <div className="order-1">
                                    <InputWithIcon label="Start Date" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} selectedDate={startDate} onDateChange={setStartDate} />
                                </div>
                                <div className="order-2">
                                    <InputWithIcon label="End Date" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} selectedDate={endDate} onDateChange={setEndDate} />
                                </div>
                                {/* NEW INFINITE CYCLING TIME PICKERS */}
                                <div className="order-3">
                                    <InfiniteTimePicker label="Start Time" timeValue={startTime} setTimeValue={setStartTime} />
                                </div>
                                <div className="order-4">
                                    <InfiniteTimePicker label="End Time" timeValue={endTime} setTimeValue={setEndTime} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 w-full xl:w-1/2">
                            <InputWithIcon label="Register Open" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} selectedDate={regisStart} onDateChange={setRegisStart} />
                            <InputWithIcon label="Register Close" icon={<CalendarDays className="w-5 h-5 text-[#1BB3A9]" />} selectedDate={regisEnd} onDateChange={setRegisEnd} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-12 flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-20">
                    <div className="w-full xl:w-136 shrink-0">
                        <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Brief Details</label>
                        <textarea 
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Describe your event..."
                            className="w-full h-31.25 sm:h-49 bg-white border-2 border-gray-200 rounded-2xl p-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"
                        />
                    </div>

                    <div className="grow flex flex-col justify-between gap-8">
                        <div className="flex flex-col gap-6">
                            <div className="w-full">
                                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Contact Information</label>
                                <input 
                                    type="text" 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="Email or phone number"
                                    className="w-full h-13 sm:h-15 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" 
                                />
                            </div>
                            <div className="w-full">
                                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">Location</label>
                                <input 
                                    type="text" 
                                    value={eventlocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                    placeholder="Training Builiding..."
                                    className="w-full h-13 sm:h-18 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-start sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-12">
                            <button 
                                onClick={() => navigate('/')}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-gray-100 text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-red-500 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-red-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-lg sm:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete Event?</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Are you sure you want to delete this event? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 h-12 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="flex-1 h-12 bg-red-500 text-white text-lg font-semibold rounded-xl hover:bg-red-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- COMPONENT: INFINITE CYCLING TIME PICKER ---
interface InfiniteTimePickerProps {
    label: string;
    timeValue: string;
    setTimeValue: (value: string) => void;
}

const InfiniteTimePicker = ({ label, timeValue, setTimeValue }: InfiniteTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
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
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
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
interface InputProps { 
    label: string; 
    icon: React.ReactNode; 
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
}

interface CustomInputProps {
    value?: string;
    onClick?: () => void;
    icon: React.ReactNode;
}

// Move CustomInput outside to prevent recreation on every render
const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick, icon }, ref) => (
    <div className="relative group/input" onClick={onClick}>
        <input ref={ref} value={value} readOnly placeholder="Select Date"
            className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl pl-4 pr-12 text-base sm:text-lg text-gray-800 font-medium placeholder-gray-400 cursor-pointer focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all duration-200"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/input:text-[#54B0A8] transition-colors">{icon}</div>
    </div>
));

const InputWithIcon = ({ label, icon, selectedDate, onDateChange }: InputProps) => {

    return (
        <div className="w-full">
            <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600 truncate transition-colors">{label}</label>
            <DatePicker 
                selected={selectedDate} 
                onChange={(date: Date | null) => onDateChange(date)}
                dateFormat="MMMM d, yyyy"
                customInput={<CustomInput icon={icon} />}
                calendarClassName="bg-white border-0 shadow-2xl rounded-2xl font-sans overflow-hidden"
                dayClassName={(date) => selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() ? "bg-[#54B0A8] text-white font-bold rounded-lg hover:bg-[#4a9b94]" : "text-gray-700 hover:bg-[#AFEEDD] hover:text-[#10726F] rounded-lg transition-colors"}
            />
        </div>
    );
};

export default EditEvent;