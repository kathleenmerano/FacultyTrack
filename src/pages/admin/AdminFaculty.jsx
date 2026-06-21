import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial Form State
  const initialForm = { schoolId: "", name: "", email: "", password: "" };
  const [formData, setFormData] = useState(initialForm);

  // 1. READ: Fetch faculty members
  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API}/get-users/faculty`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setFacultyList(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // 2. CREATE & UPDATE Logic
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent form reload
    
    // Basic Validation
    if (!formData.email || !formData.name || (!editingFaculty && !formData.password)) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const isEditing = !!editingFaculty;
    
    // Determine Endpoint
    const url = isEditing 
      ? `${API}/update-user/${editingFaculty.id || editingFaculty.uid}`
      : `${API}/create-user`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.name, // Map "name" from form to "fullName" for backend
          role: "faculty"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh list and close modal
        await fetchFaculty();
        setShowModal(false);
        setFormData(initialForm);
        setEditingFaculty(null);
      } else {
        alert(`Error: ${result.error || "Something went wrong"}`);
      }
    } catch (err) {
      alert("Network error: Could not connect to the server.");
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE Logic
  const handleDelete = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this faculty member? This action cannot be undone.")) return;

    try {
      const response = await fetch(`${API}/delete-user/${uid}`, { 
        method: "DELETE" 
      });

      if (response.ok) {
        // Optimized: Filter out deleted item from local state immediately
        setFacultyList(prev => prev.filter(f => (f.id || f.uid) !== uid));
      } else {
        const errData = await response.json();
        alert(`Delete failed: ${errData.error}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // UI Helper: Prepare for Edit
  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      schoolId: faculty.schoolId || "",
      name: faculty.fullName || "",
      email: faculty.email || "",
      password: "" // Keep empty for security
    });
    setShowModal(true);
  };

  // Filtering Logic
  const filteredFaculty = facultyList.filter(f => 
    (f.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.schoolId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Faculty Management">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Faculty Management</h2>
            <p className="ad-subtitle">Manage all faculty members in the system</p>
          </div>
          <button className="ad-btnPrimary" onClick={() => {
            setEditingFaculty(null);
            setFormData(initialForm);
            setShowModal(true);
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Faculty
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">SEARCH</button>
          <input 
            type="text" 
            className="ad-searchInput" 
            placeholder="Search by name or ID..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="ad-tableCard">
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>SCHOOL ID</th><th>FULL NAME</th><th>EMAIL</th><th>STATUS</th><th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((f) => (
                    <tr key={f.id || f.uid}>
                      <td className="ad-code">{f.schoolId}</td>
                      <td className="ad-name">{f.fullName}</td>
                      <td>{f.email}</td>
                      <td>
                        <span className={`ad-badge ad-badge--${(f.status || 'active').toLowerCase()}`}>
                          {f.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="ad-tableActions">
                        <button className="ad-actionBtn ad-actionBtn--edit" onClick={() => openEditModal(f)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="ad-actionBtn ad-actionBtn--delete" onClick={() => handleDelete(f.id || f.uid)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{textAlign: "center", padding: "40px", color: "#999"}}>No faculty members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MODAL SECTION */}
      {showModal && (
        <div className="ad-modal">
          <div className="ad-modalOverlay" onClick={() => !loading && setShowModal(false)} />
          <div className="ad-modalContent ad-modalContent--large">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">{editingFaculty ? "Edit Faculty Profile" : "Register New Faculty"}</h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="ad-modalBody">
                <div className="ad-formRow">
                  <div className="ad-formGroup">
                    <label className="ad-label">School ID</label>
                    <input 
                      type="text" required className="ad-input" 
                      value={formData.schoolId} 
                      onChange={(e) => setFormData({...formData, schoolId: e.target.value})} 
                    />
                  </div>
                  <div className="ad-formGroup">
                    <label className="ad-label">Full Name</label>
                    <input 
                      type="text" required className="ad-input" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="ad-formRow">
                  <div className="ad-formGroup">
                    <label className="ad-label">Email / Username</label>
                    <input 
                      type="email" required className="ad-input" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  {!editingFaculty && (
                    <div className="ad-formGroup">
                      <label className="ad-label">Temporary Password</label>
                      <input 
                        type="password" required className="ad-input" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      />
                    </div>
                  )}
                </div>

                {editingFaculty && (
                  <div className="ad-formNote">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <span>To change the password for this user, please use the Account Security tab.</span>
                  </div>
                )}
              </div>
              <div className="ad-modalFooter">
                <button type="button" className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="ad-btnPrimary" disabled={loading}>
                  {loading ? "Processing..." : (editingFaculty ? "Update Faculty" : "Save Faculty")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}