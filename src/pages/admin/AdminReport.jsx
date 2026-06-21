import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "—";

const getPerformanceLabel = (r) => {
  const n = Number(r);
  if (isNaN(n)) return "—";
  if (n >= 4.5) return "Outstanding";
  if (n >= 4.0) return "Excellent";
  if (n >= 3.5) return "Very Good";
  if (n >= 3.0) return "Good";
  return "Needs Improvement";
};

const getPerformanceColor = (r) => {
  const n = Number(r);
  if (isNaN(n)) return "#9ca3af";
  if (n >= 4.5) return "#22c55e";
  if (n >= 4.0) return "#3b82f6";
  if (n >= 3.0) return "#f59e0b";
  return "#ef4444";
};

// SVG Icons
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const PieChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const tierColors = {
  "Excellent (4.0-5.0)": "#22c55e",
  "Very Good (3.5-3.9)": "#3b82f6",
  "Good (3.0-3.4)": "#f59e0b",
  "Needs Improvement (<3.0)": "#ef4444",
};

export default function AdminReport() {
  const [evaluations, setEvaluations] = useState([]);
  const [facultyUsers, setFacultyUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(null);

  const [filterAY, setFilterAY] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/get-evaluations`).then(r => r.json()),
      fetch(`${API}/get-users/faculty`).then(r => r.json()),
      fetch(`${API}/get-assignments`).then(r => r.json()),
      fetch(`${API}/get-academic-years`).then(r => r.json()),
    ])
      .then(([evals, faculty, assign, years]) => {
        setEvaluations(Array.isArray(evals) ? evals : []);
        setFacultyUsers(Array.isArray(faculty) ? faculty.filter(u => u.status === "active") : []);
        setAssignments(Array.isArray(assign) ? assign : []);

        if (Array.isArray(years)) {
          const active = years.find(y => (y.status || "").toLowerCase().trim() === "on-going");
          if (active) {
            setFilterAY(active.year);
            setFilterSem(active.semester);
          }
        }
      })
      .catch(err => console.error("Report fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueAYs = [...new Set(evaluations.map(e => e.academicYear).filter(Boolean))];
  const uniqueSems = [...new Set(evaluations.map(e => e.semester).filter(Boolean))];

  const reportData = facultyUsers.map(faculty => {
    const facultyEvals = evaluations
      .filter(e => e.facultyId === faculty.id)
      .filter(e => !filterAY || e.academicYear === filterAY)
      .filter(e => !filterSem || e.semester === filterSem);

    const facultyAssignments = assignments
      .filter(a => a.facultyId === faculty.id)
      .filter(a => !filterAY || a.academicYear === filterAY)
      .filter(a => !filterSem || a.semester === filterSem);

    const subjects = [...new Set(facultyAssignments.map(a => a.subjectCode))].join(", ") || "—";
    const uniqueStudents = new Set(facultyEvals.map(e => e.studentId)).size;
    const allScores = facultyEvals.flatMap(e => Object.values(e.ratings || {}).map(Number));

    return {
      id: faculty.id,
      faculty: faculty.fullName,
      department: faculty.department || "—",
      subjects,
      students: uniqueStudents,
      formCount: facultyEvals.length,
      rating: avg(allScores),
    };
  }).filter(r => !filterFaculty || r.id === filterFaculty);

  // Department bar chart data
  const deptMap = {};
  reportData.forEach(r => {
    if (r.rating === "—") return;
    if (!deptMap[r.department]) deptMap[r.department] = { total: 0, count: 0 };
    deptMap[r.department].total += parseFloat(r.rating);
    deptMap[r.department].count++;
  });
  const deptData = Object.entries(deptMap).map(([dept, v]) => ({
    dept,
    avg: parseFloat((v.total / v.count).toFixed(2)),
  }));

  // Donut pie data
  const tierMap = {
    "Excellent (4.0-5.0)": 0,
    "Very Good (3.5-3.9)": 0,
    "Good (3.0-3.4)": 0,
    "Needs Improvement (<3.0)": 0,
  };
  reportData.forEach(r => {
    const n = parseFloat(r.rating);
    if (isNaN(n)) return;
    if (n >= 4.0) tierMap["Excellent (4.0-5.0)"]++;
    else if (n >= 3.5) tierMap["Very Good (3.5-3.9)"]++;
    else if (n >= 3.0) tierMap["Good (3.0-3.4)"]++;
    else tierMap["Needs Improvement (<3.0)"]++;
  });
  const pieData = Object.entries(tierMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const hasChartData = deptData.length > 0 || pieData.length > 0;

  const handleSearch = () => {};

  return (
    <AdminLayout title="Evaluation Report">
      <section className="ad-content">
        <h2 className="ad-title">Evaluation Report</h2>

        <div className="ad-filterCard">
          <div className="ad-filterGroup">
            <select className="ad-filterSelect" value={filterAY} onChange={e => setFilterAY(e.target.value)}>
              <option value="">All Academic Years</option>
              {uniqueAYs.map(ay => <option key={ay} value={ay}>{ay}</option>)}
            </select>
            <select className="ad-filterSelect" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
              <option value="">All Semesters</option>
              {uniqueSems.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="ad-filterSelect" value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">All Faculty</option>
              {facultyUsers.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
            </select>
            <button className="ad-btnSearch" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="ad-tableCard">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading report data...</div>
          ) : (
            <div className="ad-tableWrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Department</th>
                    <th>Subjects</th>
                    <th>Students</th>
                    <th>Forms</th>
                    <th>Average Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                        No evaluation data found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    reportData.map(report => (
                      <tr key={report.id}>
                        <td className="ad-name">{report.faculty}</td>
                        <td className="ad-engagement">{report.department}</td>
                        <td className="ad-engagement">{report.subjects}</td>
                        <td className="ad-engagement">{report.students}</td>
                        <td className="ad-engagement">{report.formCount}</td>
                        <td className="ad-engagement">
                          {report.rating !== "—" ? (
                            <strong style={{ color: Number(report.rating) >= 4.5 ? "#22c55e" : Number(report.rating) >= 4.0 ? "#3b82f6" : "#f59e0b" }}>
                              {report.rating}
                            </strong>
                          ) : (
                            <span style={{ color: "#9ca3af" }}>No data</span>
                          )}
                        </td>
                        <td className="ad-tableActions">
                          <button className="ad-btnView" onClick={() => setViewingReport(report)}>VIEW</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Charts */}
        {!loading && hasChartData && (
          <div className="ad-chartsRow">

            {/* LEFT: Department Performance */}
            <div className="ad-tableCard" style={{ marginBottom: 0 }}>
              <div className="ad-chartHeader">
                <div className="ad-chartHeaderInner">
                  <span className="ad-chartIcon"><BarChartIcon /></span>
                  <span className="ad-chartTitle">DEPARTMENT PERFORMANCE</span>
                </div>
                <span className="ad-chartBadge">By Overall Rating</span>
              </div>
              <div className="ad-chartBody">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v) => [v, "Average Rating"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="avg" name="Average Rating" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RIGHT: Rating Distribution */}
            <div className="ad-tableCard" style={{ marginBottom: 0 }}>
              <div className="ad-chartHeader">
                <div className="ad-chartHeaderInner">
                  <span className="ad-chartIcon"><PieChartIcon /></span>
                  <span className="ad-chartTitle">RATING DISTRIBUTION</span>
                </div>
                <span className="ad-chartBadge">Current Semester</span>
              </div>
              <div className="ad-chartBody">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={75}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={tierColors[entry.name] || "#9ca3af"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </section>

      {viewingReport && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => setViewingReport(null)} />
          <div className="ad-modalContent">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">Evaluation Report — {viewingReport.faculty}</h3>
              <button className="ad-modalClose" onClick={() => setViewingReport(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ad-modalBody">
              {[
                { label: "Faculty Name", value: viewingReport.faculty },
                { label: "Department", value: viewingReport.department },
                { label: "Subjects", value: viewingReport.subjects },
                { label: "Students Participated", value: viewingReport.students },
                { label: "Total Forms Submitted", value: viewingReport.formCount },
              ].map(f => (
                <div className="ad-formGroup" key={f.label} style={{ marginBottom: "12px" }}>
                  <label className="ad-label" style={{ marginBottom: "4px" }}>{f.label}</label>
                  <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px" }}>{f.value}</div>
                </div>
              ))}
              <div style={{ marginTop: "16px", padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Average Rating</div>
                <div style={{ fontSize: "32px", fontWeight: 700, color: getPerformanceColor(viewingReport.rating) }}>
                  {viewingReport.rating !== "—" ? viewingReport.rating : "No Data"}
                </div>
                {viewingReport.rating !== "—" && (
                  <div style={{ fontSize: "14px", fontWeight: 600, color: getPerformanceColor(viewingReport.rating), marginTop: "4px" }}>
                    {getPerformanceLabel(viewingReport.rating)}
                  </div>
                )}
              </div>
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setViewingReport(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}