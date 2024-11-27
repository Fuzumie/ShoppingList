import './App.css';
import Navbar from "./components/Navbar";
import Details from './pages/Details';
import Lists from './pages/Lists';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/details/:id' exact element={<Details />} />
        <Route path='/' exact element={<Lists/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;