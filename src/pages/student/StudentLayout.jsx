import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Users, Menu, LogOut, ChevronDown, User, FileText, Home } from "lucide-react";
import logo from "../../assets/logo.jpg";


const NAV_ITEMS = [
  {
    path: "/student/dashboard",
    label: "Home",
    icon: <Home size={18} />,
  },
  {
    path: "/student/evaluate",
    label: "Evaluate Teacher",
    icon: <FileText size={18} />,
  },
];

export default function StudentLayout({ children, breadcrumb }) {
  // Desktop: collapsed (icon-only 70px) vs expanded (260px)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Mobile: overlay open/closed
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBurger = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  const handleNavClick = () => {
    // Close mobile overlay on nav click; don't affect desktop collapsed state
    setMobileOpen(false);
  };

  const displayName = userProfile?.fullName || "Student";
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`sd ${sidebarCollapsed ? "sd--closed" : ""} ${mobileOpen ? "sd--open" : ""}`}
    >
      {/* SIDEBAR */}
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-logo" style={{ width: "56px", height: "56px", borderRadius: "50%", padding: "0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={logo} alt="FacultyTrack Logo" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} />
          </div>
          <div className="sd-brandInfo">
            <div className="sd-brandTitle">FacultyTrack</div>
            <div className="sd-brandSub">Faculty Evaluation System</div>
          </div>
        </div>

        <nav className="sd-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              className={`sd-link ${isActive(item.path) ? "sd-link--active" : ""}`}
              to={item.path}
              onClick={handleNavClick}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="sd-linkIcon">{item.icon}</span>
              <span className="sd-linkText">{item.label}</span>
            </Link>
          ))}
        </nav>

      </aside>

      {/* OVERLAY (mobile) */}
      <button
        type="button"
        className="sd-overlay"
        aria-label="Close sidebar"
        onClick={() => setMobileOpen(false)}
      />

      {/* MAIN */}
      <main className="sd-main">
        <header className="sd-topbar">
          <div className="sd-topLeft">
            <button
              type="button"
              className="sd-burger"
              aria-label="Toggle sidebar"
              onClick={handleBurger}
            >
              <Menu size={20} />
            </button>
            <div className="sd-breadcrumb">
              <span>{breadcrumb}</span>
            </div>
          </div>

          <div className="sd-topRight">
            <div className="sd-userDropdown">
              <button
                className="sd-topUser"
                onClick={() => setDropdownOpen((v) => !v)}
                type="button"
              >
                <div className="sd-topAvatar"><Users size={18} /></div>
                <span className="sd-topUserName">{displayName}</span>
                <ChevronDown
                  size={16}
                  className={`sd-drop ${dropdownOpen ? "sd-drop--open" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="sd-dropdownMenu">
                  <Link
                    to="/student/profile"
                    className="sd-dropdownItem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <div className="sd-dropdownDivider" />
                  <button
                    className="sd-dropdownItem sd-dropdownItem--logout"
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

        <section className="sd-content">
          {children}
        </section>

        <footer className="sd-footer">
          <span>Copyright © 2026 FacultyTrack. All Rights Reserved.</span>
        </footer>
      </main>
    </div>
  );
}
