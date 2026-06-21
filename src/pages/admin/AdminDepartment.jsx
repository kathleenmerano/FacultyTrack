import { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminDepartment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${API}/get-departments`);
      const data = await response.json();
      if (response.ok) setDepartmentList(data);
    } catch (err) {
      console.error("Dept Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSave = async () => {
    if (!formData.name || !formData.description) return alert("Please fill all fields");

    setLoading(true);
    const isEditing = !!editingDepartment;
    const url = isEditing
      ? `${API}/update-department/${editingDepartment.id}`
      : `${API}/create-department`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: "", description: "" });
        fetchDepartments();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ADDED DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      const response = await fetch(`${API}/delete-department/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchDepartments();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredDepartments = departmentList.filter(dept =>
    (dept.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dept.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Department">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Department</h2>
          </div>
          <button className="ad-btnPrimary" onClick={() => {
            setEditingDepartment(null);
            setFormData({ name: "", description: "" });
            setShowModal(true);
          }}>
            Add New Department
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">SEARCH</button>
          <input 
            type="text" 
            className="ad-searchInput" 
            placeholder="Search departments..." 
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
                  <th>DEPARTMENT NAME</th>
                  <th>DESCRIPTION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                  {filteredDepartments.map((dept, index) => (
                    <tr key={dept.id || index}>
                      <td>{index + 1}</td>
                      <td className="ad-name">{dept.name}</td>
                      <td className="ad-engagement">{dept.description}</td>
                      <td className="ad-tableActions">
                        <button 
                          className="ad-actionBtn ad-actionBtn--edit" 
                          title="Edit"
                          onClick={() => {
                            setEditingDepartment(dept);
                            setFormData({ name: dept.name, description: dept.description });
                            setShowModal(true);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          className="ad-actionBtn ad-actionBtn--delete" 
                          title="Delete"
                          onClick={() => handleDelete(dept.id)}
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
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formGroup">
                <label className="ad-label">Department Name (Code)</label>
                <input 
                  type="text" 
                  className="ad-input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Description</label>
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
                {loading ? "Saving..." : (editingDepartment ? "Update" : "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}