import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar-custom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="ft-brand" onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} />
              </div>
              <h1 className="navbar-brand-custom" style={{ marginBottom: 0, fontSize: "22px" }}>FacultyTrack</h1>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="nav-link-custom" onClick={() => navigate("/")}>
                Home
              </span>

              <button className="btn-login" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>


    </>
  );
}
