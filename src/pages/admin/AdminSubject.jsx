import { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminSubject() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ code: "", description: "" });

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${API}/get-subjects`);
      const data = await response.json();
      if (response.ok) setSubjectList(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSave = async () => {
    if (!formData.code || !formData.description) return alert("Please fill all fields");
    
    setLoading(true);
    const isEditing = !!editingSubject;
    const url = isEditing
      ? `${API}/update-subject/${editingSubject.id}`
      : `${API}/create-subject`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ code: "", description: "" });
        fetchSubjects();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ADDED DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      const response = await fetch(`${API}/delete-subject/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchSubjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredSubjects = subjectList.filter(s =>
    (s.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Subject">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Manage Subject</h2>
          </div>
          <button className="ad-btnPrimary" onClick={() => {
            setEditingSubject(null);
            setFormData({ code: "", description: "" });
            setShowModal(true);
          }}>
            Add New Subject
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">SEARCH</button>
          <input 
            type="text" 
            className="ad-searchInput" 
            placeholder="Search subjects..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="ad-tableCard">
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>SUBJECT CODE</th>
                  <th>DESCRIPTION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
  {filteredSubjects.map((subject, index) => (
    <tr key={subject.id || index}>
      <td className="ad-code">{String(index + 1).padStart(3, '0')}</td>
      <td className="ad-code">{subject.code}</td>
      <td className="ad-name">{subject.description}</td>
      <td className="ad-tableActions">
        <button 
          className="ad-actionBtn ad-actionBtn--edit" 
          title="Edit"
          onClick={() => {
            setEditingSubject(subject);
            setFormData({ code: subject.code, description: subject.description });
            setShowModal(true);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button 
          className="ad-actionBtn ad-actionBtn--delete" 
          title="Delete"
          onClick={() => handleDelete(subject.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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
          <div className="ad-modalContent">
            <div className="ad-modalHeader">
              <h3 className="ad-modalTitle">
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formGroup">
                <label className="ad-label">Subject Code</label>
                <input 
                  type="text" 
                  className="ad-input" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                />
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Subject Description</label>
                <input 
                  type="text" 
                  className="ad-input" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={handleSave} disabled={loading}>
                {loading ? "Processing..." : (editingSubject ? "Update" : "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}