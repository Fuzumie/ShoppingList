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
import { useAuthContext } from './hooks/useAuthContext';


function App() {
  const { user } = useAuthContext();

  // Optionally, you can include a loading spinner if user restoration takes time.
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/lists" /> : <Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/lists" element={user ? <Lists /> : <Navigate to="/" />} />
        <Route path="/details/:id" element={user ? <Details /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
