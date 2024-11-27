import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
     
          <h1 className="navbar-title">ShopSmart</h1>
        
      <div className="navbar-items">
      
        <nav>
          <div className="navbar-links">
            <Link to="/">Lists</Link>
            <Link to="/archive">Archive</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
