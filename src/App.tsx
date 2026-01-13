import './App.css'
import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";

import RegisterPage from './pages/Register';
import Home from './pages/Home';
function App() {

  return (
    <>
    <Router>
      <Routes>
           <Route 
          path="/"
          element ={<Home />}
          />

        <Route 
          path="/register"
          element ={<RegisterPage />}
          />
      </Routes>

      </Router>
    </>
  )
}

export default App
