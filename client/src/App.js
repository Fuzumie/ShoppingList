import "./App.css";
import Navbar from "./components/Navbar";
import Details from "./pages/Details";
import Lists from "./pages/Lists";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/lists" /> : <Login />}
        />
        <Route path="/register" exact element={<Registration />} />
        <Route
          path="/lists"
          element={isAuthenticated() ? <Lists /> : <Navigate to="/" />}
        />
        <Route
          path="/details/:id"
          element={isAuthenticated() ? <Details /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
