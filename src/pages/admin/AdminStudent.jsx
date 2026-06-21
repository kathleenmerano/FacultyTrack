import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

const YEAR_LEVELS = ["1st", "2nd", "3rd", "4th"];
const SECTIONS = ["A", "B", "C", "D"];

const EMPTY_FORM = { schoolId: "", name: "", email: "", password: "", department: "", yearLevel: "", section: "" };

export default function AdminStudent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API}/get-users/student`);
      const data = await response.json();
      if (response.ok) setStudentList(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    // Fetch departments so the student's department matches class assignment dropdown
    fetch(`${API}/get-departments`)
      .then(r => r.json())
      .then(data => setDepartmentOptions(Array.isArray(data) ? data : []))
      .catch(err => console.error("Dept fetch error:", err));
  }, []);

  const handleDelete = async (uid) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`${API}/delete-user/${uid}`, { method: "DELETE" });
        if (response.ok) fetchStudents();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.email || !formData.name || (!editingStudent && !formData.password)) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);
    const isEditing = !!editingStudent;
    const url = isEditing 
      ? `${API}/update-user/${editingStudent.uid || editingStudent.id}`
      : `${API}/create-user`;
    
    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.name,
          role: "student"
        }),
      });

      if (response.ok) {
        setShowModal(false);
        fetchStudents();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = studentList.filter(s => 
    (s.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.schoolId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Student Management">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Student Management</h2>
            <p className="ad-subtitle">Manage all student accounts in the system</p>
          </div>
          <button className="ad-btnPrimary" onClick={() => {
            setEditingStudent(null);
            setFormData(EMPTY_FORM);
            setShowModal(true);
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Student
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">SEARCH</button>
          <input type="text" className="ad-searchInput" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="ad-tableCard">
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>School ID</th><th>Full Name</th><th>Email</th><th>Dept.</th><th>Year</th><th>Sec.</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.uid || student.id}>
                      <td className="ad-code">{student.schoolId}</td>
                      <td className="ad-name">{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.yearLevel}</td>
                      <td>{student.section}</td>
                      <td>
                        <span className={`ad-badge ad-badge--${(student.status || 'active').toLowerCase()}`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="ad-tableActions">
                        <button className="ad-actionBtn ad-actionBtn--view" title="View" onClick={() => setViewingStudent(student)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="ad-actionBtn ad-actionBtn--edit" title="Edit" onClick={() => {
                          setEditingStudent(student);
                          setFormData({
                            schoolId: student.schoolId || "",
                            name: student.fullName || "",
                            email: student.email || "",
                            password: "",
                            department: student.department || "",
                            yearLevel: student.yearLevel || "",
                            section: student.section || "",
                          });
                          setShowModal(true);
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="ad-actionBtn ad-actionBtn--delete" title="Delete" onClick={() => handleDelete(student.uid || student.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" style={{textAlign: "center", padding: "20px"}}>No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* VIEW STUDENT MODAL */}
      {viewingStudent && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => setViewingStudent(null)} />
          <div className="ad-modalContent">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">Student Details</h3>
              <button className="ad-modalClose" onClick={() => setViewingStudent(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ad-modalBody">
              {[
                { label: "School ID", value: viewingStudent.schoolId || "—" },
                { label: "Full Name", value: viewingStudent.fullName || "—" },
                { label: "Email", value: viewingStudent.email || "—" },
                { label: "Department", value: viewingStudent.department || "—" },
                { label: "Year Level", value: viewingStudent.yearLevel || "—" },
                { label: "Section", value: viewingStudent.section || "—" },
                { label: "Status", value: viewingStudent.status || "Active" },
              ].map(f => (
                <div className="ad-formGroup" key={f.label} style={{ marginBottom: "12px" }}>
                  <label className="ad-label" style={{ marginBottom: "4px" }}>{f.label}</label>
                  <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px" }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setViewingStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => setShowModal(false)} />
          <div className="ad-modalContent ad-modalContent--large">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">{editingStudent ? "Edit Student Account" : "Register New Student"}</h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">School ID</label>
                  <input type="text" className="ad-input" placeholder="ID Number" value={formData.schoolId} onChange={(e) => setFormData({...formData, schoolId: e.target.value})} />
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Full Name</label>
                  <input type="text" className="ad-input" placeholder="Enter complete name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              
              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">Email Address</label>
                  <input type="email" className="ad-input" placeholder="student@school.edu.ph" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                {!editingStudent && (
                  <div className="ad-formGroup">
                    <label className="ad-label">Password</label>
                    <input type="password" className="ad-input" placeholder="Initial password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                )}
              </div>

              <div className="ad-formRow" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
                <div className="ad-formGroup">
                  <label className="ad-label">Department</label>
                  {/* Must use dropdown matching class assignment so student-faculty filtering works */}
                  <select className="ad-input" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                    <option value="">Select department</option>
                    {departmentOptions.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Year Level</label>
                  <select className="ad-input" value={formData.yearLevel} onChange={(e) => setFormData({...formData, yearLevel: e.target.value})}>
                    <option value="">Select year</option>
                    {YEAR_LEVELS.map(y => <option key={y} value={y}>{y} Year</option>)}
                  </select>
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">Section</label>
                  <select className="ad-input" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})}>
                    <option value="">Select section</option>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>

              {editingStudent && (
                <div className="ad-formNote">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Passwords cannot be updated from this panel for security reasons.
                </div>
              )}
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={handleSave} disabled={loading}>
                {loading ? "Processing..." : (editingStudent ? "Update Account" : "Create Account")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}