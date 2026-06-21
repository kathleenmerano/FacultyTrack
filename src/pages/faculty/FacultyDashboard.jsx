import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";
import FacultyLayout from "./FacultyLayout";

export default function FacultyDashboard() {
  const [overallRating, setOverallRating] = useState(null);
  const [totalResponses, setTotalResponses] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      fetch(`${API}/get-evaluations/faculty/${currentUser.uid}`).then(r => r.json()),
      fetch(`${API}/get-academic-years`).then(r => r.json()),
    ])
      .then(([evals, years]) => {
        const allScores = (Array.isArray(evals) ? evals : [])
          .flatMap(e => Object.values(e.ratings || {}).map(Number));
        setOverallRating(allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null);
        setTotalResponses(Array.isArray(evals) ? evals.length : 0);

        if (Array.isArray(years) && years.length > 0) {
          const active = years.find(y => (y.status || "").toLowerCase().trim() === "on-going") || years[0];
          setActiveYear(active);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const displayName = userProfile?.fullName || "Faculty";
  const firstName = displayName.split(" ")[0];

  return (
    <FacultyLayout breadcrumb="Dashboard">
      <section className="fd-content">
        <div className="fd-welcomeHeader">
          <div>
            <h2 className="fd-title">Welcome, {firstName}!</h2>
            <p className="fd-subtitle">Overview of your evaluation results for the current period</p>
          </div>
        </div>

        <div className="fd-periodCard">
          <div className="fd-periodLabel">CURRENT PERIOD</div>
          <div className="fd-periodTitle">
            {activeYear
              ? `Academic Year: ${activeYear.year} ${activeYear.semester}`
              : "Academic Year: —"}
          </div>
        </div>

        <div className="fd-statsGrid">
          <div className="fd-statCard">
            <div className="fd-statContent">
              <div className="fd-statNum">
                {loading ? "—" : overallRating !== null ? overallRating.toFixed(1) : "N/A"}
              </div>
              <div className="fd-statLabel">OVERALL RATING</div>
            </div>
            <div className="fd-statIcon fd-statIcon--rating">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          <div className="fd-statCard">
            <div className="fd-statContent">
              <div className="fd-statNum">{loading ? "—" : totalResponses ?? 0}</div>
              <div className="fd-statLabel">TOTAL RESPONSES</div>
            </div>
            <div className="fd-statIcon fd-statIcon--responses">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>

        <div className="fd-tableCard">
          <div className="fd-tableHeader">
            <h3 className="fd-tableTitle">EVALUATION DETAILS</h3>
          </div>
          <div className="fd-tableWrap">
            <table className="fd-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Review Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && overallRating !== null && activeYear ? (
                  <tr>
                    <td className="fd-studentName">{displayName}</td>
                    <td>{activeYear.semester} | {activeYear.year}</td>
                    <td>
                      <button
                        type="button"
                        className="fd-badge fd-badge--submitted"
                        onClick={() => navigate("/faculty/evaluations")}
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                      {loading ? "Loading..." : "No evaluations yet for the current period."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}
