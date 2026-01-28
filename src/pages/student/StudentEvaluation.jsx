import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";


export default function StudentEvaluation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  // Mock faculty data
  const facultyList = [
    { id: 1, name: "Dr. Bruce Wayne", subject: "IM2", status: "pending" },
    { id: 2, name: "Prof. izek Omerta", subject: "Web 2", status: "pending" },
    { id: 3, name: "Dr. Sarah Johnson", subject: "SAD", status: "submitted" },
    { id: 4, name: "Prof. Michael Cruz", subject: "IT PROF EL", status: "pending" },
    { id: 5, name: "Dr. Ana Lopez", subject: "SIA", status: "pending" },
  ];

  // Evaluation criteria
  const evaluationCriteria = [
    {
      id: 1,
      category: "Teaching Effectiveness",
      items: [
        "Demonstrates mastery of the subject matter",
        "Explains concepts clearly and effectively",
        "Uses appropriate teaching methods and materials",
        "Encourages student participation and engagement",
      ],
    },
    {
      id: 2,
      category: "Classroom Management",
      items: [
        "Maintains discipline and order in the classroom",
        "Uses class time efficiently",
        "Starts and ends classes on time",
        "Creates a positive learning environment",
      ],
    },
    {
      id: 3,
      category: "Assessment & Feedback",
      items: [
        "Provides fair and timely evaluation of student work",
        "Gives constructive feedback",
        "Returns graded work promptly",
        "Makes grading criteria clear",
      ],
    },
    {
      id: 4,
      category: "Professional Behavior",
      items: [
        "Shows respect for students",
        "Is accessible during consultation hours",
        "Demonstrates professionalism",
        "Serves as a positive role model",
      ],
    },
  ];

  const filteredFaculty = facultyList.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEvaluate = (faculty) => {
    setSelectedFaculty(faculty);
    setRatings({});
    setShowModal(true);
  };

  const handleRatingChange = (criteriaId, itemIndex, value) => {
    setRatings((prev) => ({
      ...prev,
      [`${criteriaId}-${itemIndex}`]: value,
    }));
  };

  const handleSubmitEvaluation = () => {
    console.log("Submitting evaluation for", selectedFaculty, "with ratings:", ratings);
    alert(`Evaluation for ${selectedFaculty.name} submitted successfully!`);
    setShowModal(false);
    setSelectedFaculty(null);
  };

  return (
    <div className={`sd ${sidebarOpen ? "sd--open" : ""}`}>
      {/* SIDEBAR - FIXED */}
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 6v6l4 2"
                stroke="#0f3b63"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="sd-brandInfo">
            <div className="sd-brandTitle">FacultyTrack</div>
            <div className="sd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="sd-nav">
          <Link className="sd-link" to="/student/dashboard" onClick={() => setSidebarOpen(false)}>
            <span className="sd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="sd-linkText">Home</span>
          </Link>

          <Link
            className="sd-link sd-link--active"
            to="/student/evaluate"
            onClick={() => setSidebarOpen(false)}
          >
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

      {/* MAIN - SCROLLABLE CONTENT */}
      <main className="sd-main">
        {/* TOP BAR - STICKY */}
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
              <span>Evaluate Teacher</span>
            </div>
          </div>

          <div className="sd-topRight">
            <div className="sd-userDropdown">
              <button
                className="sd-topUser"
                onClick={() => setDropdownOpen((v) => !v)}
                type="button"
              >
                <div className="sd-topAvatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="sd-topUserName">John Doe</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`sd-drop ${dropdownOpen ? "sd-drop--open" : ""}`}
                >
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
                  <div className="sd-dropdownDivider" />
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

        {/* SCROLLABLE CONTENT */}
        <section className="sd-content">
          <div className="sd-welcomeHeader">
            <div>
              <h2 className="sd-title">Faculty Evaluation</h2>
              <p className="sd-subtitle">Evaluate your instructors for this semester.</p>
            </div>
            <div className="sd-dateInfo">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
              <div className="sd-infoTitle">Academic Year: 2025–2026 2nd Semester</div>
              <div className="sd-infoText">
                <strong>Evaluation Status:</strong> In Progress
              </div>
              <div className="sd-infoText">
                <strong>Deadline:</strong> <span style={{background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700}}>May 15, 2026</span>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="se-tableCard">
            <div className="se-tableHeader">
              <div>
                <h3 className="se-tableTitle">Faculty List</h3>
                <p className="se-tableHint">Click "Evaluate" to rate your instructor</p>
              </div>

              <div className="se-searchBox">
                <Search size={16} className="se-searchIcon" />
                <input
                  type="text"
                  className="se-search"
                  placeholder="Search faculty or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="se-tableWrap">
              <table className="se-table">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th className="se-thAction">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((faculty) => (
                    <tr key={faculty.id}>
                      <td className="se-facultyName">{faculty.name}</td>
                      <td>{faculty.subject}</td>
                      <td>
                        <span className={`se-badge se-badge--${faculty.status}`}>
                          {faculty.status === "pending" ? "PENDING" : "SUBMITTED"}
                        </span>
                      </td>
                      <td className="se-tdAction">
                        <button
                          type="button"
                          className={`se-btn ${faculty.status === "submitted" ? "se-btn--disabled" : ""}`}
                          onClick={() => handleEvaluate(faculty)}
                          disabled={faculty.status === "submitted"}
                        >
                          {faculty.status === "pending" ? "Evaluate" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="sd-footer">
            Copyright © 2026 FacultyTrack. All Rights Reserved.
          </footer>
        </section>
      </main>

      {/* MODAL */}
      {showModal && selectedFaculty && (
        <div className="se-modal" role="dialog" aria-modal="true">
          <div className="se-modalOverlay" onClick={() => setShowModal(false)} />

          <div className="se-modalContent">
            <div className="se-modalHeader">
              <div>
                <h3 className="se-modalTitle">Faculty Evaluation Form</h3>
                <p className="se-modalSubtitle">
                  {selectedFaculty.name} — {selectedFaculty.subject}
                </p>
              </div>

              <button type="button" className="se-modalClose" onClick={() => setShowModal(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="se-modalBody">
              <div className="se-instructions">
                <p>Please rate each item using the following scale:</p>
                <div className="se-scale">
                  <span>5 - Outstanding</span>
                  <span>4 - Very Good</span>
                  <span>3 - Good</span>
                  <span>2 - Fair</span>
                  <span>1 - Poor</span>
                </div>
              </div>

              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="se-criteriaSection">
                  <h4 className="se-criteriaTitle">{criteria.category}</h4>

                  {criteria.items.map((item, index) => (
                    <div key={index} className="se-criteriaItem">
                      <div className="se-criteriaText">{item}</div>

                      <div className="se-ratingButtons">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={`se-ratingBtn ${
                              ratings[`${criteria.id}-${index}`] === rating ? "se-ratingBtn--active" : ""
                            }`}
                            onClick={() => handleRatingChange(criteria.id, index, rating)}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="se-commentsSection">
                <label className="se-commentsLabel">Additional Comments (Optional)</label>
                <textarea
                  className="se-commentsTextarea"
                  placeholder="Share your thoughts about this instructor..."
                  rows="4"
                />
              </div>
            </div>

            <div className="se-modalFooter">
              <button type="button" className="se-modalBtn se-modalBtn--cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" className="se-modalBtn se-modalBtn--submit" onClick={handleSubmitEvaluation}>
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}