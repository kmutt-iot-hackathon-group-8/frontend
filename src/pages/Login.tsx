import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from 'lucide-react'; // Added Loader2 for animation

const BASE_URL = "https://backend-h6j3.onrender.com";

const Login = () => {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  
  const cardId = q.get("cardId");
  const eventId = q.get("eventId");

  const [regStatus, setRegStatus] = useState("idle");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    cardId: cardId || "",
    eventId: eventId || "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegStatus("loading");

    try {
      console.log("Submitting:", formData);
      
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Registration failed");
      
      const data = await response.json();
      console.log("Success:", data);
      setRegStatus("success");
      
    } catch (error) {
      console.error("Error:", error);
      setRegStatus("error");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Redirecting to Google login...");
  };

  return (
    <div className='relative min-h-screen flex flex-col justify-center items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white' style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* --- WAVE BACKGROUND --- */}
      <div className="absolute bottom-0 left-0 w-full h-[160vh] z-0 block">
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
          <path fill="url(#wave-gradient)" fillOpacity="0.4" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="url(#wave-gradient)" fillOpacity="0.8" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[689px]">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h2 className='text-center font-bold text-[40px] sm:text-[50px] md:text-[60px] lg:text-[64px] leading-tight text-[#1F2D3D]' style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ModTap
          </h2>
        </div>

        {/* Card */}
        <div className='bg-white w-full py-6 px-6 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:px-16 rounded-[24px] sm:rounded-[32px] lg:rounded-[43px]' style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.25)' }}>
            <p className="text-center font-bold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight text-[#1F2D3D] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Welcome back!
            </p>
            <p className="text-center font-semibold text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] leading-tight text-[#1BB3A9] mb-6 sm:mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
             Login
          </p>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-6 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Email
              </label>
              <div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border-2 sm:border-4 border-black rounded-[12px] sm:rounded-[16px] bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-[14px] sm:text-[16px]'
                  style={{ minHeight: '48px', height: 'auto' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-6 placeholder-gray-400 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border-2 sm:border-4 border-black rounded-[12px] sm:rounded-2xl bg-[#F4F7F8] font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200 text-[14px] sm:text-[16px]'
                  style={{ minHeight: '48px', height: 'auto' }}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 px-2 text-[#26ba9d] select-none cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 flex items-center z-30"
                >
                  {showPassword ? <Eye size={20} className="sm:w-6 sm:h-6" /> : <EyeOff size={20} className="sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 sm:mt-6">
              <button
                type='submit'
                disabled={regStatus === 'loading'}
                className='w-full flex justify-center items-center font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-6 text-white rounded-[8px] sm:rounded-[10px] 
                transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none py-3 sm:py-0'
                style={{ 
                  minHeight: '48px',
                  height: 'auto',
                  background: 'linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                {regStatus === 'loading' ? (
                   <>
                     <Loader2 className="animate-spin mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> 
                     Signing in...
                   </>
                ) : 'Login'}
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className='mt-6 sm:mt-8'>
            <p className="text-center font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-6 text-[#9AA9AF] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Don't have an account? 
              <button onClick={() => window.location.href = '/register'}>
                <span className="font-bold text-[#1BB3A9] ml-1 cursor-pointer hover:underline transition-all duration-200 hover:text-[#179a91]">Signup</span>
              </button>
            </p>
            
            <div className='relative mt-6 sm:mt-8 mb-5 sm:mb-6'>
              <div className='flex items-center'>
                <div className='flex-grow border-t border-black' />
                <span className='px-3 sm:px-4 font-bold text-[18px] sm:text-[20px] md:text-[24px] leading-tight text-[#1F2D3D] opacity-50' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  or
                </span>
                <div className='flex-grow border-t border-black' />
              </div>
            </div>

            {/* Single Google Button */}
            <div className="pb-2">
              <button 
                onClick={handleGoogleLogin}
                className='w-full inline-flex justify-center items-center border border-black rounded-[12px] sm:rounded-[16px] bg-white py-3 sm:py-0
                transform transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98]'
                style={{ minHeight: '52px', height: 'auto' }}
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                />
                <p className="ml-3 sm:ml-4 font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-6 text-[#1F2D3D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Continue with Google</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;