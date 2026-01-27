import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentEvaluation from "./pages/student/StudentEvaluation.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/evaluate" element={<StudentEvaluation />} />
      </Routes>
    </BrowserRouter>
  );
}
