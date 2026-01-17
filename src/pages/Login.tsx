import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from 'lucide-react';
import WaveBackground from '../components/WaveBackground';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const Login = () => {
  const navigate = useNavigate();
  const [regStatus, setRegStatus] = useState("idle");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegStatus("loading");
    try {
      const response = await fetch(BASE_URL + '/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      console.log("Success:", data);
      localStorage.setItem('user', JSON.stringify(data.user));
      setRegStatus("success");
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      setRegStatus("error");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Redirecting to Google login...");
  };

  return (
    <div className='relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-white font-montserrat'>
      
      {/* --- WAVE BACKGROUND --- */}
      <WaveBackground />

      {/* --- CONTENT AREA --- */}

      <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-2xl flex flex-col items-center">
        
        {/* Header */}
        <div className="mb-6 md:mb-10 text-center">
          <h2 className="font-bold text-4xl md:text-5xl lg:text-7xl leading-tight text-[#1F2D3D] tracking-tight">
            ModTap
          </h2>
        </div>

        {/* Card */}
        <div 
          className='bg-white w-full rounded-3xl md:rounded-[40px] shadow-2xl p-6 sm:p-8 md:p-12'
          style={{ boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.15)' }}
        >
            <div className="text-center mb-6 md:mb-8">
                <p className="font-bold text-2xl md:text-3xl lg:text-4xl text-[#1F2D3D] mb-1">
                  Welcome back!
                </p>
                <p className="font-semibold text-xl md:text-2xl text-[#1BB3A9]">
                  Login to your account
                </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7">
            
            {/* Email Field */}
            <div> 
              <label htmlFor='email' className='block font-bold text-sm md:text-lg text-black mb-2 ml-1'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleChange}
                // Updated Inputs: Removed fixed padding, used h-12/h-14 for touch targets. Reduced border to 2px on mobile.
                className='appearance-none block w-full h-12 md:h-14 px-4 border-2 md:border-[3px] border-black rounded-xl md:rounded-2xl bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1BB3A9] focus:border-transparent transition-all duration-200 text-base md:text-lg'
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block font-bold text-sm md:text-lg text-black mb-2 ml-1'>
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
                  className='appearance-none block w-full h-12 md:h-14 px-4 border-2 md:border-[3px] border-black rounded-xl md:rounded-2xl bg-[#F4F7F8] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1BB3A9] focus:border-transparent transition-all duration-200 text-base md:text-lg pr-12'
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-0 top-0 h-full px-4 text-[#26ba9d] hover:text-[#1a8f7a] transition-colors flex items-center justify-center rounded-r-xl"
                >
                  {showPassword ? <Eye className="w-5 h-5 md:w-6 md:h-6" /> : <EyeOff className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type='submit'
                disabled={regStatus === 'loading'}
                className='w-full h-12 md:h-14 flex justify-center items-center font-bold text-lg md:text-xl text-white rounded-lg md:rounded-xl 
                transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
                style={{ 
                  background: 'linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)',
                }}
              >
                {regStatus === 'loading' ? (
                   <>
                     <Loader2 className="animate-spin mr-2 h-5 w-5" /> 
                     Signing in...
                   </>
                ) : 'Login'}
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className='mt-6 md:mt-8'>
            <p className="text-center font-medium text-sm md:text-base text-[#9AA9AF] mb-4">
              Don't have an account? 
              <button onClick={() => navigate('/register')} className="ml-1">
                <span className="font-bold text-[#1BB3A9] hover:underline hover:text-[#179a91]">Signup</span>
              </button>
            </p>
            
            <div className='relative flex py-2 items-center'>
              <div className='grow border-t border-gray-300'></div>
              <span className='shrink-0 mx-4 text-gray-400 font-medium'>or</span>
              <div className='grow border-t border-gray-300'></div>
            </div>

            {/* Google Button */}
            <div className="mt-4">
              <button 
                onClick={handleGoogleLogin}
                className='w-full h-12 md:h-14 inline-flex justify-center items-center border-2 border-gray-200 rounded-xl bg-white
                transform transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100'
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="h-5 w-5 md:h-6 md:w-6"
                />
                <span className="ml-3 font-bold text-base md:text-lg text-[#1F2D3D]">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;