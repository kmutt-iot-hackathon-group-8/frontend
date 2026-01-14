import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";

import RegisterPage from './pages/Register';
import Home from './pages/Home';
import CreatedEvents from './pages/CreatedEvents';
import EventDetail from './pages/EventDetail';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';

function App() {

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-50">
          <NavBar />
        </div>
        <div className="flex-1">
          <Routes>
            <Route 
              path="/"
              element={<Home />}
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
              path="/created-events"
              element={<CreatedEvents />}
            />
            <Route 
              path="/event/:id"
              element={<EventDetail />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
