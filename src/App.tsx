import './App.css'
import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";

import RegisterPage from './pages/Register';
import Home from './pages/Home';
import CreatedEvents from './pages/CreatedEvents';
import NavBar from './components/NavBar';

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
              path="/created-events"
              element={<CreatedEvents />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
