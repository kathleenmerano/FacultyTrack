import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ faculty: 0, students: 0, evaluations: 0, currentPeriodEvals: 0, uniqueParticipants: 0 });
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/get-users/faculty`).then(r => r.json()),
      fetch(`${API}/get-users/student`).then(r => r.json()),
      fetch(`${API}/get-evaluations`).then(r => r.json()),
      fetch(`${API}/get-academic-years`).then(r => r.json()),
    ])
      .then(([faculty, students, evaluations, years]) => {
        // Only count active users
        const activeFaculty = Array.isArray(faculty) ? faculty.filter(u => u.status === "active").length : 0;
        const activeStudents = Array.isArray(students) ? students.filter(u => u.status === "active").length : 0;
        
        // Find current period
        let active = null;
        if (Array.isArray(years) && years.length > 0) {
          active = years.find(y => (y.status || "").toLowerCase().trim() === "on-going") || years[0];
          setActiveYear(active);
        }

        // Calculate evaluations specific to this period
        const periodEvalsRaw = (Array.isArray(evaluations) && active) 
          ? evaluations.filter(e => e.academicYear === active.year && e.semester === active.semester)
          : [];

        const periodEvalsCount = periodEvalsRaw.length;
        const uniqueParticipantsCount = new Set(periodEvalsRaw.map(e => e.studentId)).size;

        setStats({
          faculty: activeFaculty,
          students: activeStudents,
          evaluations: Array.isArray(evaluations) ? evaluations.length : 0,
          currentPeriodEvals: periodEvalsCount,
          uniqueParticipants: uniqueParticipantsCount
        });
      })
      .catch(err => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Welcome, Admin!</h2>
            <p className="ad-subtitle">System overview and management dashboard</p>
          </div>
        </div>

        {/* Current Academic Period Card */}
        <div className="ad-periodCard">
          <div className="ad-periodIcon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div className="ad-periodLabel">CURRENT PERIOD</div>
            <div className="ad-periodTitle">
              {activeYear
                ? `Academic Year: ${activeYear.year} ${activeYear.semester}`
                : "No active academic year set"}
            </div>
            <div className="ad-periodStatus">
              <strong>Evaluation Status:</strong>{" "}
              <span className="ad-statusBadge">
                {(activeYear?.status || "").toLowerCase().trim() === "on-going" ? "On-going" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="ad-statsGrid">
          <div className="ad-statCard ad-statCard--primary">
            <div className="ad-statIcon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="ad-statContent">
              <div className="ad-statNum">{loading ? "—" : stats.faculty}</div>
              <div className="ad-statLabel">TOTAL FACULTIES</div>
            </div>
          </div>

          <div className="ad-statCard ad-statCard--success">
            <div className="ad-statIcon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="ad-statContent">
              <div className="ad-statNum">{loading ? "—" : stats.students}</div>
              <div className="ad-statLabel">TOTAL STUDENTS</div>
            </div>
          </div>

          <div className="ad-statCard ad-statCard--info">
            <div className="ad-statIcon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="ad-statContent">
              <div className="ad-statNum">{loading ? "—" : stats.currentPeriodEvals}</div>
              <div className="ad-statLabel">TOTAL FORMS SUBMITTED</div>
            </div>
          </div>

          <div className="ad-statCard ad-statCard--warning">
            <div className="ad-statIcon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="ad-statContent">
              <div className="ad-statNum">
                {loading || stats.students === 0 
                  ? "—" 
                  : `${Math.round((stats.uniqueParticipants / stats.students) * 100)}%`}
              </div>
              <div className="ad-statLabel">PARTICIPATION RATE</div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
