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
import RegisteredEvents from './pages/RegisteredEvents';
import SetUpNFC from "./pages/setUpNFC";
import RegisterWithCard from "./pages/RegisCardU";
import EventAttendees from "./pages/EventAttendees";
import EventEdit from "./pages/EventEdit";

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/set-up-nfc', '/register-with-card'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

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
            path="/registered-events"
            element={<RegisteredEvents />}
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
          <Route path="/event/edit/:id" element={<EventEdit />} />
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