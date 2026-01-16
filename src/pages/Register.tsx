import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../utils/api";

const Register = () => {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const cardId = q.get("cardId");
  const eventId = q.get("eventId");

  const { user, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const [regStatus, setRegStatus] = useState("idle");

  const handleRegisterCard = async () => {
    if (!user) return;
    setRegStatus("loading");

    try {
      const response = await API.auth.registerCard(
        cardId || "",
        user.uid,
        eventId ? parseInt(eventId) : undefined,
      );

      if (response.success) {
        setRegStatus("success");
      } else {
        setRegStatus("error");
        alert(response.message || "Failed to register card");
      }
    } catch (error) {
      setRegStatus("error");
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  // If user not logged in yet, show OAuth options
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In to Link Your Card
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your social account to get started
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
            <button
              onClick={loginWithGoogle}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#4A90E2"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="ml-2">Sign in with Google</span>
            </button>

            <button
              onClick={loginWithMicrosoft}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
                <path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z" />
                <path fill="#00A4EF" d="M11.4 11.4H0V0h11.4v11.4z" />
                <path fill="#FFB900" d="M24 11.4H12.6V0H24v11.4z" />
              </svg>
              <span className="ml-2">Sign in with Microsoft</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (regStatus === "loading") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-700">Linking card...</h1>
      </div>
    );
  }

  if (regStatus === "success") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-3xl font-bold text-green-600">
          Welcome, {user.fname}!
        </h1>
        <p className="mt-4 text-gray-600">
          Your card is now linked to your account.
        </p>
      </div>
    );
  }

  if (regStatus === "error") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-3xl font-bold text-red-500">Error</h1>
          <p className="mt-4 text-gray-600">
            Failed to link your card. Please try again.
          </p>
          <button
            onClick={() => setRegStatus("idle")}
            className="mt-6 text-indigo-600 font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Show card registration confirmation
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Link Your NFC Card
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {user.fname}, you're logged in. Ready to link your card?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            {cardId && (
              <div>
                <p className="text-sm font-medium text-gray-700">Card ID</p>
                <p className="mt-1 text-gray-900 font-mono">{cardId}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRegisterCard}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Link Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
