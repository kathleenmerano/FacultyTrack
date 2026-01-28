import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <div className={`fd ${sidebarOpen ? "fd--open" : ""}`}>
      {/* SIDEBAR - FIXED */}
      <aside className="fd-sidebar">
        <div className="fd-brand">
          <div className="fd-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 6v6l4 2"
                stroke="#1a3a5c"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="fd-brandInfo">
            <div className="fd-brandTitle">FacultyTrack</div>
            <div className="fd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="fd-nav">
          <Link className="fd-link fd-link--active" to="/faculty/dashboard" onClick={() => setSidebarOpen(false)}>
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="fd-linkText">Home</span>
          </Link>

          <Link className="fd-link" to="/faculty/evaluations" onClick={() => setSidebarOpen(false)}>
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span className="fd-linkText">Evaluation Result</span>
          </Link>
        </nav>
      </aside>

      {/* OVERLAY (mobile) */}
      <button
        type="button"
        className="fd-overlay"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      {/* MAIN - SCROLLABLE CONTENT */}
      <main className="fd-main">
        {/* TOP BAR - STICKY */}
        <header className="fd-topbar">
          <div className="fd-topLeft">
            <button
              type="button"
              className="fd-burger"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="fd-breadcrumb">
              <span>Dashboard</span>
            </div>
          </div>

          <div className="fd-topRight">
            <div className="fd-userDropdown">
              <button
                className="fd-topUser"
                onClick={() => setDropdownOpen((v) => !v)}
                type="button"
              >
                <div className="fd-topAvatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="fd-topUserName">Bruce Wayne</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`fd-drop ${dropdownOpen ? "fd-drop--open" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="fd-dropdownMenu">
                  <Link to="/faculty/profile" className="fd-dropdownItem">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>
                  <div className="fd-dropdownDivider" />
                  <button className="fd-dropdownItem fd-dropdownItem--logout" type="button" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <section className="fd-content">
          <div className="fd-welcomeHeader">
            <div>
              <h2 className="fd-title">Welcome Bruce Wayne!</h2>
              <p className="fd-subtitle">Overview of your evaluation results for the current period</p>
            </div>
          </div>

          {/* Current Academic Period Card */}
          <div className="fd-periodCard">
            <div className="fd-periodLabel">CURRENT PERIOD</div>
            <div className="fd-periodTitle">Academic Year: 2025–2026 2nd Semester</div>
          </div>

          {/* Stats cards */}
          <div className="fd-statsGrid">
            <div className="fd-statCard">
              <div className="fd-statContent">
                <div className="fd-statNum">4.7</div>
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
                <div className="fd-statNum">34</div>
                <div className="fd-statLabel">TOTAL RESPONSES</div>
              </div>
              <div className="fd-statIcon fd-statIcon--responses">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </div>

          {/* Evaluation Details Table */}
          <div className="fd-tableCard">
            <div className="fd-tableHeader">
              <h3 className="fd-tableTitle">EVALUATION DETAILS</h3>
            </div>

            <div className="fd-tableWrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Faculty Name</th>
                    <th>Review Period</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td className="fd-studentName">Bruce Wayne</td>
                    <td>2nd Sem | 2025-2026</td>
                    <td>
                      <span className="fd-badge fd-badge--submitted">View Result</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="fd-footer">
          Copyright © 2026 FacultyTrack. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}