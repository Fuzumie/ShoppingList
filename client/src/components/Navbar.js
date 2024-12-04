import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();  // Initialize the navigate hook

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");  // Redirect to the login page
  };

  return (
    <header className="navbar">
      <h1 className="navbar-title">ShopSmart</h1>

      <div className="navbar-items">
        <nav>
          <div className="navbar-links">
            <Link to="/lists">Lists</Link>
            <Link to="/archive">Archive</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
          </div>
        </nav>

        
      </div>
    </header>
  );
};

export default Navbar;
