import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";

import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import CreatedEvents from './pages/CreatedEvents';
import EventDetail from './pages/EventDetail';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import AddEvent from './pages/AddEvent';
import AttendedEvents from './pages/AttendedEvents';
import SetUpNFC from "./pages/setUpNFC";
import RegisterWithCard from "./pages/RegisCardU";
import EventAttendees from "./pages/EventAttendees";
import EventEdit from "./pages/EventEdit";

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/set-up-nfc', '/regis-card-u'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import CreatedEvents from "./pages/CreatedEvents";
import EventDetail from "./pages/EventDetail";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import AttendedEvents from "./pages/AttendedEvents";
import EventAttendees from "./pages/EventAttendees";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && (
        <div className="sticky top-0 z-50">
          <NavBar />
        </div>
      )}
      <div className="flex-1">
        <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
            <Route 
              path="/login"
              element={<LoginPage />}
            />
            <Route 
              path="/register"
              element={<RegisterPage />}
            />
            <Route 
              path="/register-with-card"
              element={<RegisterWithCard />}
            />
            <Route 
              path="/profile"
              element={<Profile />}
            />
            <Route 
              path="/set-up-nfc"
              element={<SetUpNFC />}
            />
              <Route
              path="/created-events"
              element={<CreatedEvents />}
            />
            <Route 
              path="/attended-events"
              element={<AttendedEvents />}
            />
            <Route 
              path="/event/:id"
              element={<EventDetail />}
            />
            <Route 
              path="/add-event/"
              element={<AddEvent />}
            />
            <Route path="/event/:id/attendees" element={<EventAttendees />} />
            <Route path = "/event/edit/:id" element={<EventEdit />} />
          </Routes>
        </div>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
