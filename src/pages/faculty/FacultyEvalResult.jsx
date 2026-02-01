import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FacultyEvaluations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-2026-2nd");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Close period dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodDropdownOpen && !event.target.closest('.fd-periodSelector')) {
        setPeriodDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [periodDropdownOpen]);

  // Mock evaluation data for multiple academic periods
  const evaluationPeriods = {
    "2025-2026-2nd": {
      periodLabel: "Academic Year 2025-2026 - 2nd Semester",
      periodShort: "2025-2026 2nd Sem",
      overallRating: 4.7,
      totalResponses: 34,
      remarks: "Excellent teaching performance. Strong subject matter expertise and good classroom management. Students appreciate the clear explanations and engaging teaching style.",
      performanceSummary: "Outstanding",
      categories: [
        {
          id: 1,
          name: "Teaching Effectiveness",
          rating: 4.8,
          items: [
            { criterion: "Demonstrates mastery of the subject matter", rating: 4.9 },
            { criterion: "Explains concepts clearly and effectively", rating: 4.7 },
            { criterion: "Uses appropriate teaching methods and materials", rating: 4.8 },
            { criterion: "Encourages student participation and engagement", rating: 4.7 },
          ],
        },
        {
          id: 2,
          name: "Classroom Management",
          rating: 4.6,
          items: [
            { criterion: "Maintains discipline and order in the classroom", rating: 4.5 },
            { criterion: "Uses class time efficiently", rating: 4.7 },
            { criterion: "Starts and ends classes on time", rating: 4.8 },
            { criterion: "Creates a positive learning environment", rating: 4.6 },
          ],
        },
        {
          id: 3,
          name: "Assessment & Feedback",
          rating: 4.7,
          items: [
            { criterion: "Provides fair and timely evaluation of student work", rating: 4.6 },
            { criterion: "Gives constructive feedback", rating: 4.7 },
            { criterion: "Returns graded work promptly", rating: 4.8 },
            { criterion: "Makes grading criteria clear", rating: 4.7 },
          ],
        },
        {
          id: 4,
          name: "Professional Behavior",
          rating: 4.9,
          items: [
            { criterion: "Shows respect for students", rating: 5.0 },
            { criterion: "Is accessible during consultation hours", rating: 4.8 },
            { criterion: "Demonstrates professionalism", rating: 4.9 },
            { criterion: "Serves as a positive role model", rating: 4.9 },
          ],
        },
      ],
    },
    "2025-2026-1st": {
      periodLabel: "Academic Year 2025-2026 - 1st Semester",
      periodShort: "2025-2026 1st Sem",
      overallRating: 4.5,
      totalResponses: 31,
      remarks: "Very good performance overall. Shows strong commitment to teaching excellence. Some areas for improvement in time management and assessment feedback.",
      performanceSummary: "Excellent",
      categories: [
        {
          id: 1,
          name: "Teaching Effectiveness",
          rating: 4.6,
          items: [
            { criterion: "Demonstrates mastery of the subject matter", rating: 4.7 },
            { criterion: "Explains concepts clearly and effectively", rating: 4.5 },
            { criterion: "Uses appropriate teaching methods and materials", rating: 4.6 },
            { criterion: "Encourages student participation and engagement", rating: 4.6 },
          ],
        },
        {
          id: 2,
          name: "Classroom Management",
          rating: 4.4,
          items: [
            { criterion: "Maintains discipline and order in the classroom", rating: 4.3 },
            { criterion: "Uses class time efficiently", rating: 4.4 },
            { criterion: "Starts and ends classes on time", rating: 4.5 },
            { criterion: "Creates a positive learning environment", rating: 4.4 },
          ],
        },
        {
          id: 3,
          name: "Assessment & Feedback",
          rating: 4.3,
          items: [
            { criterion: "Provides fair and timely evaluation of student work", rating: 4.2 },
            { criterion: "Gives constructive feedback", rating: 4.3 },
            { criterion: "Returns graded work promptly", rating: 4.4 },
            { criterion: "Makes grading criteria clear", rating: 4.3 },
          ],
        },
        {
          id: 4,
          name: "Professional Behavior",
          rating: 4.7,
          items: [
            { criterion: "Shows respect for students", rating: 4.8 },
            { criterion: "Is accessible during consultation hours", rating: 4.6 },
            { criterion: "Demonstrates professionalism", rating: 4.7 },
            { criterion: "Serves as a positive role model", rating: 4.7 },
          ],
        },
      ],
    },
    "2024-2025-2nd": {
      periodLabel: "Academic Year 2024-2025 - 2nd Semester",
      periodShort: "2024-2025 2nd Sem",
      overallRating: 4.4,
      totalResponses: 29,
      remarks: "Good teaching performance with consistent results. Faculty member shows dedication to student learning. Continue developing innovative teaching methods.",
      performanceSummary: "Very Good",
      categories: [
        {
          id: 1,
          name: "Teaching Effectiveness",
          rating: 4.5,
          items: [
            { criterion: "Demonstrates mastery of the subject matter", rating: 4.6 },
            { criterion: "Explains concepts clearly and effectively", rating: 4.4 },
            { criterion: "Uses appropriate teaching methods and materials", rating: 4.5 },
            { criterion: "Encourages student participation and engagement", rating: 4.5 },
          ],
        },
        {
          id: 2,
          name: "Classroom Management",
          rating: 4.3,
          items: [
            { criterion: "Maintains discipline and order in the classroom", rating: 4.2 },
            { criterion: "Uses class time efficiently", rating: 4.3 },
            { criterion: "Starts and ends classes on time", rating: 4.4 },
            { criterion: "Creates a positive learning environment", rating: 4.3 },
          ],
        },
        {
          id: 3,
          name: "Assessment & Feedback",
          rating: 4.2,
          items: [
            { criterion: "Provides fair and timely evaluation of student work", rating: 4.1 },
            { criterion: "Gives constructive feedback", rating: 4.2 },
            { criterion: "Returns graded work promptly", rating: 4.3 },
            { criterion: "Makes grading criteria clear", rating: 4.2 },
          ],
        },
        {
          id: 4,
          name: "Professional Behavior",
          rating: 4.6,
          items: [
            { criterion: "Shows respect for students", rating: 4.7 },
            { criterion: "Is accessible during consultation hours", rating: 4.5 },
            { criterion: "Demonstrates professionalism", rating: 4.6 },
            { criterion: "Serves as a positive role model", rating: 4.6 },
          ],
        },
      ],
    },
  };

  const evaluationData = evaluationPeriods[selectedPeriod];

  const handlePeriodChange = (periodKey) => {
    setSelectedPeriod(periodKey);
    setPeriodDropdownOpen(false);
  };

  const getRatingTrend = () => {
    const periods = Object.keys(evaluationPeriods);
    const currentIndex = periods.indexOf(selectedPeriod);
    if (currentIndex < periods.length - 1) {
      const previousPeriod = periods[currentIndex + 1];
      const diff = evaluationData.overallRating - evaluationPeriods[previousPeriod].overallRating;
      return diff;
    }
    return null;
  };

  const ratingTrend = getRatingTrend();

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return "#22c55e";
    if (rating >= 4.0) return "#3b82f6";
    if (rating >= 3.0) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={`fd ${sidebarOpen ? "fd--open" : ""}`}>
      {/* SIDEBAR - FIXED */}
      <aside className="fd-sidebar">
        <div className="fd-brand">
          <div className="fd-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 6v6l4 2"
                stroke="#1a3a5c"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="fd-brandInfo">
            <div className="fd-brandTitle">FacultyTrack</div>
            <div className="fd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="fd-nav">
          <Link className="fd-link" to="/faculty/dashboard" onClick={() => setSidebarOpen(false)}>
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="fd-linkText">Home</span>
          </Link>

          <Link className="fd-link fd-link--active" to="/faculty/evaluations" onClick={() => setSidebarOpen(false)}>
            <span className="fd-linkIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span className="fd-linkText">Evaluation Result</span>
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
              <span>Evaluation Results</span>
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
                <span className="fd-topUserName">Bruce Wayne</span>
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
              <h2 className="fd-title">Evaluation Results</h2>
              <p className="fd-subtitle">Dr. Bruce Wayne</p>
            </div>
            <div className="fd-summaryBadge" style={{ backgroundColor: getPerformanceColor(evaluationData.overallRating) }}>
              <div className="fd-summaryNum">{evaluationData.overallRating.toFixed(1)}</div>
              <div className="fd-summaryLabel">Overall Rating</div>
              {ratingTrend !== null && (
                <div className="fd-trendIndicator" style={{ 
                  color: ratingTrend >= 0 ? '#fff' : '#fff',
                  opacity: 0.9
                }}>
                  {ratingTrend > 0 ? '↑' : ratingTrend < 0 ? '↓' : '→'} 
                  {Math.abs(ratingTrend).toFixed(1)}
                </div>
              )}
            </div>
          </div>

          {/* Academic Period Selector */}
          <div className="fd-periodSelectorCard">
            <div className="fd-periodSelectorWrapper">
              <label className="fd-periodSelectorLabel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Academic Period:
              </label>
              <div className="fd-periodSelector">
                <button 
                  type="button"
                  className="fd-periodSelectorBtn"
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                >
                  <span className="fd-periodSelectorText">{evaluationData.periodLabel}</span>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className={`fd-periodSelectorIcon ${periodDropdownOpen ? 'fd-periodSelectorIcon--open' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {periodDropdownOpen && (
                  <div className="fd-periodDropdownMenu">
                    {Object.entries(evaluationPeriods).map(([key, period]) => (
                      <button
                        key={key}
                        type="button"
                        className={`fd-periodDropdownItem ${selectedPeriod === key ? 'fd-periodDropdownItem--active' : ''}`}
                        onClick={() => handlePeriodChange(key)}
                      >
                        <div className="fd-periodDropdownItemText">
                          <div className="fd-periodDropdownItemTitle">{period.periodLabel}</div>
                          <div className="fd-periodDropdownItemMeta">
                            Rating: {period.overallRating.toFixed(1)} • {period.totalResponses} responses
                          </div>
                        </div>
                        {selectedPeriod === key && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EVALUATION TABLE */}
          <div className="fd-tableCard">
            <div className="fd-tableHeader">
              <h3 className="fd-tableTitle">Evaluation Criteria Summary</h3>
            </div>
            <div className="fd-tableWrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th className="fd-thCenter">Average Rating</th>
                    <th className="fd-thCenter">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationData.categories.map((category) => (
                    <tr key={category.id}>
                      <td className="fd-tdCriteria">
                        <div className="fd-criteriaName">{category.name}</div>
                        <div className="fd-criteriaCount">{category.items.length} items</div>
                      </td>
                      <td className="fd-tdRating">
                        <div className="fd-ratingDisplay">
                          <span className="fd-ratingValue">{category.rating.toFixed(1)}</span>
                          <span className="fd-ratingTotal">/ 5.0</span>
                        </div>
                      </td>
                      <td className="fd-tdStatus">
                        <div className="fd-ratingBar">
                          <div
                            className="fd-ratingFill"
                            style={{
                              width: `${(category.rating / 5) * 100}%`,
                              backgroundColor: getPerformanceColor(category.rating),
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REMARKS SECTION */}
          <div className="fd-remarksCard">
            <div className="fd-remarksHeader">
              <h3 className="fd-remarksTitle">Remarks</h3>
            </div>
            <div className="fd-remarksContent">
              <p className="fd-remarksText">{evaluationData.remarks}</p>
            </div>
          </div>

          {/* PERFORMANCE SUMMARY SECTION */}
          <div className="fd-perfSummaryCard">
            <div className="fd-perfHeader">
              <div className="fd-perfTitleSection">
                <h3 className="fd-perfTitle">Performance Summary</h3>
                <p className="fd-perfSubtitle">{evaluationData.periodShort}</p>
              </div>
              <div 
                className="fd-perfBadge" 
                style={{ backgroundColor: getPerformanceColor(evaluationData.overallRating) }}
              >
                <div className="fd-perfBadgeIcon">*</div>
                <div className="fd-perfBadgeLabel">{evaluationData.performanceSummary}</div>
              </div>
            </div>

            <div className="fd-perfGrid">
              <div className="fd-perfMetric">
                <div className="fd-metricIcon fd-metricIcon--rating">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">Overall Rating</div>
                  <div className="fd-metricValue">{evaluationData.overallRating.toFixed(1)}</div>
                  <div className="fd-metricSubtext">out of 5.0</div>
                </div>
              </div>

              <div className="fd-perfMetric">
                <div className="fd-metricIcon fd-metricIcon--responses">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">Total Responses</div>
                  <div className="fd-metricValue">{evaluationData.totalResponses}</div>
                  <div className="fd-metricSubtext">students evaluated</div>
                </div>
              </div>

              <div className="fd-perfMetric">
                <div className="fd-metricIcon fd-metricIcon--highest">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">Highest Category</div>
                  <div className="fd-metricValue">Professional Behavior</div>
                  <div className="fd-metricSubtext">4.9 rating</div>
                </div>
              </div>

              <div className="fd-perfMetric">
                <div className="fd-metricIcon fd-metricIcon--status">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="fd-metricContent">
                  <div className="fd-metricLabel">Status</div>
                  <div className="fd-metricValue">Excellent</div>
                  <div className="fd-metricSubtext">highly recommended</div>
                </div>
              </div>
            </div>

            <div className="fd-perfCategoryBreakdown">
              <h4 className="fd-perfCategoryTitle">Category Performance</h4>
              <div className="fd-categoryBars">
                {evaluationData.categories.map((category) => (
                  <div key={category.id} className="fd-categoryBar">
                    <div className="fd-barLabel">
                      <span className="fd-barName">{category.name}</span>
                      <span className="fd-barScore">{category.rating.toFixed(1)}</span>
                    </div>
                    <div className="fd-barContainer">
                      <div
                        className="fd-barProgress"
                        style={{
                          width: `${(category.rating / 5) * 100}%`,
                          backgroundColor: getPerformanceColor(category.rating),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DETAILED CRITERIA BREAKDOWN */}
          <div className="fd-detailsCard">
            <div className="fd-detailsHeader">
              <h3 className="fd-detailsTitle">Detailed Breakdown by Criteria</h3>
            </div>
            {evaluationData.categories.map((category) => (
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
        </section>

        {/* FOOTER */}
        <footer className="fd-footer">
          Copyright (c) 2026 FacultyTrack. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}
