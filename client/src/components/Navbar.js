import { Link } from "react-router-dom";  
import { useLogout } from '../hooks/useLogout';
import "./Navbar.css";

const Navbar = () => {
  // Use the logout function from the useLogout hook
  const { logout } = useLogout();

  return (
    <header className="navbar">
      <h1 className="navbar-title">ShopSmart</h1>

      <div className="navbar-items">
        <nav>
          <div className="navbar-links">
            <Link to="/lists">Lists</Link>
            <Link to="/archive">Archive</Link>
            <button className="logout-button" onClick={logout}>Logout</button> {/* Logout button */}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
