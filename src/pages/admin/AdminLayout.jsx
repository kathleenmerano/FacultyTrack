import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle2,
  GraduationCap,
  CalendarDays,
  FileText,
  ClipboardList,
  ClipboardCheck,
  BookOpen,
  Menu,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg";

const navSections = [
  {
    id: "main",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    id: "system-users",
    label: "SYSTEM USERS",
    items: [
      { key: "faculty", label: "Faculty", path: "/admin/faculty", icon: Users },
      { key: "student", label: "Student", path: "/admin/student", icon: UserCircle2 },
    ],
  },
  {
    id: "manage-evaluation",
    label: "MANAGE EVALUATION",
    items: [
      { key: "department", label: "Department", path: "/admin/department", icon: GraduationCap },
      { key: "subject", label: "Subject", path: "/admin/subject", icon: BookOpen },
      { key: "class-assignment", label: "Class Assignment", path: "/admin/class-assignment", icon: ClipboardList },
      { key: "academic-year", label: "Academic Year", path: "/admin/academic-year", icon: CalendarDays },
      { key: "questionnaire", label: "Questionnaire", path: "/admin/questionnaire", icon: FileText },
      { key: "criteria", label: "Evaluation Criteria", path: "/admin/criteria", icon: ClipboardCheck },
      { key: "report", label: "Evaluation Report", path: "/admin/report", icon: FileText },
    ],
  },
];

export default function AdminLayout({ title, children }) {
  // Desktop: expanded (260px) vs icon-only (120px)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobile: overlay open/closed (always starts closed)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBurger = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarOpen((v) => !v);
    }
  };

  const handleNavClick = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`ad ${sidebarOpen ? "ad--open" : ""} ${mobileOpen ? "ad--mobile-open" : ""}`}>
      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-logo" style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>
            <img src={logo} alt="FacultyTrack Logo" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} />
          </div>
          <div className="ad-brandInfo">
            <div className="ad-brandTitle">FacultyTrack</div>
            <div className="ad-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        {navSections.map((section) => (
          <div key={section.id}>
            {section.label && <div className="ad-menuLabel">{section.label}</div>}
            <nav className="ad-nav">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={`ad-link ${isActive(item.path) ? "ad-link--active" : ""}`}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <span className="ad-linkIcon"><Icon size={18} /></span>
                    <span className="ad-linkText">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </aside>

      {/* OVERLAY (mobile) */}
      <button
        type="button"
        className="ad-overlay"
        aria-label="Close sidebar"
        onClick={() => setMobileOpen(false)}
      />

      {/* MAIN */}
      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-topLeft">
            <button
              type="button"
              className="ad-burger"
              aria-label="Toggle sidebar"
              onClick={handleBurger}
            >
              <Menu size={20} />
            </button>
            <div className="ad-breadcrumb"><span>{title}</span></div>
          </div>

          <div className="ad-topRight">
            <div className="ad-userDropdown">
              <button
                className="ad-topUser"
                onClick={() => setDropdownOpen((v) => !v)}
                type="button"
              >
                <div className="ad-topAvatar"><Users size={18} /></div>
                <span className="ad-topUserName">{userProfile?.fullName || "Admin"}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className={`ad-drop ${dropdownOpen ? "ad-drop--open" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="ad-dropdownMenu">
                  <button
                    type="button"
                    className="ad-dropdownItem"
                    onClick={() => { setDropdownOpen(false); navigate("/admin/profile"); }}
                  >
                    <Users size={16} />
                    My Profile
                  </button>
                  <div className="ad-dropdownDivider" />
                  <button
                    className="ad-dropdownItem ad-dropdownItem--logout"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}

        <footer className="ad-footer">Copyright © 2026 FacultyTrack. All Rights Reserved.</footer>
      </main>
    </div>
  );
}
