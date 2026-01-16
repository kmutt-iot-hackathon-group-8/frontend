import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";

// Context and Components
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NavBar from './components/NavBar';

// Pages
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import CreatedEvents from './pages/CreatedEvents';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import AddEvent from './pages/AddEvent';
import AttendedEvents from './pages/AttendedEvents';
import SetUpNFC from "./pages/setUpNFC";
import RegisterWithCard from "./pages/RegisCardU";
import EventAttendees from "./pages/EventAttendees";
import EventEdit from "./pages/EventEdit";

function AppContent() {
  const location = useLocation();
  
  // Logic from 'main' to hide navbar on specific pages
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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-with-card" element={<RegisterWithCard />} />
          <Route path="/set-up-nfc" element={<SetUpNFC />} />

          {/* Protected Routes from 'feat/api' */}
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/created-events" 
            element={<ProtectedRoute><CreatedEvents /></ProtectedRoute>} 
          />
          <Route 
            path="/attended-events" 
            element={<ProtectedRoute><AttendedEvents /></ProtectedRoute>} 
          />
          <Route 
            path="/event/:id" 
            element={<ProtectedRoute><EventDetail /></ProtectedRoute>} 
          />
          <Route 
            path="/add-event/" 
            element={<ProtectedRoute><AddEvent /></ProtectedRoute>} 
          />
          <Route 
            path="/event/:id/attendees" 
            element={<ProtectedRoute><EventAttendees /></ProtectedRoute>} 
          />
          <Route 
            path="/event/edit/:id" 
            element={<ProtectedRoute><EventEdit /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;