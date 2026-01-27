import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar-custom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="ft-brand" onClick={() => navigate("/")}>
              <h1 className="navbar-brand-custom">FacultyTrack</h1>
             
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
