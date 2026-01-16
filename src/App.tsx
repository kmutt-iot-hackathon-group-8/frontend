import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import CreatedEvents from "./pages/CreatedEvents";
import EventDetail from "./pages/EventDetail";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import AttendedEvents from "./pages/AttendedEvents";
import EventAttendees from "./pages/EventAttendees";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <div className="sticky top-0 z-50">
            <NavBar />
          </div>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/created-events" element={<CreatedEvents />} />
              <Route path="/attended-events" element={<AttendedEvents />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/add-event/" element={<AddEvent />} />
              <Route path="/event/:id/attendees" element={<EventAttendees />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
