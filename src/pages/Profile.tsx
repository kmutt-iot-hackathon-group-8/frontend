import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import NFC from '../assets/icons/NFCIcon.png';
const Profile = () => {
  // 1. Initialize state with the values from your image
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Titor',
    email: 'john@gmail.com',
    password: 'password123'
  });

  const [showPassword, setShowPassword] = useState(false);

  // 2. Generic change handler for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Saved Data:', formData);
    alert('Settings Updated!');
  };

  // UI Styles to match the image exactly
  const inputStyle = "w-72 px-4 py-2 border-2 border-black rounded-2xl bg-[#f0f2f5] focus:outline-none text-zinc-500 font-semibold tracking-tight";
  const labelStyle = "text-lg font-bold pr-10 w-32 text-left";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 font-montserrat">
      <h1 className="text-3xl font-black mb-12 tracking-tight">Account Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Firstname */}
        <div className="flex items-center">
          <label htmlFor="firstName" className={labelStyle}>Firstname</label>
          <input 
            type="text" 
            name="firstName"
            id="firstName" 
            value={formData.firstName} 
            onChange={handleChange}
            className={inputStyle} 
          />
        </div>

        {/* Lastname */}
        <div className="flex items-center">
          <label htmlFor="lastName" className={labelStyle}>Lastname</label>
          <input 
            type="text" 
            name="lastName"
            id="lastName" 
            value={formData.lastName} 
            onChange={handleChange}
            className={inputStyle} 
          />
        </div>

        {/* Email */}
        <div className="flex items-center">
          <label htmlFor="email" className={labelStyle}>Email</label>
          <input 
            type="email" 
            name="email"
            id="email" 
            value={formData.email} 
            onChange={handleChange}
            className={inputStyle} 
          />
        </div>

        {/* Password */}
        <div className="flex items-center">
          <label htmlFor="password" className={labelStyle}>Password</label>
          <div className="relative">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#26ba9d] select-none cursor-pointer flex items-center"
            >
              {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="px-10 py-2.5 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] 
            text-white text-xl font-bold rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.1)] 
            hover:brightness-105 hover:scale-105 active:scale-95 transition-all"
          >
            Edit
          </button>
        </div>
      </form>
      {/*Break*/}
      <div className="mt-20 w-full max-w-2xl border-t  mb-12 bg-[#9AA9AF]" />
      {/* --- ADD NFC CARD SECTION --- */}
      <button 
        onClick={() => console.log("NFC Pairing Started")}
        className="group relative w-[450px] h-[200px] flex flex-col items-center justify-center gap-4 rounded-[40px] border-2 border-dashed border-zinc-600 overflow-hidden transition-transform active:scale-[0.98]"
      >
        {/* The Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#bbf7d0] via-[#99f6e4] to-[#7dd3fc] opacity-90 -z-10" />
        
        {/* The Icon */}
        <div className="text-black">
          <img src={NFC} alt="NFC Icon" className="w-24 h-24" />
        </div>

        {/* The Text */}
        <span className="text-2xl font-black text-black tracking-tight">
          Add NFC Card
        </span>
      </button>
    </div>
  );
}

export default Profile;