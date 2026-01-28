import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentEvaluation from "./pages/student/StudentEvaluation.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyEvalResult from "./pages/faculty/FacultyEvalResult.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/evaluate" element={<StudentEvaluation />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/evaluations" element={<FacultyEvalResult />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}