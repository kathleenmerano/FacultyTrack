import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminQuestionnaire() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Available criteria - should be synced with Criteria page
  const [availableCriteria] = useState([
    { id: 1, name: "Starting Behaviors", checked: true },
    { id: 2, name: "Classroom Management", checked: true },
    { id: 3, name: "Preparation", checked: false },
    { id: 4, name: "Engagement", checked: false },
  ]);

  // Questions grouped by criteria
  const [questionsByCriteria, setQuestionsByCriteria] = useState({
    1: [
      { id: 1, text: "How effective is the instructor in starting the class?", order: 1 },
      { id: 2, text: "Does the instructor arrive on time?", order: 2 },
    ],
    2: [
      { id: 3, text: "How well does the instructor manage the classroom?", order: 1 },
    ],
  });

  const [formData, setFormData] = useState({
    criteriaId: "",
    question: ""
  });

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [setSelectedCriteria] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle form submission
  const handleSave = () => {
    if (!formData.criteriaId || !formData.question.trim()) {
      showToast("Please select a criteria and enter a question", "error");
      return;
    }

    const criteriaId = parseInt(formData.criteriaId);

    if (editingQuestion) {
      // Update existing question
      setQuestionsByCriteria(prev => ({
        ...prev,
        [criteriaId]: prev[criteriaId].map(q =>
          q.id === editingQuestion.id ? { ...q, text: formData.question } : q
        )
      }));
      showToast("Question updated successfully!", "success");
      setEditingQuestion(null);
    } else {
      // Add new question
      const existingQuestions = questionsByCriteria[criteriaId] || [];
      const newQuestion = {
        id: Date.now(),
        text: formData.question,
        order: existingQuestions.length + 1
      };
      
      setQuestionsByCriteria(prev => ({
        ...prev,
        [criteriaId]: [...existingQuestions, newQuestion]
      }));
      showToast("Question added successfully!", "success");
    }

    // Reset form
    setFormData({ criteriaId: "", question: "" });
    setSelectedCriteria(null);
  };

  // Handle reset
  const handleReset = () => {
    setFormData({ criteriaId: "", question: "" });
    setEditingQuestion(null);
    setSelectedCriteria(null);
  };

  // Handle edit question
  const handleEditQuestion = (criteriaId, question) => {
    setFormData({
      criteriaId: criteriaId.toString(),
      question: question.text
    });
    setEditingQuestion(question);
    setSelectedCriteria(criteriaId);
  };

  // Handle delete question
  const handleDeleteQuestion = (criteriaId, questionId) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuestionsByCriteria(prev => ({
        ...prev,
        [criteriaId]: prev[criteriaId].filter(q => q.id !== questionId)
      }));
      showToast("Question deleted successfully", "success");
    }
  };

  // Handle reorder questions
  const moveQuestion = (criteriaId, questionId, direction) => {
    const questions = [...(questionsByCriteria[criteriaId] || [])];
    const index = questions.findIndex(q => q.id === questionId);
    
    if (direction === 'up' && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    } else {
      return; // Can't move
    }

    // Update order numbers
    questions.forEach((q, idx) => {
      q.order = idx + 1;
    });

    setQuestionsByCriteria(prev => ({
      ...prev,
      [criteriaId]: questions
    }));
    showToast("Question reordered", "info");
  };

  // Handle criteria selection change
  const handleCriteriaChange = (e) => {
    const criteriaId = e.target.value;
    setFormData({ ...formData, criteriaId });
    setSelectedCriteria(criteriaId ? parseInt(criteriaId) : null);
  };

  // Get enabled criteria only
  const enabledCriteria = availableCriteria.filter(c => c.checked);

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
          <button className="ad-link ad-link--active" type="button" onClick={() => navigate('/admin/questionnaire')}>
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
              <span>Manage Questionnaire</span>
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
          {/* INFO CARD */}
          <div className="ad-infoCard">
            <div className="ad-infoIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <div className="ad-infoTitle">Questionnaire Management</div>
              <div className="ad-infoText">
                Questions are linked to <strong>Evaluation Criteria</strong>. Only enabled criteria will appear in the dropdown.
              </div>
              <div className="ad-infoText">
                You can add, edit, delete, and reorder questions for each criterion below.
              </div>
            </div>
          </div>

          {/* SPLIT PANEL LAYOUT */}
          <div className="ad-splitLayout">
            {/* LEFT PANEL - FORM */}
            <div className="ad-splitPanel ad-splitPanel--form">
              <div className="ad-panelHeader">
                <h3 className="ad-panelTitle">{editingQuestion ? 'Edit' : 'Add'} Question</h3>
              </div>
              <div className="ad-panelBody">
                <div className="ad-formGroup">
                  <label className="ad-label">Evaluation Criteria <span style={{color: '#dc2626'}}>*</span></label>
                  <select 
                    className="ad-input"
                    value={formData.criteriaId}
                    onChange={handleCriteriaChange}
                  >
                    <option value="">Select criteria</option>
                    {enabledCriteria.map(criteria => (
                      <option key={criteria.id} value={criteria.id}>
                        {criteria.name}
                      </option>
                    ))}
                  </select>
                  <small style={{fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block'}}>
                    {enabledCriteria.length === 0 ? 
                      'No enabled criteria. Please enable criteria from the Criteria page.' :
                      'Select which criteria this question belongs to'
                    }
                  </small>
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Question <span style={{color: '#dc2626'}}>*</span></label>
                  <textarea
                    className="ad-textarea"
                    rows="4"
                    placeholder="Enter evaluation question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  />
                  <small style={{fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block'}}>
                    Write a clear and specific question for evaluation
                  </small>
                </div>
                <div className="ad-formActions">
                  <button className="ad-btnPrimary" onClick={handleSave}>
                    {editingQuestion ? 'Update' : 'Save'}
                  </button>
                  <button className="ad-btnSecondary" onClick={handleReset}>Reset</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - CRITERIA & QUESTIONS */}
            <div className="ad-splitPanel ad-splitPanel--list">
              <div className="ad-panelHeader">
                <h3 className="ad-panelTitle">Questions by Criteria</h3>
              </div>
              <div className="ad-panelBody" style={{maxHeight: '600px', overflowY: 'auto'}}>
                {enabledCriteria.length === 0 ? (
                  <div className="ad-emptyState">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <p className="ad-emptyText">No enabled criteria</p>
                    <p className="ad-emptySubtext">Please enable criteria from the Criteria page first</p>
                  </div>
                ) : (
                  enabledCriteria.map(criteria => {
                    const questions = questionsByCriteria[criteria.id] || [];
                    return (
                      <div key={criteria.id} className="ad-criteriaSection">
                        <div className="ad-criteriaSectionHeader">
                          <div className="ad-criteriaBadge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11l3 3L22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <span>{criteria.name}</span>
                          </div>
                          <span className="ad-questionCount">{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
                        </div>
                        
                        {questions.length === 0 ? (
                          <div className="ad-noQuestions">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <p>No questions added yet</p>
                          </div>
                        ) : (
                          <div className="ad-questionsList">
                            {questions.map((question, index) => (
                              <div key={question.id} className="ad-questionItem">
                                <div className="ad-questionOrder">
                                  {question.order}
                                </div>
                                <div className="ad-questionContent">
                                  <p className="ad-questionText">{question.text}</p>
                                </div>
                                <div className="ad-questionActions">
                                  <button
                                    className="ad-orderBtn"
                                    title="Move up"
                                    onClick={() => moveQuestion(criteria.id, question.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                  </button>
                                  <button
                                    className="ad-orderBtn"
                                    title="Move down"
                                    onClick={() => moveQuestion(criteria.id, question.id, 'down')}
                                    disabled={index === questions.length - 1}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                  <button
                                    className="ad-iconBtn ad-iconBtn--edit"
                                    title="Edit"
                                    onClick={() => handleEditQuestion(criteria.id, question)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="ad-iconBtn ad-iconBtn--delete"
                                    title="Delete"
                                    onClick={() => handleDeleteQuestion(criteria.id, question.id)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      <line x1="10" y1="11" x2="10" y2="17" />
                                      <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RATING LEGEND SECTION */}
          <div className="ad-tableCard" style={{ marginTop: '24px' }}>
            <div className="ad-panelHeader">
              <h3 className="ad-panelTitle">Rating Legend for Academic Year 2025-2026 2nd Semester</h3>
            </div>
            <div className="ad-panelBody">
              <div className="ad-ratingLegend">
                <div className="ad-ratingItem">
                  <div className="ad-ratingScore">5</div>
                  <div className="ad-ratingLabel">Strongly Agree</div>
                </div>
                <div className="ad-ratingItem">
                  <div className="ad-ratingScore">4</div>
                  <div className="ad-ratingLabel">Agree</div>
                </div>
                <div className="ad-ratingItem">
                  <div className="ad-ratingScore">3</div>
                  <div className="ad-ratingLabel">Neutral</div>
                </div>
                <div className="ad-ratingItem">
                  <div className="ad-ratingScore">2</div>
                  <div className="ad-ratingLabel">Disagree</div>
                </div>
                <div className="ad-ratingItem">
                  <div className="ad-ratingScore">1</div>
                  <div className="ad-ratingLabel">Strongly Disagree</div>
                </div>
              </div>
            </div>
          </div>
        </section>
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