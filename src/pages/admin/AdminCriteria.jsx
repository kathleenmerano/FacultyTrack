import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCriteria() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // State for criteria management
  const [criteriaList, setCriteriaList] = useState([
    { id: 1, name: "Teaching Effectiveness" },
    { id: 2, name: "Performance" },
    { id: 3, name: "Sample" },
    { id: 4, name: "Sample" },
  ]);

  const [formData, setFormData] = useState({
    criteriaName: ""
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle form submission
  const handleSave = () => {
    if (!formData.criteriaName.trim()) {
      showToast("Please enter a criteria name", "error");
      return;
    }

    // Add new criteria
    const newCriteria = {
      id: Math.max(...criteriaList.map(c => c.id), 0) + 1,
      name: formData.criteriaName,
      checked: false
    };
    setCriteriaList([...criteriaList, newCriteria]);

    // Reset form
    setFormData({ criteriaName: "" });
    showToast("Criteria added successfully!", "success");
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ criteriaName: "" });
  };

  // Handle checkbox toggle
  const handleToggle = (id) => {
    setCriteriaList(criteriaList.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData({ criteriaName: item.name });
    showToast("Criteria loaded for editing", "info");
    // You can add edit mode functionality here
  };

  // Handle delete
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this criteria?")) {
      setCriteriaList(criteriaList.filter(item => item.id !== id));
      showToast("Criteria deleted successfully", "success");
    }
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
          <button className="ad-link" type="button" onClick={() => navigate('/admin/academic-year')}>
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
          <button className="ad-link ad-link--active" type="button" onClick={() => navigate('/admin/criteria')}>
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
              <span>Manage Criteria</span>
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
          {/* SPLIT PANEL LAYOUT */}
          <div className="ad-splitLayout">
            {/* LEFT PANEL - FORM */}
            <div className="ad-splitPanel ad-splitPanel--form">
              <div className="ad-panelHeader">
                <h3 className="ad-panelTitle">Add Evaluation Criteria</h3>
              </div>
              <div className="ad-panelBody">
                <div className="ad-formGroup">
                  <label className="ad-label">Criteria Name</label>
                  <input
                    type="text"
                    className="ad-input"
                    placeholder="Enter criteria name"
                    value={formData.criteriaName}
                    onChange={(e) => setFormData({ ...formData, criteriaName: e.target.value })}
                  />
                </div>
                <div className="ad-formActions">
                  <button className="ad-btnPrimary" onClick={handleSave}>
                    Save
                  </button>
                  <button className="ad-btnSecondary" onClick={handleCancel}>Reset</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - CHECKLIST */}
            <div className="ad-splitPanel ad-splitPanel--list">
              <div className="ad-panelHeader">
                <h3 className="ad-panelTitle">Criteria List ({criteriaList.length})</h3>
              </div>
              <div className="ad-panelBody">
                <div className="ad-criteriaList">
                  {criteriaList.length === 0 ? (
                    <div className="ad-emptyState">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <p className="ad-emptyText">No criteria added yet</p>
                      <p className="ad-emptySubtext">Start by adding your first evaluation criteria</p>
                    </div>
                  ) : (
                    criteriaList.map((item) => (
                      <div key={item.id} className="ad-criteriaItem">
                        <label className="ad-criteriaCheckbox">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggle(item.id)}
                          />
                          <span className="ad-criteriaName">{item.name}</span>
                        </label>
                        <div className="ad-criteriaActions">
                          <button 
                            className="ad-iconBtn ad-iconBtn--edit" 
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button 
                            className="ad-iconBtn ad-iconBtn--delete" 
                            title="Delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ad-footer">
          Copyright © 2026. FacultyTrack. All Rights Reserved.
        </footer>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`ad-toast ad-toast--${toast.type}`}>
          <div className="ad-toastIcon">
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <span className="ad-toastMessage">{toast.message}</span>
        </div>
      )}
    </div>
  );
}