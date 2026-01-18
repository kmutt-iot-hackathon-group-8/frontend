import { useState, useEffect } from "react";
import { EyeOff, Eye, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import NFC from "../assets/icons/NFCIcon.png";
import NfcPopup from "../components/NfcPopup";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [, setLoading] = useState(true);
  const [cardId, setCardId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.uid) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/users/${user.uid}`);
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            firstName: userData.fname,
            lastName: userData.lname,
            email: userData.email,
            password: "", // Don't fetch password for security
          });
          setCardId(userData.cardid || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showNfcPopup, setShowNfcPopup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mobileLink") === "true") {
      setShowNfcPopup(true);
    }
  }, [location]);

  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.uid) {
      alert("Please login first");
      return;
    }

    try {
      const updateData: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
      } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Settings Updated!");
        // Update localStorage with new data
        const updatedUser = {
          ...user,
          fname: formData.firstName,
          lname: formData.lastName,
          email: formData.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed");
    }
  };

  const inputStyle =
    "w-full md:w-72 px-4 py-2 border-2 border-black rounded-2xl bg-[#f0f2f5] focus:outline-none text-zinc-500 font-semibold tracking-tight relative z-20";
  const labelStyle =
    "text-lg font-bold pr-0 md:pr-10 w-full md:w-32 text-left text-black/80 mb-1 md:mb-0";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center pt-10 md:pt-20 font-montserrat pb-40">
      {/* Back Button */}
      <div className="absolute -top-1  md:top-19 left-[5%] min-[1519px]:left-[35%]   z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={43} className="text-black" />
        </button>
      </div>

      {/* Content Layer */}
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

          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <div className="relative w-full md:w-auto">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#26ba9d] select-none cursor-pointer hover:scale-105 flex items-center z-30"
              >
                {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
          </div>

          {/* Original Green/Blue Gradient Button */}
          <div className="flex justify-center md:justify-end w-full md:w-105 pt-2">
            <button
              type="submit"
              className="px-10 py-2.5 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] text-white text-xl font-bold rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.1)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </form>

        <div className="mt-15 w-full max-w-2xl border-t mb-12 border-black/10 md:bg-[#9AA9AF]" />

        {/* Original Cyan/Blue Gradient NFC Card */}
        <button
          onClick={() => setShowNfcPopup(true)}
          className={`group relative w-full max-w-112.5 aspect-2/1 md:h-50 flex flex-col items-center justify-center gap-4
            rounded-[40px] border-2 border-dashed overflow-hidden 
            transition-transform hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-lg ${
              cardId 
                ? 'border-zinc-600 bg-linear-to-br from-[#7dffdc] to-[#69cafe]' 
                : 'border-gray-400 bg-gray-200'
            }`}
        >
          <div className="text-black">
            <img src={NFC} alt="NFC Icon" className="w-20 md:w-25 h-auto" />
          </div>
          <span className="text-xl md:text-2xl font-bold text-black tracking-tight">
            {cardId ? `Card ID: ${cardId}` : "Add NFC Card"}
          </span>
        </button>
      </div>

      {/* --- MOBILE BACKGROUND (Original Colors, 50% Height, No Distortion) --- */}
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
