import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

export default function StudentEvaluation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState({});

  // Mock faculty data
  const facultyList = [
    { id: 1, name: "Dr. Maria Santos", subject: "Mathematics", status: "pending" },
    { id: 2, name: "Prof. John Reyes", subject: "English", status: "pending" },
    { id: 3, name: "Dr. Sarah Johnson", subject: "Science", status: "submitted" },
    { id: 4, name: "Prof. Michael Cruz", subject: "History", status: "pending" },
    { id: 5, name: "Dr. Ana Lopez", subject: "Filipino", status: "pending" },
  ];

  // Evaluation criteria
  const evaluationCriteria = [
    { id: 1, category: "Teaching Effectiveness", items: [
      "Demonstrates mastery of the subject matter",
      "Explains concepts clearly and effectively",
      "Uses appropriate teaching methods and materials",
      "Encourages student participation and engagement"
    ]},
    { id: 2, category: "Classroom Management", items: [
      "Maintains discipline and order in the classroom",
      "Uses class time efficiently",
      "Starts and ends classes on time",
      "Creates a positive learning environment"
    ]},
    { id: 3, category: "Assessment & Feedback", items: [
      "Provides fair and timely evaluation of student work",
      "Gives constructive feedback",
      "Returns graded work promptly",
      "Makes grading criteria clear"
    ]},
    { id: 4, category: "Professional Behavior", items: [
      "Shows respect for students",
      "Is accessible during consultation hours",
      "Demonstrates professionalism",
      "Serves as a positive role model"
    ]}
  ];

  const filteredFaculty = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEvaluate = (faculty) => {
    setSelectedFaculty(faculty);
    setRatings({});
    setShowModal(true);
  };

  const handleRatingChange = (criteriaId, itemIndex, value) => {
    setRatings(prev => ({
      ...prev,
      [`${criteriaId}-${itemIndex}`]: value
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
      {/* SIDEBAR */}
      <aside className="sd-sidebar">
        <div className="sd-userCard">
          <div className="sd-avatar">👤</div>
          <div>
            <div className="sd-name">John Doe</div>
            <div className="sd-id">ID: 203290</div>
          </div>
        </div>

        <nav className="sd-nav">
          <Link className="sd-link" to="/student/dashboard">
            <span className="sd-ico">🏠</span>
            Home
          </Link>

          <Link className="sd-link sd-link--active" to="/student/evaluate">
            <span className="sd-ico">🧾</span>
            Evaluate Teacher
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
          <button
            type="button"
            className="sd-burger"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰
          </button>

          <div className="sd-topRight">
            <span className="sd-topUser">John Doe</span>
            <span className="sd-drop">▾</span>
          </div>
        </header>

        {/* CONTENT */}
        <section className="sd-content">
          <h2 className="sd-title">Faculty Evaluation</h2>
          <p className="sd-subtitle">Evaluate your instructors for this semester.</p>

          {/* Info card */}
          <div className="sd-infoCard">
            <div className="sd-infoLine" />
            <div className="sd-infoText">
              <div>Academic Year: 2025–2026 2nd Semester</div>
              <div>Please complete all evaluations before the deadline.</div>
            </div>
          </div>

          {/* Table Card */}
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((faculty) => (
                    <tr key={faculty.id}>
                      <td className="se-facultyName">{faculty.name}</td>
                      <td>{faculty.subject}</td>
                      <td>
                        <span className={`se-badge se-badge--${faculty.status}`}>
                          {faculty.status === "pending" ? "Pending" : "Submitted"}
                        </span>
                      </td>
                      <td>
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
        </section>

        {/* FOOTER */}
        <footer className="sd-footer">
          Copyright © 2026. FacultyTrack. All Rights Reserved.
        </footer>
      </main>

      {/* EVALUATION MODAL */}
      {showModal && selectedFaculty && (
        <div className="se-modal">
          <div className="se-modalOverlay" onClick={() => setShowModal(false)} />
          <div className="se-modalContent">
            <div className="se-modalHeader">
              <div>
                <h3 className="se-modalTitle">Faculty Evaluation Form</h3>
                <p className="se-modalSubtitle">
                  {selectedFaculty.name} - {selectedFaculty.subject}
                </p>
              </div>
              <button
                type="button"
                className="se-modalClose"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
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
                <label className="se-commentsLabel">
                  Additional Comments (Optional)
                </label>
                <textarea
                  className="se-commentsTextarea"
                  placeholder="Share your thoughts about this instructor..."
                  rows="4"
                />
              </div>
            </div>

            <div className="se-modalFooter">
              <button
                type="button"
                className="se-modalBtn se-modalBtn--cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="se-modalBtn se-modalBtn--submit"
                onClick={handleSubmitEvaluation}
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
