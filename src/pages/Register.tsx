import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://backend-h6j3.onrender.com";
// const BASE_URL = "http://localhost:3000";

const Register = () => {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const cardId = q.get("cardId");
  const eventId = q.get("eventId");

  const [regStatus, setRegStatus] = useState("idle");

  const [formData, setFormData] = useState({
    cardId: cardId || "",
    eventId: eventId || "",
    firstName: "",
    lastName: "",

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
      const response = await fetch(`${BASE_URL}/api/v1/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(response);
      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        setRegStatus("success");
      } else if (response.status === 409) {
        setRegStatus("already_registered");
        alert(data.message); // "User already registered..."
      } else {
        setRegStatus("error");
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      setRegStatus(`error: ${error}`);
    }
  };

  if (regStatus === "loading") {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50'>
        <h1 className='text-2xl font-bold text-gray-700'>Registering...</h1>
      </div>
    );
  }

  if (regStatus === "success") {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50'>
        <h1 className='text-3xl font-bold text-green-600'>
          Welcome, {formData.firstName}!
        </h1>
        <p className='mt-4 text-gray-600'>
          Your card is now linked to your account.
        </p>
      </div>
    );
  }

  if (regStatus === "already_registered") {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-4'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md'>
          <h1 className='text-3xl font-bold text-orange-500'>
            Already Registered
          </h1>
          <p className='mt-4 text-gray-600'>
            This card is already assigned to a user. If you think this is a
            mistake, please contact support.
          </p>
          <button
            onClick={() => setRegStatus("idle")}
            className='mt-6 text-indigo-600 font-medium hover:underline'
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Header / Logo Area */}
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Already have an account?{" "}
          <a
            href='#'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            Sign in
          </a>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Name Fields Row */}
            <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700'
                >
                  First Name
                </label>
                <div className='mt-1'>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    autoComplete='given-name'
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last Name
                </label>
                <div className='mt-1'>
                  <input
                    id='lastName'
                    name='lastName'
                    type='text'
                    autoComplete='family-name'
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Optional Divider for Social Login */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                <span>Google</span>
              </button>
              <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
