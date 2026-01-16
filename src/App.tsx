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

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/set-up-nfc'];
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
