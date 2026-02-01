import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAcademicYear() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAY, setEditingAY] = useState(null);

  // Sample academic year data
  const [academicYearList] = useState([
    {
      id: 1,
      year: "2023-2024",
      semester: "1st Semester",
      startDate: "2/28/2025",
      endDate: "2/30/2025",
      status: "closed"
    },
    {
      id: 2,
      year: "2024-2025",
      semester: "2nd Semester",
      startDate: "5/23/2026",
      endDate: "5/30/2026",
      status: "on-going"
    },
    {
      id: 3,
      year: "2025-2026",
      semester: "2nd Semester",
      startDate: "12/10/2025",
      endDate: "12/16/2025",
      status: "closed"
    },
  ]);

  const filteredAcademicYears = academicYearList.filter(
    (ay) =>
      ay.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ay.semester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAcademicYear = () => {
    setEditingAY(null);
    setShowModal(true);
  };

  const handleEditAY = (ay) => {
    setEditingAY(ay);
    setShowModal(true);
  };

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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/dashboard')}>
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/faculty')}>
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/student')}>
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/department')}>
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="ad-linkText">Department</span>
          </button>
          <button className="ad-link" type="button" onClick={() => navigate('/admin/subject')}>
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span className="ad-linkText">Subject</span>
          </button>
          <button className="ad-link" type="button" onClick={() => navigate('/admin/class-assignment')}>
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <span className="ad-linkText">Class Assignment</span>
          </button>
          <button className="ad-link ad-link--active" type="button" onClick={() => navigate('/admin/academic-year')}>
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/questionnaire')}>
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/criteria')}>
            <span className="ad-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
            <span className="ad-linkText">Evaluation Criteria</span>
          </button>
          <button className="ad-link" type="button" onClick={() => navigate('/admin/report')}>
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
              <span>Academic Year Management</span>
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
                  <button type="button" className="ad-dropdownItem">
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
              <h2 className="ad-title">Academic Year & Evaluation Period</h2>
            </div>
            <button className="ad-btnPrimary" onClick={handleAddAcademicYear}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="ad-searchBar">
            <button className="ad-searchBtn">search</button>
            <input
              type="text"
              className="ad-searchInput"
              placeholder="Search academic years..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ACADEMIC YEAR TABLE CARD */}
          <div className="ad-tableCard">
            <div className="ad-tableWrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Academic Year</th>
                    <th>Semester</th>
                    <th>Starting Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAcademicYears.map((ay) => (
                    <tr key={ay.id}>
                      <td className="ad-name">{ay.year}</td>
                      <td className="ad-engagement">{ay.semester}</td>
                      <td className="ad-engagement">{ay.startDate}</td>
                      <td className="ad-engagement">{ay.endDate}</td>
                      <td>
                        <span className={`ad-badge ad-badge--${ay.status.toLowerCase()}`}>
                          {ay.status}
                        </span>
                      </td>
                      <td className="ad-tableActions">
                        <button 
                          className="ad-actionBtn ad-actionBtn--edit" 
                          title="Edit"
                          onClick={() => handleEditAY(ay)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
                          </svg>
                        </button>
                        <button className="ad-actionBtn ad-actionBtn--delete" title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ad-footer">
          Copyright © 2026 FacultyTrack. All Rights Reserved.
        </footer>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => setShowModal(false)} />
          <div className="ad-modalContent">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">
                {editingAY ? 'Edit Academic Year' : 'Add New Academic Year'}
              </h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formGroup">
                <label className="ad-label">Academic Year</label>
                <input type="text" className="ad-input" placeholder="e.g., 2025-2026" defaultValue={editingAY?.year} />
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Semester</label>
                <select className="ad-input" defaultValue={editingAY?.semester}>
                  <option value="">Select semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">Starting Date</label>
                  <input type="date" className="ad-input" defaultValue={editingAY?.startDate} />
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">End Date</label>
                  <input type="date" className="ad-input" defaultValue={editingAY?.endDate} />
                </div>
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Status</label>
                <select className="ad-input" defaultValue={editingAY?.status}>
                  <option value="on-going">On-going</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={() => setShowModal(false)}>
                {editingAY ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
