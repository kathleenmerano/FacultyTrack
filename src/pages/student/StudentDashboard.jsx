import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <div className={`sd ${!sidebarOpen ? "sd--closed sd--open" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sd-sidebar">
        {/* Logo/Brand Section */}
        <div className="sd-brand">
          <div className="sd-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" stroke="#0f3b63" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sd-brandInfo">
            <div className="sd-brandTitle">FacultyTrack</div>
            <div className="sd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="sd-nav">
          <Link className="sd-link sd-link--active" to="/student/dashboard">
            <span className="sd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="sd-linkText">Home</span>
          </Link>

          <Link className="sd-link" to="/student/evaluate">
            <span className="sd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span className="sd-linkText">Evaluate Teacher</span>
          </Link>
        </nav>
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
                  <div className="sd-dropdownDivider"></div>
                  <button className="sd-dropdownItem sd-dropdownItem--logout" type="button" onClick={handleLogout}>
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
              <h2 className="sd-title">Welcome back, John! </h2>
              <p className="sd-subtitle">Complete your faculty evaluations for this semester</p>
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

          
  
        </section>

        {/* FOOTER */}
        <footer className="sd-footer">
          <span>Copyright © 2026 FacultyTrack. All Rights Reserved.</span>
        </footer>
      </main>
    </div>
  );
}