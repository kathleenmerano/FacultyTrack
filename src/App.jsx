import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentEvaluation from "./pages/student/StudentEvaluation.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyEvalResult from "./pages/faculty/FacultyEvalResult.jsx";
import FacultyProfile from "./pages/faculty/FacultyProfile.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminFaculty from "./pages/admin/AdminFaculty.jsx";
import AdminStudent from "./pages/admin/AdminStudent.jsx";
import AdminDepartment from "./pages/admin/AdminDepartment.jsx";
import AdminSubject from "./pages/admin/AdminSubject.jsx";
import AdminAcademicYear from "./pages/admin/AdminAcademicYear.jsx";
import AdminQuestionnaire from "./pages/admin/AdminQuestionnaire.jsx";
import AdminCriteria from "./pages/admin/AdminCriteria.jsx";
import AdminReport from "./pages/admin/AdminReport.jsx";
import AdminClassAssignment from "./pages/admin/AdminClassAssignment.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/evaluate" element={<StudentEvaluation />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/evaluations" element={<FacultyEvalResult />} />
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />
        <Route path="/admin/student" element={<AdminStudent />} />
        <Route path="/admin/department" element={<AdminDepartment />} />
        <Route path="/admin/subject" element={<AdminSubject />} />
        <Route path="/admin/class-assignment" element={<AdminClassAssignment />} />
        <Route path="/admin/academic-year" element={<AdminAcademicYear />} />
        <Route path="/admin/questionnaire" element={<AdminQuestionnaire />} />
        <Route path="/admin/criteria" element={<AdminCriteria />} />
        <Route path="/admin/report" element={<AdminReport />} />
      </Routes>
    </BrowserRouter>
  );
}
