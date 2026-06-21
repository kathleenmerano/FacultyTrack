import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, Shield, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;

      // 2️⃣ Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        alert("User record not found.");
        return;
      }

      const userData = userDoc.data();

      // 3️⃣ Check account status
      if (userData.status !== "active") {
        alert("Your account is inactive. Contact admin.");
        return;
      }

      // 4️⃣ Validate selected role matches database role
      if (userData.role !== activeTab) {
        alert("Incorrect role selected.");
        return;
      }

      // 5️⃣ Redirect based on role
      navigate(`/${userData.role}/dashboard`);

    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "student":
        return {
          title: "Login to your account",
          subtitle: "Please enter your credentials",
          userLabel: "Email",
        };
      case "faculty":
        return {
          title: "FACULTY LOGIN",
          subtitle: "Login to your FacultyTrack account",
          userLabel: "Email",
        };
      case "admin":
        return {
          title: "ADMIN LOGIN",
          subtitle: "Administrative access only",
          userLabel: "Email",
        };
      default:
        return {
          title: "Login",
          subtitle: "Please enter your credentials",
          userLabel: "Email",
        };
    }
  };

  const content = getTabContent();

  return (
    <div className="login-bg">
      <button type="button" className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="login-container">
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
                type="email"
                className="form-input"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                Password
              </label>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
            </div>

            <button
              type="button"
              className="btn-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="login-footer">
              <p className="footer-text">
                Consolatrix College of <strong>Toledo City</strong>
              </p>
              <p className="footer-copyright">
                © 2026 FacultyTrack
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}