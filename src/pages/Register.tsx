import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import WaveBackground from "../components/WaveBackground";
import { createAuthClient } from "better-auth/react";
import { useAuth } from "../context/AuthContext";
import { API } from "../utils/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authClient = createAuthClient({
  baseURL: BASE_URL,
  basePath: "/api/auth"
});

interface SignUpEmailOptions {
  email: string;
  password: string;
  name: string;
  image?: string;
  callbackURL?: string;
  fname?: string;
  lname?: string;
  [key: string]: unknown;
}

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const q = new URLSearchParams(location.search);

  // Query Params
  const firstName = q.get("firstName");
  const lastName = q.get("lastName");
  const cardId = q.get("cardId");
  const eventId = q.get("eventId");
  const isMobile = q.get("mobile") === "true";

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

      if (name === "password" || name === "confirmPassword") {
        const passwordValue = name === "password" ? value : newFormData.password;
        const confirmPasswordValue = name === "confirmPassword" ? value : newFormData.confirmPassword;

        if (confirmPasswordValue) {
          setPasswordsMatch(passwordValue === confirmPasswordValue);
        } else {
          setPasswordsMatch(true);
        }
      }
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setRegStatus("loading");

    try {
      const response = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        fname: formData.firstName,
        lname: formData.lastName,
      } as SignUpEmailOptions);

      if (response.data && "user" in response.data) {
        const user = (response.data as any).user;
        const nameparts = (user.name || "").split(" ");
        setUser({
          id: user.id,
          fname: nameparts[0] || "",
          lname: nameparts[1] || "",
          email: user.email,
        });

        // Register NFC card if cardId is provided (from feat/api)
        if (cardId && user.id) {
          try {
            await API.auth.registerCard(cardId, user.id, eventId ? parseInt(eventId) : undefined);
            alert("Account created and NFC card registered successfully!");
          } catch (cardError) {
            console.error("Card registration failed:", cardError);
            alert("Account created but NFC card registration failed. You can register your card later in your profile.");
          }
        }
      }

      setRegStatus("success");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setRegStatus("error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + "/"}, );
      processSocialLogin(response);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const response = await authClient.signIn.social({ provider: "microsoft", callbackURL: window.location.origin + "/"}, );
      processSocialLogin(response);
    } catch (error) {
      console.error("Microsoft login error:", error);
    }
  };

  // Helper to handle user state after social login
  const processSocialLogin = (response: any) => {
    if (response.data && "user" in response.data) {
      const user = response.data.user;
      const nameparts = (user.name || "").split(" ");
      setUser({
        id: user.id,
        fname: nameparts[0] || "",
        lname: nameparts[1] || "",
        email: user.email,
      });
      navigate("/");
    }
  };

  const inputClasses =
    "appearance-none block w-full h-12 md:h-14 px-4 border-2 md:border-[3px] border-black rounded-xl md:rounded-2xl bg-[#F4F7F8] placeholder-gray-400 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1BB3A9] focus:border-transparent transition-all duration-200 text-base md:text-lg";

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-white font-sans">
      <WaveBackground />

      <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-2xl flex flex-col items-center">
        <div className="mb-6 md:mb-10 text-center">
          <h2 className="font-bold text-4xl md:text-5xl lg:text-7xl leading-tight text-[#1F2D3D] tracking-tight">
            ModTap
          </h2>
        </div>

        <div
          className="bg-white w-full rounded-3xl md:rounded-[40px] shadow-2xl p-6 sm:p-8 md:p-12"
          style={{ boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.15)" }}
        >
          <div className="text-center mb-6 md:mb-8">
            <p className="font-bold text-2xl md:text-3xl lg:text-4xl text-[#1F2D3D] mb-1">
              {cardId || isMobile ? "Register Your NFC Card" : "Welcome!"}
            </p>
            <p className="font-semibold text-xl md:text-2xl text-[#1BB3A9]">
              {cardId 
                ? "Create account to link your card" 
                : isMobile 
                ? "Scan your NFC card at the device to register" 
                : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-bold text-sm md:text-lg text-black mb-2 ml-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-bold text-sm md:text-lg text-black mb-2 ml-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-bold text-sm md:text-lg text-black mb-2 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-bold text-sm md:text-lg text-black mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClasses} pr-12`}
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

            <div>
              <label htmlFor="confirmPassword" className="block font-bold text-sm md:text-lg text-black mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full h-12 md:h-14 px-4 border-2 md:border-[3px] rounded-xl md:rounded-2xl bg-[#F4F7F8] font-semibold focus:outline-none focus:ring-2 transition-all duration-200 text-base md:text-lg pr-12 ${
                    !passwordsMatch && formData.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-black focus:ring-[#1BB3A9] focus:border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-4 text-[#26ba9d] hover:text-[#1a8f7a] transition-colors flex items-center justify-center rounded-r-xl"
                >
                  {showPassword ? <Eye className="w-5 h-5 md:w-6 md:h-6" /> : <EyeOff className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <p className="mt-2 text-sm md:text-base font-semibold text-red-500 ml-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={regStatus === "loading" || !passwordsMatch}
                className="w-full h-12 md:h-14 flex justify-center items-center font-bold text-lg md:text-xl text-white rounded-lg md:rounded-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{ background: "linear-gradient(90deg, #20D4A4 0%, #1F7CAE 100%)" }}
              >
                {regStatus === "loading" ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 md:mt-8">
            <p className="text-center font-medium text-sm md:text-base text-[#9AA9AF] mb-4">
              Already have an account?
              <button onClick={() => navigate("/login")} className="ml-1">
                <span className="font-bold text-[#1BB3A9] hover:underline">Login</span>
              </button>
            </p>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink-0 mx-4 text-gray-400 font-medium">or</span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full h-12 md:h-14 inline-flex justify-center items-center border-2 border-gray-200 rounded-xl bg-white transform transition-all duration-200 hover:bg-gray-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 md:h-6 md:w-6" />
                <span className="ml-3 font-bold text-base md:text-lg text-[#1F2D3D]">Sign up with Google</span>
              </button>

              <button
                onClick={handleMicrosoftLogin}
                className="w-full h-12 md:h-14 inline-flex justify-center items-center border-2 border-gray-200 rounded-xl bg-white transform transition-all duration-200 hover:bg-gray-50"
              >
                <svg className="h-5 w-5 md:h-6 md:w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                <span className="ml-3 font-bold text-base md:text-lg text-[#1F2D3D]">Sign up with Microsoft</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;