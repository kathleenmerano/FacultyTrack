
import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={`sd ${sidebarOpen ? "sd--open" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sd-sidebar">
        {/* Logo/Brand Section */}
        <div className="sd-brand">
          <div className="sd-brandIcon">FT</div>
          <div>
            <div className="sd-brandTitle">FacultyTrack</div>
            <div className="sd-brandSub">Student Portal</div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="sd-userCard">
          <div className="sd-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="sd-name">John Doe</div>
            <div className="sd-id">ID: 2023-00290</div>
          </div>
        </div>

        <nav className="sd-nav">
          <Link className="sd-link sd-link--active" to="/student/dashboard">
            <span className="sd-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            Dashboard
          </Link>

          <Link className="sd-link" to="/student/evaluate">
            <span className="sd-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            Evaluate Teacher
          </Link>

          <Link className="sd-link" to="/student/history">
            <span className="sd-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            Evaluation History
          </Link>

          <Link className="sd-link" to="/student/profile">
            <span className="sd-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
              </svg>
            </span>
            Settings
          </Link>
        </nav>

        <div className="sd-sideFooter">
          <div className="sd-footerDivider"></div>
          <div className="sd-footerText">© 2026 FacultyTrack</div>
        </div>
      </aside>

      {/* OVERLAY (mobile) */}
      <button
        type="button"
        className="sd-overlay"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="sd-main">
        {/* TOP BAR */}
        <header className="sd-topbar">
          <div className="sd-topLeft">
            <button
              type="button"
              className="sd-burger"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="sd-breadcrumb">
              <span>Dashboard</span>
            </div>
          </div>

          <div className="sd-topRight">
            {/* Notifications */}
            <button className="sd-notifBtn" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="sd-notifBadge">3</span>
            </button>

            {/* User Dropdown */}
            <div className="sd-userDropdown">
              <button 
                className="sd-topUser"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                type="button"
              >
                <div className="sd-topAvatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="sd-topUserName">John Doe</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`sd-drop ${dropdownOpen ? 'sd-drop--open' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="sd-dropdownMenu">
                  <Link to="/student/profile" className="sd-dropdownItem">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>
                  <Link to="/student/settings" className="sd-dropdownItem">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                    </svg>
                    Settings
                  </Link>
                  <div className="sd-dropdownDivider"></div>
                  <button className="sd-dropdownItem sd-dropdownItem--logout" type="button">
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

        {/* CONTENT */}
        <section className="sd-content">
          <div className="sd-welcomeHeader">
            <div>
              <h2 className="sd-title">Welcome back, John! 👋</h2>
              <p className="sd-subtitle">Complete your faculty evaluations for this semester</p>
            </div>
            <div className="sd-dateInfo">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Info card */}
          <div className="sd-infoCard">
            <div className="sd-infoIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div className="sd-infoTitle">Current Academic Period</div>
              <div className="sd-infoText">
                <strong>Academic Year:</strong> 2025–2026 2nd Semester
              </div>
              <div className="sd-infoText">
                <strong>Evaluation Status:</strong> <span className="sd-statusBadge">On-going</span>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="sd-statsGrid">
            <div className="sd-statCard sd-statCard--primary">
              <div className="sd-statIcon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="sd-statContent">
                <div className="sd-statNum">9</div>
                <div className="sd-statLabel">Total Teachers</div>
              </div>
            </div>

            <div className="sd-statCard sd-statCard--success">
              <div className="sd-statIcon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="sd-statContent">
                <div className="sd-statNum">3</div>
                <div className="sd-statLabel">Evaluated</div>
              </div>
            </div>

            <div className="sd-statCard sd-statCard--warning">
              <div className="sd-statIcon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="sd-statContent">
                <div className="sd-statNum">6</div>
                <div className="sd-statLabel">Pending</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sd-quickActions">
            <h3 className="sd-sectionTitle">Quick Actions</h3>
            <div className="sd-actionCards">
              <Link to="/student/evaluate" className="sd-actionCard">
                <div className="sd-actionIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <div className="sd-actionTitle">Start Evaluation</div>
                  <div className="sd-actionDesc">Evaluate your teachers now</div>
                </div>
              </Link>

              <Link to="/student/history" className="sd-actionCard">
                <div className="sd-actionIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <div className="sd-actionTitle">View History</div>
                  <div className="sd-actionDesc">Check past evaluations</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sd-footer">
          <span>Copyright © 2026 FacultyTrack. All Rights Reserved.</span>
        </footer>
      </main>
    </div>
  );
}