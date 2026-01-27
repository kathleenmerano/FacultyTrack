import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = () => {
    console.log(`${activeTab} login:`, formData);
    
    // Navigate based on role
    if (activeTab === "student") {
      navigate("/student/dashboard");
    } else {
      alert(
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} login will be connected to backend later.`
      );
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "student":
        return { title: "Login to your account", subtitle: "Please enter your credentials", userLabel: "Email or Student ID" };
      case "faculty":
        return { title: "FACULTY LOGIN", subtitle: "Login to your FacultyTrack account", userLabel: "Username" };
      case "admin":
        return { title: "ADMIN LOGIN", subtitle: "Administrative access only", userLabel: "Admin Username" };
      default:
        return { title: "Login", subtitle: "Please enter your credentials", userLabel: "Username" };
    }
  };

  const content = getTabContent();

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">
          <div className="login-title">FacultyTrack</div>
          <div className="login-subtitle">Faculty Evaluation System</div>
        </div>

        <div className="login-card">
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${activeTab === "student" ? "active" : ""}`}
              onClick={() => setActiveTab("student")}
            >
              <User size={18} />
              Student
            </button>

            <button
              type="button"
              className={`role-tab ${activeTab === "faculty" ? "active" : ""}`}
              onClick={() => setActiveTab("faculty")}
            >
              <Users size={18} />
              Faculty
            </button>

            <button
              type="button"
              className={`role-tab ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

          <div className="login-form">
            <h2 className="form-title">{content.title}</h2>
            <p className="form-subtitle">{content.subtitle}</p>

            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {content.userLabel}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={content.userLabel}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ fontSize: "16px" }}>🔒</span>
                Password
              </label>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingRight: "45px" }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="forgot-password">
                <span className="forgot-link">Forgot password?</span>
              </div>
            </div>

            <button type="button" className="btn-submit" onClick={handleSubmit}>
              Login
            </button>

            <div className="login-footer">
              <p className="footer-text">
                Consolatrix College of <strong>Toledo City</strong>
              </p>
              <p className="footer-copyright">© 2026 FacultyTrack</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-footer">Consolatrix College of Toledo City</div>

    </div>
  );
}
