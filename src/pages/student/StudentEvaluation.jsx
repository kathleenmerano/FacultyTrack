import { useState, useEffect } from "react";
import { Search, X, List, Calendar, CheckCircle, AlertCircle, Info, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";
import StudentLayout from "./StudentLayout";

export default function StudentEvaluation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Data from API
  const [assignedFaculty, setAssignedFaculty] = useState([]);
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!currentUser || !userProfile) return;

    Promise.all([
      fetch(`${API}/get-assignments`).then(r => r.json()),
      fetch(`${API}/get-submissions/student/${currentUser.uid}`).then(r => r.json()),
      fetch(`${API}/get-criteria`).then(r => r.json()),
      fetch(`${API}/get-questions`).then(r => r.json()),
      fetch(`${API}/get-academic-years`).then(r => r.json()),
    ])
      .then(([allAssignments, submissions, criteria, questions, years]) => {
        const active = Array.isArray(years)
          ? years.find(y => (y.status || "").toLowerCase().trim() === "on-going")
          : null;
        setActiveYear(active || null);

        // Assignment fields are always: department, yearLevel, section (from AdminClassAssignment)
        // userProfile may have fallback fields depending on when the account was created
        const studentDept = userProfile.department || userProfile.dept || "";
        const studentYear = userProfile.yearLevel || userProfile.year || "";
        const studentSection = userProfile.section || "";
        const myAssignments = (Array.isArray(allAssignments) ? allAssignments : []).filter(a =>
          a.department === studentDept &&
          a.yearLevel === studentYear &&
          a.section === studentSection &&
          active &&
          a.academicYear === active.year &&
          a.semester === active.semester
        );

        const submitted = new Set((Array.isArray(submissions) ? submissions : []).map(s => s.assignmentId));
        setSubmittedIds(submitted);

        setAssignedFaculty(myAssignments.map(a => ({
          assignmentId: a.id,
          facultyId: a.facultyId,
          name: a.facultyName,
          subject: `${a.subjectCode} - ${a.subjectName}`,
          status: submitted.has(a.id) ? "submitted" : "pending",
        })));

        const enabledCriteria = (Array.isArray(criteria) ? criteria : []).filter(c => c.enabled);
        const builtCriteria = enabledCriteria.map(c => ({
          id: c.id,
          category: c.name,
          items: (Array.isArray(questions) ? questions : [])
            .filter(q => q.criteriaId === c.id)
            .sort((a, b) => a.order - b.order)
            .map(q => ({ id: q.id, text: q.text })),
        })).filter(c => c.items.length > 0);
        setEvaluationCriteria(builtCriteria);
      })
      .catch(err => console.error("Evaluation page fetch error:", err))
      .finally(() => setLoading(false));
  }, [currentUser, userProfile]);

  const dept = userProfile?.department || userProfile?.dept || "—";
  const yearLevel = userProfile?.yearLevel || userProfile?.year || "—";
  const section = userProfile?.section || "—";

  const filteredFaculty = assignedFaculty.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEvaluate = (faculty) => {
    setSelectedFaculty(faculty);
    setRatings({});
    setComment("");
    setShowModal(true);
  };

  const handleRatingChange = (questionId, value) => {
    setRatings(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedFaculty || !currentUser) return;
    if (!activeYear) {
      alert("No active evaluation period is available.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/submit-evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.uid,
          facultyId: selectedFaculty.facultyId,
          assignmentId: selectedFaculty.assignmentId,
          academicYear: activeYear.year,
          semester: activeYear.semester,
          ratings,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      const newSubmittedIds = new Set([...submittedIds, selectedFaculty.assignmentId]);
      setSubmittedIds(newSubmittedIds);
      setAssignedFaculty(prev =>
        prev.map(f => f.assignmentId === selectedFaculty.assignmentId ? { ...f, status: "submitted" } : f)
      );

      setShowModal(false);
      setSelectedFaculty(null);
      alert(`Evaluation for ${selectedFaculty.name} submitted successfully!`);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalQuestions = evaluationCriteria.reduce((sum, c) => sum + c.items.length, 0);
  const answeredQuestions = Object.keys(ratings).length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  const submittedCount = assignedFaculty.filter(f => f.status === "submitted").length;

  // endDate from DB is "YYYY-MM-DD". Treat as end-of-day to avoid UTC offset issues.
  const now = new Date();
  const endDate = activeYear?.endDate ? new Date(activeYear.endDate + "T23:59:59") : null;
  // activeYear is only set when status === "on-going", so just check it's not null + endDate
  const isEvaluationOpen =
    !loading &&
    activeYear !== null &&
    (!endDate || now <= endDate);

  return (
    <StudentLayout breadcrumb="Evaluate Teacher">
      <div className="sd-welcomeHeader">
        <div>
          <h2 className="sd-title">Faculty Evaluation</h2>
          <p className="sd-subtitle">Evaluate your instructors for this semester.</p>
        </div>
        <div className="sd-dateInfo">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Info card */}
      <div className="sd-infoCard">
        <div className="sd-infoIcon">
          <Calendar size={24} />
        </div>
        <div>
          <div className="sd-infoTitle">
            Academic Year: {activeYear ? `${activeYear.year} ${activeYear.semester}` : "—"}
          </div>
          <div className="sd-infoText">
            <strong>Your Section:</strong> {dept} {yearLevel} - {section}
          </div>
          <div className="sd-infoText">
            <strong>Evaluation Period Status:</strong>{" "}
            {loading ? "—" : isEvaluationOpen
              ? <span style={{ color: "#16a34a", fontWeight: 600 }}>Open</span>
              : <span style={{ color: "#dc2626", fontWeight: 600 }}>Closed</span>}
          </div>
          <div className="sd-infoText">
            <strong>Progress:</strong> {submittedCount}/{assignedFaculty.length} Completed
          </div>
        </div>
      </div>

      {/* Closed period banner */}
      {!loading && !isEvaluationOpen && (
        <div className="se-closedBanner">
          <AlertCircle size={22} />
          <div>
            <strong>Evaluation Period is Closed</strong>
            <p style={{ margin: "2px 0 0", fontSize: "13px", opacity: 0.85 }}>
              {activeYear
                ? `The evaluation for ${activeYear.year} ${activeYear.semester} is not currently open. Please contact the administrator.`
                : "There is no active evaluation period at this time. Please contact the administrator."}
            </p>
          </div>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="se-tableCard">
        <div className="se-tableHeader">
          <div>
            <h3 className="se-tableTitle">Your Assigned Faculty</h3>
            <p className="se-tableHint">
              You can only evaluate faculty who teach your section ({dept} {yearLevel}-{section})
            </p>
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
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</div>
          ) : (
            <table className="se-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                      {assignedFaculty.length === 0
                        ? "No faculty assigned to your section yet."
                        : "No results match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((faculty) => (
                    <tr key={faculty.assignmentId}>
                      <td className="se-facultyName">{faculty.name}</td>
                      <td>{faculty.subject}</td>
                      <td>
                        <span className={`se-badge se-badge--${faculty.status}`}>
                          {faculty.status === "pending" ? "PENDING" : "SUBMITTED"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={`se-btn ${(faculty.status === "submitted" || !isEvaluationOpen) ? "se-btn--disabled" : ""}`}
                          onClick={() => handleEvaluate(faculty)}
                          disabled={faculty.status === "submitted" || !isEvaluationOpen}
                          title={!isEvaluationOpen ? "Evaluation period is closed" : ""}
                        >
                          {faculty.status === "submitted" ? "Done" : !isEvaluationOpen ? "Closed" : "Evaluate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EVALUATION MODAL */}
      {showModal && selectedFaculty && (
        <div className="se-modal" role="dialog" aria-modal="true">
          <div className="se-modalOverlay" onClick={() => setShowModal(false)} />
          <div className="se-modalContent">
            <div className="se-modalHeader">
              <div>
                <h3 className="se-modalTitle">Faculty Evaluation Form</h3>
                <p className="se-modalSubtitle">{selectedFaculty.name} — {selectedFaculty.subject}</p>
              </div>
              <button type="button" className="se-modalClose" onClick={() => setShowModal(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="se-progressSection">
              <div className="se-progressInfo">
                <span className="se-progressLabel">Completion Progress</span>
                <span className="se-progressText">{answeredQuestions} of {totalQuestions} questions answered</span>
              </div>
              <div className="se-progressBar">
                <div className="se-progressFill" style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className="se-progressPercent">{progressPercentage}%</div>
            </div>

            <div className="se-modalBody">
              {/* Rating Scale Guide */}
              <div className="se-instructions">
                <div className="se-instructionsHeader">
                  <Info size={20} />
                  <span>Rating Scale Guide</span>
                </div>
                <div className="se-scale">
                  {[
                    { num: 5, label: "Outstanding" },
                    { num: 4, label: "Very Good" },
                    { num: 3, label: "Good" },
                    { num: 2, label: "Fair" },
                    { num: 1, label: "Poor" },
                  ].map(s => (
                    <div key={s.num} className="se-scaleItem">
                      <span className="se-scaleNum">{s.num}</span>
                      <span className="se-scaleLabel">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {evaluationCriteria.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                  <p>No questionnaire has been set up yet.</p>
                  <p style={{ fontSize: "13px", marginTop: "8px" }}>Please contact the admin to configure evaluation criteria and questions.</p>
                </div>
              ) : (
                evaluationCriteria.map((criteria) => {
                  const answeredCount = criteria.items.filter(item => ratings[item.id]).length;
                  const isComplete = answeredCount === criteria.items.length;
                  return (
                    <div key={criteria.id} className="se-criteriaCard">
                      <div className="se-criteriaCardHeader">
                        <div className="se-criteriaIconWrap">
                          <List size={20} strokeWidth={2.5} />
                        </div>
                        <div className="se-criteriaHeaderContent">
                          <h4 className="se-criteriaTitle">{criteria.category}</h4>
                          <p className="se-criteriaSubtitle">
                            {answeredCount} of {criteria.items.length} questions answered
                            {isComplete && <span className="se-completeBadge">✓ Complete</span>}
                          </p>
                        </div>
                      </div>

                      <div className="se-criteriaItems">
                        {criteria.items.map((item) => (
                          <div key={item.id} className="se-criteriaItem">
                            <div className="se-criteriaItemHeader">
                              <div className="se-criteriaText">{item.text}</div>
                            </div>
                            <div className="se-ratingButtons">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  className={`se-ratingBtn ${ratings[item.id] === rating ? "se-ratingBtn--active" : ""}`}
                                  onClick={() => handleRatingChange(item.id, rating)}
                                  title={rating === 5 ? "Outstanding" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                                >
                                  {rating}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Comments */}
              <div className="se-commentsCard">
                <div className="se-commentsHeader">
                  <MessageSquare size={18} />
                  <label className="se-commentsLabel">Additional Comments (Optional)</label>
                </div>
                <textarea
                  className="se-commentsTextarea"
                  placeholder="Share your thoughts, suggestions, or feedback about this instructor's teaching performance..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>

            <div className="se-modalFooter">
              <button type="button" className="se-modalBtn se-modalBtn--cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="se-modalBtn se-modalBtn--submit"
                onClick={handleSubmitEvaluation}
                disabled={answeredQuestions < totalQuestions || submitting}
              >
                {submitting ? "Submitting..." : `Submit Evaluation (${progressPercentage}%)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
