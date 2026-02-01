import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Mock student data
  const studentData = {
    id: "2021-00019",
    name: "John Doe",
    email: "john.doe@example.edu",
    department: "BSIT",
    yearLevel: "3rd Year",
    section: "D",
    enrollmentStatus: "Active",
    contactNumber: "+63 912 345 6789",
    address: "123 Main Street, City, Province"
  };

  return (
    <div className={`sd ${sidebarOpen ? "sd--open" : "sd--closed"}`}>
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
          <Link className="sd-link" to="/student/dashboard">
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
              <span>My Profile</span>
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
                <span className="sd-topUserName">{studentData.name}</span>
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
              <h2 className="sd-title">My Profile</h2>
              <p className="sd-subtitle">View and manage your account information</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="sd-profileCard">
            <div className="sd-profileHeader">
              <div className="sd-profileAvatar">
                {studentData.name.charAt(0)}
              </div>
              <div className="sd-profileInfo">
                <h3 className="sd-profileName">{studentData.name}</h3>
                <span className="sd-profileRole">Student</span>
              </div>
            </div>

            <div className="sd-profileDetails">
              <div className="sd-profileField">
                <label className="sd-profileLabel">Student ID</label>
                <div className="sd-profileValue">{studentData.id}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Email Address</label>
                <div className="sd-profileValue">{studentData.email}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Department</label>
                <div className="sd-profileValue">{studentData.department}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Year Level</label>
                <div className="sd-profileValue">{studentData.yearLevel}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Section</label>
                <div className="sd-profileValue">{studentData.section}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Enrollment Status</label>
                <div className="sd-profileValue">{studentData.enrollmentStatus}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Contact Number</label>
                <div className="sd-profileValue">{studentData.contactNumber}</div>
              </div>

              <div className="sd-profileField">
                <label className="sd-profileLabel">Address</label>
                <div className="sd-profileValue">{studentData.address}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sd-footer">
          <span>Copyright (c) 2026 FacultyTrack. All Rights Reserved.</span>
        </footer>
      </main>
    </div>
  );
}
