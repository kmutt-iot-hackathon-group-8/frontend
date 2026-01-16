import React, { useState } from "react";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AddEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    eventStartDate: new Date(),
    eventEndDate: new Date(),
    eventStartTime: "00:00",
    eventEndTime: "23:59",
    regisStart: new Date(),
    regisEnd: new Date(),
    eventDetail: "",
    contact: "",
    regisURL: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first");
      return;
    }

    setIsLoading(true);
    try {
      await API.events.create({
        eventOwner: user.uid,
        eventDetail: formData.title,
        eventIMG: null,
        eventStartDate: formData.eventStartDate.toISOString().split("T")[0],
        eventEndDate: formData.eventEndDate.toISOString().split("T")[0],
        eventStartTime: formData.eventStartTime,
        eventEndTime: formData.eventEndTime,
        regisStart: formData.regisStart.toISOString().split("T")[0],
        regisEnd: formData.regisEnd.toISOString().split("T")[0],
        contact: formData.contact,
        regisURL: formData.regisURL,
      });
      alert("Event created successfully!");
      navigate("/created-events");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to create an event</p>
      </div>
    );
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
        <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors p-2"
          >
            <ArrowLeft size={36} className="text-gray-800" />
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            Add Your Event
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col xl:flex-row gap-12 lg:gap-20"
        >
          <div className="shrink-0">
            <div className="relative w-4/5 aspect-[1.18] sm:w-115 sm:h-97.5 rounded-3xl shadow-lg bg-linear-to-b from-[#AFEEDD] to-[#6CB2D7] flex items-center justify-center group cursor-pointer hover:shadow-xl transition-all mx-auto xl:mx-0">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CirclePlus
                  className="text-[#10726F] w-20 h-20 sm:w-26.5 sm:h-26.5 drop-shadow-sm transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <input
                type="file"
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="grow flex flex-col gap-6 sm:gap-8 w-full">
            <div className="w-full">
              <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Event Name"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"
              />
            </div>

            <div className="w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-[#6B7C85] mb-4 sm:mb-6">
                On-Site Event
              </h2>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <div className="order-1">
                  <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.eventStartDate}
                    onChange={(date: Date | null) =>
                      setFormData({
                        ...formData,
                        eventStartDate: date || new Date(),
                      })
                    }
                    dateFormat="MMMM d, yyyy"
                    className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                  />
                </div>
                <div className="order-2">
                  <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.eventEndDate}
                    onChange={(date: Date | null) =>
                      setFormData({
                        ...formData,
                        eventEndDate: date || new Date(),
                      })
                    }
                    dateFormat="MMMM d, yyyy"
                    className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                  />
                </div>
                <div className="order-3">
                  <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.eventStartTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventStartTime: e.target.value,
                      })
                    }
                    className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                  />
                </div>
                <div className="order-4">
                  <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.eventEndTime}
                    onChange={(e) =>
                      setFormData({ ...formData, eventEndTime: e.target.value })
                    }
                    className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 w-full xl:w-1/2">
              <div>
                <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                  Register Open
                </label>
                <DatePicker
                  selected={formData.regisStart}
                  onChange={(date: Date | null) =>
                    setFormData({ ...formData, regisStart: date || new Date() })
                  }
                  dateFormat="MMMM d, yyyy"
                  className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-semibold mb-1.5 text-gray-600">
                  Register Close
                </label>
                <DatePicker
                  selected={formData.regisEnd}
                  onChange={(date: Date | null) =>
                    setFormData({ ...formData, regisEnd: date || new Date() })
                  }
                  dateFormat="MMMM d, yyyy"
                  className="w-full h-13 sm:h-16 bg-white border-2 border-gray-200 rounded-2xl px-4 text-base sm:text-lg text-gray-800"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 sm:mt-12 flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-20">
          <div className="w-full xl:w-136 shrink-0">
            <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">
              Brief Details
            </label>
            <textarea
              value={formData.eventDetail}
              onChange={(e) =>
                setFormData({ ...formData, eventDetail: e.target.value })
              }
              className="w-full h-31.25 sm:h-49 bg-white border-2 border-gray-200 rounded-2xl p-5 text-base sm:text-lg text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"
            ></textarea>
          </div>

          <div className="grow flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full h-13 sm:h-15 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"
                />
              </div>
              <div className="w-full">
                <label className="block text-base sm:text-lg font-semibold mb-2 text-gray-700">
                  Register Link
                </label>
                <input
                  type="text"
                  value={formData.regisURL}
                  onChange={(e) =>
                    setFormData({ ...formData, regisURL: e.target.value })
                  }
                  className="w-full h-13 sm:h-18 bg-white border-2 border-gray-200 rounded-2xl px-5 text-base sm:text-lg text-gray-800 focus:outline-none focus:border-[#54B0A8] focus:ring-4 focus:ring-[#54B0A8]/10 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-start sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-12">
              <button
                type="button"
                onClick={() => navigate("/created-events")}
                className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-gray-100 text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 sm:flex-none sm:w-46.75 h-13 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-lg sm:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
