import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NFC from "../assets/icons/NFCIcon.png";
import NfcPopup from "../components/NfcPopup";
import { useAuth } from "../context/AuthContext";
import { API } from "../utils/api";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [showNfcPopup, setShowNfcPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const profile = await API.users.getProfile(user.uid);
        setFormData({
          firstName: profile.fname,
          lastName: profile.lname,
          email: profile.email,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!user) return;

    try {
      await API.users.updateProfile(user.uid, {
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const inputStyle =
    "w-full md:w-72 px-4 py-2 border-2 border-black rounded-2xl bg-[#f0f2f5] focus:outline-none text-zinc-500 font-semibold tracking-tight relative z-20";
  const labelStyle =
    "text-lg font-bold pr-0 md:pr-10 w-full md:w-32 text-left text-black/80 mb-1 md:mb-0";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center pt-10 md:pt-20 font-montserrat pb-40">
      <div className="absolute -top-1  md:top-19 left-[5%] min-[1519px]:left-[35%]   z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={43} className="text-black" />
        </button>
      </div>

      <div className="relative top-10 z-20 flex flex-col items-center w-full px-6">
        <h1 className="text-3xl font-black mb-8 md:mb-12 tracking-tight text-black text-center">
          Account Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 w-full max-w-md md:max-w-none flex flex-col items-center"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
            <label htmlFor="firstName" className={labelStyle}>
              Firstname
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
            <label htmlFor="lastName" className={labelStyle}>
              Lastname
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div className="flex justify-center md:justify-end w-full md:w-105 pt-2 gap-4">
            <button
              type="submit"
              className="px-10 py-2.5 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-xl font-bold rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-10 py-2.5 bg-red-500 text-white text-xl font-bold rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </form>

        <div className="mt-15 w-full max-w-2xl border-t mb-12 border-black/10 md:bg-[#9AA9AF]" />

        <button
          onClick={() => setShowNfcPopup(true)}
          className="group relative w-full max-w-112.5 aspect-2/1 md:h-50 flex flex-col items-center justify-center gap-4
            rounded-[40px] border-2 border-dashed border-zinc-600 overflow-hidden 
            transition-transform hover:brightness-105 active:scale-[0.98] bg-linear-to-br from-[#7dffdc] to-[#69cafe] cursor-pointer shadow-lg"
        >
          <div className="text-black">
            <img src={NFC} alt="NFC Icon" className="w-20 md:w-25 h-auto" />
          </div>
          <span className="text-xl md:text-2xl font-bold text-black tracking-tight">
            Add NFC Card
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[160vh] z-0 block md:hidden">
        <svg
          className="w-full h-full"
          viewBox="-130 0 1340 320"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7dffdc" />
              <stop offset="50%" stopColor="#20D4A4" />
              <stop offset="100%" stopColor="#1F7CAE" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-gradient)"
            fillOpacity="0.4"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="url(#wave-gradient)"
            fillOpacity="0.8"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {showNfcPopup && <NfcPopup onClose={() => setShowNfcPopup(false)} />}
    </div>
  );
};

export default Profile;
