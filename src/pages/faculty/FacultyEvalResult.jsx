import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";
import FacultyLayout from "./FacultyLayout";

const getPerformanceLabel = (rating) => {
  if (rating >= 4.5) return "Outstanding";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  return "Needs Improvement";
};

const getPerformanceColor = (rating) => {
  if (rating >= 4.5) return "#16a34a"; // Green-600
  if (rating >= 4.0) return "#22c55e"; // Green-500
  if (rating >= 3.5) return "#10b981"; // Emerald-500 (Greenish)
  if (rating >= 3.0) return "#f59e0b"; // Orange-500
  return "#ef4444"; // Red-500
};

const generateRemarks = (rating) => {
  if (rating >= 4.5) return "Excellent teaching performance. Strong commitment to student learning and professional development.";
  if (rating >= 4.0) return "Very good teaching performance. Demonstrates dedication to student learning with room for further growth.";
  if (rating >= 3.0) return "Good teaching performance. Continue developing teaching methods and engagement strategies.";
  return "Teaching performance needs improvement. Professional development activities are recommended.";
};

const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

function buildEvaluationPeriods(evaluations, questions, criteria) {
  const byPeriod = {};
  evaluations.forEach(ev => {
    const key = `${ev.academicYear}__${ev.semester}`;
    if (!byPeriod[key]) byPeriod[key] = { academicYear: ev.academicYear, semester: ev.semester, evals: [] };
    byPeriod[key].evals.push(ev);
  });

  const periods = {};
  for (const [key, { academicYear, semester, evals }] of Object.entries(byPeriod)) {
    const qScores = {};
    evals.forEach(ev => {
      Object.entries(ev.ratings || {}).forEach(([qId, score]) => {
        if (!qScores[qId]) qScores[qId] = [];
        qScores[qId].push(Number(score));
      });
    });

    const enabledCriteria = criteria.filter(c => c.enabled);
    const categories = enabledCriteria.map(c => {
      const cQuestions = questions.filter(q => q.criteriaId === c.id);
      const items = cQuestions.map(q => ({
        criterion: q.text,
        rating: avg(qScores[q.id] || []),
      }));
      return { id: c.id, name: c.name, rating: avg(items.map(i => i.rating)), items };
    }).filter(c => c.items.length > 0);

    const overallRating = avg(categories.map(c => c.rating));
    periods[key] = {
      periodLabel: `Academic Year ${academicYear} - ${semester}`,
      periodShort: `${academicYear} ${semester}`,
      overallRating,
      totalResponses: evals.length,
      uniqueStudents: new Set(evaluations.filter(e => e.academicYear === academicYear && e.semester === semester).map(e => e.studentId)).size,
      performanceSummary: getPerformanceLabel(overallRating),
      remarks: generateRemarks(overallRating),
      categories,
    };
  }
  return periods;
}

