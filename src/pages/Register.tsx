import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from 'lucide-react'; // Added Loader2 for animation

const BASE_URL = "https://backend-h6j3.onrender.com";

const Register = () => {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  
  const firstName = q.get("firstName");
  const lastName = q.get("lastName");

  const [regStatus, setRegStatus] = useState("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newFormData = {
        ...prevState,
        [name]: value,
      };
      
      // Check if passwords match when either password field changes
      if (name === 'password' || name === 'confirmPassword') {
        const passwordValue = name === 'password' ? value : newFormData.password;
        const confirmPasswordValue = name === 'confirmPassword' ? value : newFormData.confirmPassword;
        
        // Only validate if confirmPassword has been entered
        if (confirmPasswordValue) {
          setPasswordsMatch(passwordValue === confirmPasswordValue);
        } else {
          setPasswordsMatch(true); // Reset to true if confirm password is empty
        }
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match before submitting
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
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
    <div className='relative min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-white' style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
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
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className='text-center font-bold text-[64px] leading-[78px] text-[#1F2D3D]' style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ModTap
          </h2>
        </div>

        {/* Card */}
        <div className='bg-white py-10 px-16 rounded-[43px]' style={{ width: '689px', minHeight: '666px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.25)' }}>
            <p className="text-center font-bold text-[40px] leading-[49px] text-[#1F2D3D] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Welcome!
            </p>
            <p className="text-center font-semibold text-[32px] leading-[39px] text-[#1BB3A9] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
             Sign Up
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First name Field */}
            <div>
              <label htmlFor='firstName' className='block font-bold text-[20px] leading-6 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                First Name
              </label>
              <div>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='given-name'
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-4 border-4 border-black rounded-[16px] bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200'
                  style={{ height: '58px' }}
                />
              </div>
            </div>

            {/* Last name Field */}
            <div>
              <label htmlFor='lastName' className='block font-bold text-[20px] leading-6 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Last Name
              </label>
              <div>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='family-name'
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-4 border-4 border-black rounded-[16px] bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200'
                  style={{ height: '58px' }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block font-bold text-[20px] leading-6 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                  className='appearance-none block w-full px-4 py-4 border-4 border-black rounded-[16px] bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200'
                  style={{ height: '58px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block font-bold text-[20px] leading-6 placeholder-gray-400 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                  className='appearance-none block w-full px-4 py-4 border-4 border-black rounded-2xl bg-[#F4F7F8] font-semibold focus:outline-none focus:ring-0 focus:border-black transition-colors duration-200'
                  style={{ height: '58px' }}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-2 text-[#26ba9d] select-none cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 flex items-center z-30"
                >
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor='confirmPassword' className='block font-bold text-[20px] leading-6 placeholder-gray-400 text-black mb-2' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-4 border-4 rounded-2xl bg-[#F4F7F8] font-semibold focus:outline-none focus:ring-0 transition-colors duration-200 ${
                    !passwordsMatch && formData.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-black focus:border-black'
                  }`}
                  style={{ height: '58px' }}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-2 text-[#26ba9d] select-none cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 flex items-center z-30"
                >
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <p className="mt-2 text-sm font-semibold text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type='submit'
                disabled={regStatus === 'loading' || !passwordsMatch}
                className='w-full flex justify-center items-center font-bold text-[20px] leading-6 text-white rounded-[10px] 
                transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none'
                style={{ 
                  height: '52px',
                  background: 'linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                {regStatus === 'loading' ? (
                   <>
                     <Loader2 className="animate-spin mr-3 h-5 w-5" /> 
                     Signing up...
                   </>
                ) : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className='mt-8'>
            <p className="text-center font-medium text-[20px] leading-6 text-[#9AA9AF] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Already have an account? 
              <button onClick={() => window.location.href = '/login'}>
                <span className="font-bold text-[#1BB3A9] ml-1 cursor-pointer hover:underline transition-all duration-200 hover:text-[#179a91]">Login</span>
              </button>
            </p>
            
            <div className='relative mt-8 mb-6'>
              <div className='flex items-center'>
                <div className='flex-grow border-t border-black' />
                <span className='px-4 font-bold text-[24px] leading-[29px] text-[#1F2D3D] opacity-50' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  or
                </span>
                <div className='flex-grow border-t border-black' />
              </div>
            </div>

            {/* Single Google Button */}
            <div className="pb-2">
              <button 
                onClick={handleGoogleLogin}
                className='w-full inline-flex justify-center items-center border border-black rounded-[16px] bg-white 
                transform transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98]'
                style={{ height: '63px' }}
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="h-8 w-8"
                />
                <p className="ml-4 font-bold text-[20px] leading-6 text-[#1F2D3D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sign up with Google</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;