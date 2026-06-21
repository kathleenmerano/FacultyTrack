import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminQuestionnaire() {
  const [availableCriteria, setAvailableCriteria] = useState([]);
  const [questionsByCriteria, setQuestionsByCriteria] = useState({});
  const [formData, setFormData] = useState({ criteriaId: "", question: "" });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchData = async () => {
    try {
      const [criteriaRes, questionsRes] = await Promise.all([
        fetch(`${API}/get-criteria`).then(r => r.json()),
        fetch(`${API}/get-questions`).then(r => r.json()),
      ]);
      setAvailableCriteria(criteriaRes);

      // Group questions by criteriaId
      const grouped = {};
      criteriaRes.forEach(c => { grouped[c.id] = []; });
      questionsRes.forEach(q => {
        if (!grouped[q.criteriaId]) grouped[q.criteriaId] = [];
        grouped[q.criteriaId].push(q);
      });
      setQuestionsByCriteria(grouped);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!formData.criteriaId || !formData.question.trim()) {
      showToast("Please select a criteria and enter a question", "error");
      return;
    }
    const criteriaId = formData.criteriaId;
    try {
      if (editingQuestion) {
        await fetch(`${API}/update-question/${editingQuestion.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formData.question }),
        });
        setQuestionsByCriteria(prev => ({
          ...prev,
          [criteriaId]: prev[criteriaId].map(q =>
            q.id === editingQuestion.id ? { ...q, text: formData.question } : q
          ),
        }));
        showToast("Question updated successfully!", "success");
        setEditingQuestion(null);
      } else {
        const existingQuestions = questionsByCriteria[criteriaId] || [];
        const order = existingQuestions.length + 1;
        const res = await fetch(`${API}/create-question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ criteriaId, text: formData.question, order }),
        });
        const data = await res.json();
        const newQuestion = { id: data.id, criteriaId, text: formData.question, order };
        setQuestionsByCriteria(prev => ({
          ...prev,
          [criteriaId]: [...(prev[criteriaId] || []), newQuestion],
        }));
        showToast("Question added successfully!", "success");
      }
      setFormData({ criteriaId: "", question: "" });
    } catch {
      showToast("Error saving question", "error");
    }
  };

  const handleReset = () => {
    setFormData({ criteriaId: "", question: "" });
    setEditingQuestion(null);
  };

  const handleEditQuestion = (criteriaId, question) => {
    setFormData({ criteriaId, question: question.text });
    setEditingQuestion(question);
  };

  const handleDeleteQuestion = async (criteriaId, questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await fetch(`${API}/delete-question/${questionId}`, { method: "DELETE" });
      setQuestionsByCriteria(prev => ({
        ...prev,
        [criteriaId]: prev[criteriaId].filter(q => q.id !== questionId),
      }));
      showToast("Question deleted successfully", "success");
    } catch {
      showToast("Error deleting question", "error");
    }
  };

  const moveQuestion = async (criteriaId, questionId, direction) => {
    const qs = [...(questionsByCriteria[criteriaId] || [])];
    const idx = qs.findIndex(q => q.id === questionId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= qs.length) return;

    const a = { ...qs[idx] };
    const b = { ...qs[swapIdx] };
    // Swap orders
    const tempOrder = a.order;
    a.order = b.order;
    b.order = tempOrder;
    qs[idx] = b;
    qs[swapIdx] = a;

    setQuestionsByCriteria(prev => ({ ...prev, [criteriaId]: qs }));
    try {
      await Promise.all([
        fetch(`${API}/update-question/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
        fetch(`${API}/update-question/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
      ]);
      showToast("Question reordered", "info");
    } catch {
      showToast("Error reordering", "error");
    }
  };

  const enabledCriteria = availableCriteria.filter(c => c.enabled);

  return (
    <AdminLayout title="Manage Questionnaire">
      <section className="ad-content">
        <div className="ad-infoCard">
          <div className="ad-infoIcon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <div className="ad-infoTitle">Questionnaire Management</div>
            <div className="ad-infoText">Questions are linked to <strong>Evaluation Criteria</strong>. Only enabled criteria will appear in the dropdown.</div>
            <div className="ad-infoText">Enable criteria first from the <strong>Evaluation Criteria</strong> page.</div>
          </div>
        </div>

        <div className="ad-splitLayout">
          {/* LEFT PANEL - FORM */}
          <div className="ad-splitPanel ad-splitPanel--form">
            <div className="ad-panelHeader">
              <h3 className="ad-panelTitle">{editingQuestion ? "Edit" : "Add"} Question</h3>
            </div>
            <div className="ad-panelBody">
              <div className="ad-formGroup">
                <label className="ad-label">Evaluation Criteria <span style={{ color: "#dc2626" }}>*</span></label>
                <select
                  className="ad-input"
                  value={formData.criteriaId}
                  onChange={(e) => setFormData({ ...formData, criteriaId: e.target.value })}
                >
                  <option value="">Select criteria</option>
                  {enabledCriteria.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <small style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                  {enabledCriteria.length === 0
                    ? "No enabled criteria. Please enable criteria from the Criteria page."
                    : "Select which criteria this question belongs to"}
                </small>
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Question <span style={{ color: "#dc2626" }}>*</span></label>
                <textarea
                  className="ad-textarea"
                  rows="4"
                  placeholder="Enter evaluation question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>
              <div className="ad-formActions">
                <button className="ad-btnPrimary" onClick={handleSave}>{editingQuestion ? "Update" : "Save"}</button>
                <button className="ad-btnSecondary" onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="ad-splitPanel ad-splitPanel--list">
            <div className="ad-panelHeader">
              <h3 className="ad-panelTitle">Questions by Criteria</h3>
            </div>
            <div className="ad-panelBody" style={{ maxHeight: "600px", overflowY: "auto" }}>
              {loading ? (
                <div className="ad-emptyState"><p className="ad-emptyText">Loading...</p></div>
              ) : enabledCriteria.length === 0 ? (
                <div className="ad-emptyState">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          <span>{criteria.name}</span>
                        </div>
                        <span className="ad-questionCount">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
                      </div>

                      {questions.length === 0 ? (
                        <div className="ad-noQuestions">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <p>No questions added yet</p>
                        </div>
                      ) : (
                        <div className="ad-questionsList">
                          {questions.map((question, index) => (
                            <div key={question.id} className="ad-questionItem">
                              <div className="ad-questionOrder">{question.order}</div>
                              <div className="ad-questionContent">
                                <p className="ad-questionText">{question.text}</p>
                              </div>
                              <div className="ad-questionActions">
                                <button className="ad-orderBtn" title="Move up" onClick={() => moveQuestion(criteria.id, question.id, "up")} disabled={index === 0}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                                </button>
                                <button className="ad-orderBtn" title="Move down" onClick={() => moveQuestion(criteria.id, question.id, "down")} disabled={index === questions.length - 1}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </button>
                                <button className="ad-iconBtn ad-iconBtn--edit" title="Edit" onClick={() => handleEditQuestion(criteria.id, question)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                </button>
                                <button className="ad-iconBtn ad-iconBtn--delete" title="Delete" onClick={() => handleDeleteQuestion(criteria.id, question.id)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
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

        {/* RATING LEGEND */}
        <div className="ad-tableCard" style={{ marginTop: "24px" }}>
          <div className="ad-panelHeader">
            <h3 className="ad-panelTitle">Rating Scale</h3>
          </div>
          <div className="ad-panelBody">
            <div className="ad-ratingLegend">
              {[
                { score: 5, label: "Outstanding" },
                { score: 4, label: "Very Good" },
                { score: 3, label: "Good" },
                { score: 2, label: "Fair" },
                { score: 1, label: "Poor" },
              ].map(item => (
                <div key={item.score} className="ad-ratingItem">
                  <div className="ad-ratingScore">{item.score}</div>
                  <div className="ad-ratingLabel">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {toast.show && (
        <div className={`ad-toast ad-toast--${toast.type}`}>
          <div className="ad-toastIcon">
            {toast.type === "success" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
            {toast.type === "error" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
            {toast.type === "info" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
          </div>
          <span className="ad-toastMessage">{toast.message}</span>
        </div>
      )}
    </AdminLayout>
  );
}
