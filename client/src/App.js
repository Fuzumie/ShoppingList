import './App.css';
import Navbar from "./components/Navbar";
import Details from './pages/Details';
import Lists from './pages/Lists';
import Login from './pages/Login'; // Import the Login page
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Check if the token exists in localStorage
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route 
          path='/' 
          element={
            isAuthenticated() ? <Navigate to="/lists" /> : <Login />
          } 
        />
        <Route 
          path='/lists' 
          element={
            isAuthenticated() ? <Lists /> : <Navigate to="/" />
          } 
        />
        <Route 
          path='/details/:id' 
          element={
            isAuthenticated() ? <Details /> : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
