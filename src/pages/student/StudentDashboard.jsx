import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";
import { Users, FileText, Lock, Calendar, Check, Clock, AlertCircle } from "lucide-react";
import StudentLayout from "./StudentLayout";

export default function StudentDashboard() {
  const [stats, setStats] = useState({ total: 0, evaluated: 0, pending: 0 });
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!currentUser || !userProfile) return;
    Promise.all([
      fetch(`${API}/get-assignments`).then(r => r.json()),
      fetch(`${API}/get-submissions/student/${currentUser.uid}`).then(r => r.json()),
      fetch(`${API}/get-academic-years`).then(r => r.json()),
    ])
      .then(([allAssignments, submissions, years]) => {
        const active = Array.isArray(years)
          ? years.find(y => (y.status || "").toLowerCase().trim() === "on-going")
          : null;
        setActiveYear(active || null);

        // Assignment fields are always: department, yearLevel, section (from AdminClassAssignment)
        // userProfile may have fallback fields depending on when the account was created
        const studentDept = userProfile.department || userProfile.dept || "";
        const studentYear = userProfile.yearLevel || userProfile.year || "";
        const studentSection = userProfile.section || "";
        const myAssignments = (Array.isArray(allAssignments) ? allAssignments : []).filter(a =>
          a.department === studentDept &&
          a.yearLevel === studentYear &&
          a.section === studentSection &&
          active &&
          a.academicYear === active.year &&
          a.semester === active.semester
        );
        const submittedIds = new Set((Array.isArray(submissions) ? submissions : []).map(s => s.assignmentId));
        const evaluated = myAssignments.filter(a => submittedIds.has(a.id)).length;
        setStats({ total: myAssignments.length, evaluated, pending: myAssignments.length - evaluated });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser, userProfile]);

  const displayName = userProfile?.fullName || "Student";
  const firstName = displayName.split(" ")[0];

  const now = new Date();
  const ayEndDate = activeYear?.endDate ? new Date(activeYear.endDate + "T23:59:59") : null;
  // activeYear is only set when status === "on-going", so just check it's not null + endDate
  const isEvaluationOpen =
    !loading &&
    activeYear !== null &&
    (!ayEndDate || now <= ayEndDate);

  return (
    <StudentLayout breadcrumb="Dashboard">
      <div className="sd-welcomeHeader">
        <div>
          <h2 className="sd-title">Welcome back, {firstName}!</h2>
          <p className="sd-subtitle">Complete your faculty evaluations for this semester</p>
        </div>
      </div>

      <div className="sd-infoCard">
        <div className="sd-infoIcon">
          <Calendar size={24} />
        </div>
        <div>
          <div className="sd-infoTitle">Current Academic Period</div>
          <div className="sd-infoText">
            <strong>Academic Year:</strong>{" "}
            {activeYear ? `${activeYear.year} ${activeYear.semester}` : "—"}
          </div>
          <div className="sd-infoText">
            <strong>Evaluation Status:</strong>{" "}
            {loading ? (
              <span className="sd-statusBadge">—</span>
            ) : isEvaluationOpen ? (
              <span className="sd-statusBadge sd-statusBadge--open">Open</span>
            ) : (
              <span className="sd-statusBadge sd-statusBadge--closed">Closed</span>
            )}
          </div>
        </div>
      </div>

      <div className="sd-statsGrid">
        <div className="sd-statCard sd-statCard--primary">
          <div className="sd-statIcon">
            <Users size={32} />
          </div>
          <div className="sd-statContent">
            <div className="sd-statNum">{loading ? "—" : stats.total}</div>
            <div className="sd-statLabel">Total Teachers</div>
          </div>
        </div>

        <div className="sd-statCard sd-statCard--success">
          <div className="sd-statIcon">
            <Check size={32} />
          </div>
          <div className="sd-statContent">
            <div className="sd-statNum">{loading ? "—" : stats.evaluated}</div>
            <div className="sd-statLabel">Evaluated</div>
          </div>
        </div>

        <div className="sd-statCard sd-statCard--warning">
          <div className="sd-statIcon">
            <Clock size={32} />
          </div>
          <div className="sd-statContent">
            <div className="sd-statNum">{loading ? "—" : stats.pending}</div>
            <div className="sd-statLabel">Pending</div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
