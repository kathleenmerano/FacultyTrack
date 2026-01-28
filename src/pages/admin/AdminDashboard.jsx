import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const stats = [
    { id: 1, label: "Total Faculties", value: "3", color: "#22c55e" },
    { id: 2, label: "Total Students", value: "49", color: "#1e40af" },
    { id: 3, label: "Total Evaluations", value: "10", color: "#3b82f6" },
  ];

  return (
    <div className={`ad ${sidebarOpen ? "ad--open" : ""}`}>
      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 6v6l4 2"
                stroke="#1e3a5f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="ad-brandInfo">
            <div className="ad-brandTitle">FacultyTrack</div>
            <div className="ad-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="ad-nav">
          <button className="ad-link ad-link--active" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="ad-linkText">Dashboard</span>
          </button>
        </nav>

        <div className="ad-menuLabel">SYSTEM USERS</div>
        <nav className="ad-nav">
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="ad-linkText">Faculty</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span className="ad-linkText">Student</span>
          </button>
        </nav>

        <div className="ad-menuLabel">MANAGE EVALUATION</div>
        <nav className="ad-nav">
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="ad-linkText">Department</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span className="ad-linkText">Subject</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span className="ad-linkText">Academic Year</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="13" x2="12" y2="19" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            </span>
            <span className="ad-linkText">Questionnaire</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
            <span className="ad-linkText">Evaluation Criteria</span>
          </button>
          <button className="ad-link" type="button">
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span className="ad-linkText">Evaluation Report</span>
          </button>
        </nav>
      </aside>

      {/* OVERLAY (mobile) */}
      <button
        type="button"
        className="ad-overlay"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      {/* MAIN - SCROLLABLE CONTENT */}
      <main className="ad-main">
        {/* TOP BAR */}
        <header className="ad-topbar">
          <div className="ad-topLeft">
            <button
              type="button"
              className="ad-burger"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="ad-breadcrumb">
              <span>Dashboard</span>
            </div>
          </div>

          <div className="ad-topRight">
            <div className="ad-userDropdown">
              <button
                className="ad-topUser"
                onClick={() => setDropdownOpen((v) => !v)}
                type="button"
              >
                <div className="ad-topAvatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="ad-topUserName">Admin</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`ad-drop ${dropdownOpen ? "ad-drop--open" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="ad-dropdownMenu">
                  <button className="ad-dropdownItem" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </button>
                  <div className="ad-dropdownDivider" />
                  <button className="ad-dropdownItem ad-dropdownItem--logout" type="button" onClick={handleLogout}>
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
        <section className="ad-content">
          <div className="ad-welcomeHeader">
            <div>
              <h2 className="ad-title">Welcome, Admin!</h2>
              <p className="ad-subtitle">Academic Year: 2025–2026 2nd Semester</p>
              <p className="ad-subtitle">Evaluation status: On-going</p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="ad-statsGrid">
            {stats.map((stat) => (
              <div key={stat.id} className="ad-statCard">
                <div className="ad-statValue" style={{ backgroundColor: stat.color }}>
                  {stat.value}
                </div>
                <div className="ad-statLabel">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ad-footer">
          Copyright © 2026 FacultyTrack. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
