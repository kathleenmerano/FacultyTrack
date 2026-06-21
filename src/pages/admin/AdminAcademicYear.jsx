import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { API } from "../../config/api";

export default function AdminAcademicYear() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAY, setEditingAY] = useState(null);
  
  // Real Data State
  const [academicYearList, setAcademicYearList] = useState([]);
  
  // Form State for CRUD
  const [formData, setFormData] = useState({
    year: "", 
    semester: "", 
    startDate: "", 
    endDate: "", 
    status: "on-going"
  });

  // 1. Fetch Function
  const fetchAY = async () => {
    try {
      const response = await fetch(`${API}/get-academic-years`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAcademicYearList(data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  };

  // 2. Fixed useEffect (Linter-Safe Pattern)
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchAY();
    };
    loadInitialData();
  }, []); // Empty dependency array ensures this only runs once

  // 3. Modal Handlers
  const handleOpenModal = (ay = null) => {
    if (ay) {
      setEditingAY(ay);
      // Only copy form-relevant fields — avoids sending Firestore Timestamps/id back
      setFormData({
        year: ay.year || "",
        semester: ay.semester || "",
        startDate: ay.startDate || "",
        endDate: ay.endDate || "",
        status: ay.status || "on-going",
      });
    } else {
      setEditingAY(null);
      setFormData({ year: "", semester: "", startDate: "", endDate: "", status: "on-going" });
    }
    setShowModal(true);
  };

  // 4. Save/Update Handler
  const handleSave = async () => {
    const isEditing = !!editingAY;
    const url = isEditing 
      ? `${API}/update-academic-year/${editingAY.id}`
      : `${API}/create-academic-year`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        await fetchAY(); // Refresh table
      }
    } catch (err) { 
      console.error("Save error:", err); 
    }
  };

  // 5. Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Delete this academic year record?")) {
      try {
        const response = await fetch(`${API}/delete-academic-year/${id}`, { 
          method: "DELETE" 
        });
        if (response.ok) await fetchAY();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const filteredAcademicYears = academicYearList.filter(
    (ay) =>
      ay.year?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ay.semester?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Academic Year Management">
      <section className="ad-content">
        <div className="ad-welcomeHeader">
          <div>
            <h2 className="ad-title">Academic Year &amp; Evaluation Period</h2>
          </div>
          <button className="ad-btnPrimary" onClick={() => handleOpenModal()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New
          </button>
        </div>

        <div className="ad-searchBar">
          <button className="ad-searchBtn">search</button>
          <input
            type="text" className="ad-searchInput" placeholder="Search academic years..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ad-tableCard">
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Semester</th>
                  <th>Starting Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcademicYears.map((ay) => (
                  <tr key={ay.id}>
                    <td className="ad-name">{ay.year}</td>
                    <td className="ad-engagement">{ay.semester}</td>
                    <td className="ad-engagement">{ay.startDate}</td>
                    <td className="ad-engagement">{ay.endDate}</td>
                    <td>
                      <span className={`ad-badge ad-badge--${(ay.status || "").toLowerCase().trim() === "on-going" ? "active" : "inactive"}`}>
                        {(ay.status || "").toLowerCase().trim() === "on-going" ? "On-going" : "Closed"}
                      </span>
                    </td>
                    <td className="ad-tableActions">
                      <button className="ad-actionBtn ad-actionBtn--edit" onClick={() => handleOpenModal(ay)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
                        </svg>
                      </button>
                      <button className="ad-actionBtn ad-actionBtn--delete" onClick={() => handleDelete(ay.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
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
              <h3 className="ad-modalTitle">{editingAY ? "Edit Academic Year" : "Add New Academic Year"}</h3>
              <button className="ad-modalClose" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="ad-modalBody">
              <div className="ad-formGroup">
                <label className="ad-label">Academic Year</label>
                <input 
                  type="text" className="ad-input" placeholder="e.g., 2025-2026" 
                  value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} 
                />
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Semester</label>
                <select className="ad-input" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})}>
                  <option value="">Select semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <div className="ad-formRow">
                <div className="ad-formGroup">
                  <label className="ad-label">Starting Date</label>
                  <input type="date" className="ad-input" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="ad-formGroup">
                  <label className="ad-label">End Date</label>
                  <input type="date" className="ad-input" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="ad-formGroup">
                <label className="ad-label">Status</label>
                <select className="ad-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="on-going">On-going (Open)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="ad-modalFooter">
              <button className="ad-btnSecondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={handleSave}>
                {editingAY ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}