export default function FacultyEvalResult() {
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [evaluationPeriods, setEvaluationPeriods] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();

  // Close period dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodDropdownOpen && !e.target.closest(".fd-periodSelector")) {
        setPeriodDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [periodDropdownOpen]);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      fetch(`${API}/get-evaluations/faculty/${currentUser.uid}`).then(r => r.json()),
      fetch(`${API}/get-questions`).then(r => r.json()),
      fetch(`${API}/get-criteria`).then(r => r.json()),
    ])
      .then(([evals, questions, criteria]) => {
        const periods = buildEvaluationPeriods(
          Array.isArray(evals) ? evals : [],
          Array.isArray(questions) ? questions : [],
          Array.isArray(criteria) ? criteria : []
        );
        setEvaluationPeriods(periods);
        const keys = Object.keys(periods);
        if (keys.length > 0) setSelectedPeriod(keys[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const displayName = userProfile?.fullName || "Faculty";
  const evaluationData = selectedPeriod ? evaluationPeriods[selectedPeriod] : null;

  const getRatingTrend = () => {
    if (!selectedPeriod || !evaluationData) return null;
    const keys = Object.keys(evaluationPeriods);
    const idx = keys.indexOf(selectedPeriod);
    if (idx < keys.length - 1) {
      const prev = evaluationPeriods[keys[idx + 1]];
      return evaluationData.overallRating - prev.overallRating;
    }
    return null;
  };
  const ratingTrend = getRatingTrend();

  // No evaluations state
  if (!loading && Object.keys(evaluationPeriods).length === 0) {
    return (
      <FacultyLayout breadcrumb="Evaluation Results">
        <section className="fd-content">
          <div className="fd-welcomeHeader">
            <div>
              <h2 className="fd-title">Evaluation Results</h2>
              <p className="fd-subtitle">{displayName}</p>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ marginBottom: "16px" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p style={{ fontSize: "16px", fontWeight: 500 }}>No evaluation results yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>Your results will appear here once students complete their evaluations.</p>
          </div>
        </section>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout breadcrumb="Evaluation Results">
      <section className="fd-content">
        {loading || !evaluationData ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#6b7280" }}>Loading evaluation data...</div>
        ) : (
          <>
            <div className="fd-welcomeHeader">
              <div>
                <h2 className="fd-title">Evaluation Results</h2>
                <p className="fd-subtitle">{displayName}</p>
              </div>
              <div className="fd-summaryBadge" style={{ backgroundColor: getPerformanceColor(evaluationData.overallRating) }}>
                <div className="fd-summaryNum" style={{ color: "#fff" }}>{evaluationData.overallRating.toFixed(1)}</div>
                <div className="fd-summaryLabel" style={{ color: "rgba(255,255,255,0.9)" }}>Overall Rating</div>
                {ratingTrend !== null && (
                  <div className="fd-trendIndicator" style={{ color: "#fff", opacity: 0.9 }}>
                    {ratingTrend > 0 ? "↑" : ratingTrend < 0 ? "↓" : "→"} {Math.abs(ratingTrend).toFixed(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Period Selector */}
            <div className="fd-periodSelectorCard">
              <div className="fd-periodSelectorWrapper">
                <label className="fd-periodSelectorLabel">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Academic Period:
                </label>
                <div className="fd-periodSelector">
                  <button type="button" className="fd-periodSelectorBtn" onClick={() => setPeriodDropdownOpen(v => !v)}>
                    <span className="fd-periodSelectorText">{evaluationData.periodLabel}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`fd-periodSelectorIcon ${periodDropdownOpen ? "fd-periodSelectorIcon--open" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {periodDropdownOpen && (
                    <div className="fd-periodDropdownMenu">
                      {Object.entries(evaluationPeriods).map(([key, period]) => (
                        <button key={key} type="button"
                          className={`fd-periodDropdownItem ${selectedPeriod === key ? "fd-periodDropdownItem--active" : ""}`}
                          onClick={() => { setSelectedPeriod(key); setPeriodDropdownOpen(false); }}>
                          <div className="fd-periodDropdownItemText">
                            <div className="fd-periodDropdownItemTitle">{period.periodLabel}</div>
                            <div className="fd-periodDropdownItemMeta">Rating: {period.overallRating.toFixed(1)} • {period.totalResponses} responses</div>
                          </div>
                          {selectedPeriod === key && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="fd-perfGrid">
              {/* Card 1: Overall Rating */}
              <div className="fd-perfMetric fd-card--green">
                <div className="fd-metricIcon fd-icon--yellow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">OVERALL RATING</div>
                  <div className="fd-metricMain">
                    <span className="fd-metricValue">{evaluationData.overallRating.toFixed(1)}</span>
                    <span className="fd-metricSlash">/ 5.0</span>
                  </div>
                  <div className="fd-metricSubtext" style={{ color: "#22c55e", fontWeight: "700" }}>{evaluationData.performanceSummary}</div>
                </div>
              </div>

              {/* Card 2: Responses */}
              <div className="fd-perfMetric fd-card--blue">
                <div className="fd-metricIcon fd-icon--blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">STUDENTS EVALUATED</div>
                  <div className="fd-metricValue">{evaluationData.uniqueStudents}</div>
                  <div className="fd-metricSubtext">{evaluationData.totalResponses} forms submitted</div>
                </div>
              </div>

              {evaluationData.categories.length > 0 && (() => {
                const sorted = [...evaluationData.categories].sort((a, b) => b.rating - a.rating);
                return (
                  <>
                    {/* Card 3: Highest Category */}
                    <div className="fd-perfMetric fd-card--emerald">
                      <div className="fd-metricIcon fd-icon--emerald">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" /><polyline points="17 6 23 6 23 12" />
                        </svg>
                      </div>
                      <div className="fd-metricContent">
                        <div className="fd-metricLabel">HIGHEST CATEGORY</div>
                        <div className="fd-metricValue fd-metricValue--small">{sorted[0].name}</div>
                        <div className="fd-metricSubtext">{sorted[0].rating.toFixed(1)} avg rating</div>
                      </div>
                    </div>

                    {/* Card 4: Status */}
                    <div className="fd-perfMetric fd-card--purple">
                      <div className="fd-metricIcon fd-icon--purple">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div className="fd-metricContent">
                        <div className="fd-metricLabel">STATUS</div>
                        <div className="fd-metricValue fd-metricValue--small">{evaluationData.performanceSummary}</div>
                        <div className="fd-metricSubtext">highly recommended</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Criteria Summary Table */}
            <div className="fd-tableCard" style={{ padding: 0, overflow: "hidden" }}>
              <div className="fd-tableHeader" style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <h3 className="fd-tableTitle" style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Criteria Summary
                </h3>
                <span className="fd-criteriaPillMain">
                  {evaluationData.categories.length} criteria
                </span>
              </div>
              <div className="fd-tableWrap">
                <table className="fd-table">
                  <thead className="fd-tableDarkHead">
                    <tr>
                      <th style={{ width: "35%", backgroundColor: "#0f172a", color: "#fff" }}>CRITERIA</th>
                      <th className="fd-thCenter" style={{ backgroundColor: "#0f172a", color: "#fff" }}>AVG RATING</th>
                      <th className="fd-thCenter" style={{ backgroundColor: "#0f172a", color: "#fff" }}>PERFORMANCE</th>
                      <th className="fd-thCenter" style={{ backgroundColor: "#0f172a", color: "#fff" }}>PROGRESS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationData.categories.map(category => (
                      <tr key={category.id}>
                        <td className="fd-tdCriteria" style={{ padding: "16px 24px" }}>
                          <div className="fd-criteriaName" style={{ fontSize: "14px", fontWeight: "700" }}>{category.name}</div>
                          <div className="fd-itemCountSubtext" style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                            {category.items.length} items
                          </div>
                        </td>
                        <td className="fd-tdRating" style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <div className="fd-ratingDisplay" style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "2px" }}>
                            <span className="fd-ratingValue" style={{ 
                              fontSize: "20px",
                              fontWeight: "800",
                              color: getPerformanceColor(category.rating) 
                            }}>
                              {category.rating.toFixed(1)}
                            </span>
                            <span className="fd-ratingSlashSub" style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "500" }}>/ 5</span>
                          </div>
                        </td>
                        <td className="fd-tdStatus" style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <span className="fd-perfPillSub" style={{ 
                            backgroundColor: `${getPerformanceColor(category.rating)}15`,
                            color: getPerformanceColor(category.rating),
                            padding: "6px 16px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-block"
                          }}>
                            {getPerformanceLabel(category.rating)}
                          </span>
                        </td>
                        <td className="fd-tdProgress" style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <div className="fd-ratingBar" style={{ width: "120px", height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden", margin: "0 auto" }}>
                            <div className="fd-ratingFill" style={{ 
                              width: `${(category.rating / 5) * 100}%`, 
                              height: "100%",
                              backgroundColor: getPerformanceColor(category.rating),
                              borderRadius: "999px"
                            }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="fd-remarksCard">
              <div className="fd-remarksHeader"><h3 className="fd-remarksTitle">Remarks</h3></div>
              <div className="fd-remarksContent"><p className="fd-remarksText">{evaluationData.remarks}</p></div>
            </div>

            {/* Performance Summary */}
            <div className="fd-perfSummaryCard">
              <div className="fd-perfHeader">
                <div className="fd-perfTitleSection">
                  <h3 className="fd-perfTitle">Category Breakdown</h3>
                  <p className="fd-perfSubtitle">{evaluationData.periodShort}</p>
                </div>
                <div className="fd-perfBadge" style={{ backgroundColor: getPerformanceColor(evaluationData.overallRating) }}>
                  <div className="fd-perfBadgeIcon">★</div>
                  <div className="fd-perfBadgeLabel">{evaluationData.performanceSummary}</div>
                </div>
              </div>

              <div className="fd-perfCategoryBreakdown" style={{ marginTop: 0 }}>
                <div className="fd-categoryBars">
                  {evaluationData.categories.map(category => (
                    <div key={category.id} className="fd-categoryBar">
                      <div className="fd-barLabel">
                        <span className="fd-barName">{category.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="fd-barPerformance" style={{ color: getPerformanceColor(category.rating), fontSize: "11px", fontWeight: "700" }}>{getPerformanceLabel(category.rating)}</span>
                          <span className="fd-barScore">{category.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="fd-barContainer">
                        <div className="fd-barProgress" style={{ width: `${(category.rating / 5) * 100}%`, backgroundColor: getPerformanceColor(category.rating) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="fd-detailsCard">
              <div className="fd-detailsHeader"><h3 className="fd-detailsTitle">Detailed Breakdown by Criteria</h3></div>
              {evaluationData.categories.map(category => (
                <div key={category.id} className="fd-categorySection">
                  <div className="fd-categoryHead">
                    <h4 className="fd-categoryName">{category.name}</h4>
                    <div className="fd-categoryAvg">Average: {category.rating.toFixed(1)} / 5.0</div>
                  </div>
                  <div className="fd-itemsList">
                    {category.items.map((item, index) => (
                      <div key={index} className="fd-itemRow">
                        <div className="fd-itemText">{item.criterion}</div>
                        <div className="fd-itemRating">
                          <span className="fd-itemValue">{item.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </FacultyLayout>
  );
}
