import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes , Navigate} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import TicTacToe from "./components/TicTacToe.js";

function App() {

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    axios.get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data.userId);
      })
      .catch(() => setUser(null)); 
  }, []);
 const handleLogout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    setUser(null);
  };
  return (
    <Router>
      <div className="App">
      {user && <button onClick={handleLogout} className="bg-black rounded-sm text-white ">Logout</button>}

        <Routes>
        <Route path="/login" element={user ? <Navigate to="/tictactoe" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/tictactoe" /> : <Register />} />
          <Route path="/tictactoe" element={user ? <TicTacToe /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
