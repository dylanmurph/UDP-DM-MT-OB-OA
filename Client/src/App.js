// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./components/Landing";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Home from "./components/Home";

// function App() {
//   const [user, setUser] = useState(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     return { token };
//   });

//   return (
//     <Router>
//       <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
//         <Routes>
//           <Route path="/" element={!user ? <Landing /> : <Navigate to="/home" replace />} />

//           <Route
//             path="/register"
//             element={!user ? <Register setUser={setUser} /> : <Navigate to="/home" replace />}
//           />

//           <Route
//             path="/login"
//             element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" replace />}
//           />

//           <Route
//             path="/home"
//             element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/" replace />}
//           />

//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          
          {/* Optional: Catch-all route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
