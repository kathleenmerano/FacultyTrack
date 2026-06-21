import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminClassAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Real Data States
  const [assignmentList, setAssignmentList] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]); 
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]); 
  const [academicYearOptions, setAcademicYearOptions] = useState([]); // NEW: Real Academic Year State

  const [formData, setFormData] = useState({
    facultyId: "", facultyName: "", subjectCode: "", subjectName: "",
    department: "", yearLevel: "", section: "", semester: "", academicYear: ""
  });

  // Fixed useEffect to avoid "calling setState synchronously" warning
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [assignRes, facRes, subRes, deptRes, ayRes] = await Promise.all([
          fetch(`${API}/get-assignments`),
          fetch(`${API}/get-users`),
          fetch(`${API}/get-subjects`),
          fetch(`${API}/get-departments`),
          fetch(`${API}/get-academic-years`),
        ]);
          
        const assignments = await assignRes.json();
        const users = await facRes.json();
        const subjects = await subRes.json();
        const depts = await deptRes.json();
        const ays = await ayRes.json(); // NEW: Parse AY data

        setAssignmentList(assignments);
        setFacultyOptions(users.filter(u => u.role === "faculty"));
        setSubjectOptions(subjects);
        setDepartmentOptions(depts);
        setAcademicYearOptions(ays); // NEW: Setting the real data
      } catch (err) { console.error("Fetch Error:", err); }
    };
    loadAllData();
  }, []);

  const handleSave = async () => {
    const method = editingAssignment ? "PATCH" : "POST";
    const url = editingAssignment 
      ? `${API}/update-assignment/${editingAssignment.id}`
      : `${API}/create-assignment`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const refreshed = await fetch(`${API}/get-assignments`).then(r => r.json());
        setAssignmentList(refreshed);
        setShowModal(false);
      }
    } catch (err) { console.error("Save error:", err); }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this assignment?")) {
      await fetch(`${API}/delete-assignment/${id}`, { method: "DELETE" });
      setAssignmentList(assignmentList.filter(a => a.id !== id));
    }
  };

  const filteredAssignments = assignmentList.filter(a =>
    a.facultyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Class Assignment">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Class Assignment</h2>
            <p className="ad-subtitle">Assign faculty members to specific subjects and sections</p>
          </div>
          <button className="ad-btnPrimary" onClick={() => {
            setEditingAssignment(null);
            setFormData({ facultyId: "", facultyName: "", subjectCode: "", subjectName: "", department: "", yearLevel: "", section: "", semester: "", academicYear: "" });
            setShowModal(true);
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Assignment
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">search</button>
          <input
            type="text" className="ad-searchInput"
            placeholder="Search by faculty, subject, department, or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ad-tableCard">
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Department</th>
                  <th>Year & Section</th>
                  <th>Semester</th>
                  <th>Academic Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="ad-name">{assignment.facultyName}</td>
                    <td className="ad-code">{assignment.subjectCode}</td>
                    <td className="ad-name">{assignment.subjectName}</td>
                    <td className="ad-engagement">{assignment.department}</td>
                    <td className="ad-engagement">
                      <span className="ad-badge ad-badge--info">{assignment.yearLevel} - {assignment.section}</span>
                    </td>
                    <td className="ad-engagement">{assignment.semester}</td>
                    <td className="ad-engagement">{assignment.academicYear}</td>
                    <td className="ad-tableActions">
                      <button className="ad-actionBtn ad-actionBtn--edit" onClick={() => {
                        setEditingAssignment(assignment);
                        setFormData({
                          facultyId: assignment.facultyId || "",
                          facultyName: assignment.facultyName || "",
                          subjectCode: assignment.subjectCode || "",
                          subjectName: assignment.subjectName || "",
                          department: assignment.department || "",
                          yearLevel: assignment.yearLevel || "",
                          section: assignment.section || "",
                          semester: assignment.semester || "",
                          academicYear: assignment.academicYear || "",
                        });
                        setShowModal(true);
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" /></svg>
                      </button>
                      <button className="ad-actionBtn ad-actionBtn--delete" onClick={() => handleDelete(assignment.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => setShowModal(false)} />
          <div className="ad-modalContent ad-modalContent--large">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">{editingAssignment ? "Edit Class Assignment" : "Add New Class Assignment"}</h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formGroup">
                <label className="ad-label">Faculty Member *</label>
                <select 
                  className="ad-input" 
                  value={formData.facultyId || ""} 
                  onChange={(e) => {
                    const fac = facultyOptions.find(f => f.id === e.target.value);
                    setFormData({...formData, facultyId: e.target.value, facultyName: fac?.fullName || ""});
                  }}
                >
                  <option value="">Select faculty member</option>
                  {facultyOptions.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
                </select>
              </div>

              <div className="ad-formGroup">
                <label className="ad-label">Subject *</label>
                <select 
                  className="ad-input" 
                  value={formData.subjectCode || ""}
                  onChange={(e) => {
                    const sub = subjectOptions.find(s => s.code === e.target.value);
                    setFormData({...formData, subjectCode: e.target.value, subjectName: sub?.description || ""});
                  }}
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map(s => <option key={s.code} value={s.code}>{s.code} - {s.description}</option>)}
                </select>
              </div>

              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">Department *</label>
                  <select className="ad-input" value={formData.department || ""} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                    <option value="">Select department</option>
                    {departmentOptions.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Year Level *</label>
                  <select className="ad-input" value={formData.yearLevel || ""} onChange={(e) => setFormData({...formData, yearLevel: e.target.value})}>
                    <option value="">Select year</option>
                    {["1st", "2nd", "3rd", "4th"].map(y => <option key={y} value={y}>{y} Year</option>)}
                  </select>
                </div>
              </div>

              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">Section *</label>
                  <select className="ad-input" value={formData.section || ""} onChange={(e) => setFormData({...formData, section: e.target.value})}>
                    <option value="">Select section</option>
                    {["A", "B", "C", "D"].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Semester *</label>
                  <select className="ad-input" value={formData.semester || ""} onChange={(e) => setFormData({...formData, semester: e.target.value})}>
                    <option value="">Select semester</option>
                    {["1st Semester", "2nd Semester", "Summer"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="ad-formGroup">
                <label className="ad-label">Academic Year *</label>
                <select 
                  className="ad-input" 
                  value={formData.academicYear || ""} 
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                >
                  <option value="">Select academic year</option>
                  {/* NEW: Mapping through the fetched real Academic Year data */}
                  {academicYearOptions.map(y => (
                    <option key={y.id} value={y.year}>
                      {y.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={handleSave}>
                {editingAssignment ? "Update Assignment" : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}