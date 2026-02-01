import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FacultyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Mock faculty data
  const facultyData = {
    id: "FAC-2024-001",
    name: "Dr. Bruce Wayne",
    email: "bruce.wayne@example.edu",
    department: "Information Technology",
    position: "Associate Professor",
    specialization: "Web Development & Software Engineering",
    employmentStatus: "Full-Time",
    contactNumber: "+63 917 123 4567",
    officeLocation: "Room 302, IT Building"
  };

  return (
    <div className="fd">
      {/* SIDEBAR - FIXED */}
      <aside className="fd-sidebar">
        <div className="fd-brand">
          <div className="fd-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" stroke="#0f3b63" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="fd-brandInfo">
            <div className="fd-brandTitle">FacultyTrack</div>
            <div className="fd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="fd-nav">
          <Link className="fd-link" to="/faculty/dashboard">
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="fd-linkText">Dashboard</span>
          </Link>

          <Link className="fd-link" to="/faculty/evaluations">
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            </span>
            <span className="fd-linkText">Evaluation Results</span>
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
              <span>My Profile</span>
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
                <span className="fd-topUserName">{facultyData.name}</span>
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
              <h2 className="fd-title">My Profile</h2>
              <p className="fd-subtitle">View and manage your account information</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="fd-profileCard">
            <div className="fd-profileHeader">
              <div className="fd-profileAvatar">
                {facultyData.name.split(' ').map(n => n.charAt(0)).join('')}
              </div>
              <div className="fd-profileInfo">
                <h3 className="fd-profileName">{facultyData.name}</h3>
                <span className="fd-profileRole">Faculty</span>
              </div>
            </div>

            <div className="fd-profileDetails">
              <div className="fd-profileField">
                <label className="fd-profileLabel">Faculty ID</label>
                <div className="fd-profileValue">{facultyData.id}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Email Address</label>
                <div className="fd-profileValue">{facultyData.email}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Department</label>
                <div className="fd-profileValue">{facultyData.department}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Position</label>
                <div className="fd-profileValue">{facultyData.position}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Specialization</label>
                <div className="fd-profileValue">{facultyData.specialization}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Employment Status</label>
                <div className="fd-profileValue">{facultyData.employmentStatus}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Contact Number</label>
                <div className="fd-profileValue">{facultyData.contactNumber}</div>
              </div>

              <div className="fd-profileField">
                <label className="fd-profileLabel">Office Location</label>
                <div className="fd-profileValue">{facultyData.officeLocation}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="fd-footer">
          <span>Copyright (c) 2026 FacultyTrack. All Rights Reserved.</span>
        </footer>
      </main>
    </div>
  );
}
