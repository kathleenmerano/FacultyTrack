import { useAuth } from "../../context/AuthContext";
import StudentLayout from "./StudentLayout";

export default function StudentProfile() {
  const { currentUser, userProfile } = useAuth();

  const profile = userProfile || {};
  const displayName = profile.fullName || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <StudentLayout breadcrumb="My Profile">
      <div className="sd-welcomeHeader">
        <div>
          <h2 className="sd-title">My Profile</h2>
          <p className="sd-subtitle">View and manage your account information</p>
        </div>
      </div>

      <div className="sd-profileCard">
        <div className="sd-profileHeader">
          <div className="sd-profileAvatar">{initial}</div>
          <div className="sd-profileInfo">
            <h3 className="sd-profileName">{displayName}</h3>
            <span className="sd-profileRole">Student</span>
          </div>
        </div>
        <div className="sd-profileDetails">
          {[
            { label: "Student ID", value: profile.schoolId || "—" },
            { label: "Email Address", value: profile.email || currentUser?.email || "—" },
            { label: "Department", value: profile.department || profile.dept || "—" },
            { label: "Year Level", value: profile.yearLevel || profile.year || "—" },
            { label: "Section", value: profile.section || "—" },
            { label: "Enrollment Status", value: profile.status === "active" ? "Active" : profile.status || "—" },
            { label: "Contact Number", value: profile.contactNumber || "—" },
            { label: "Address", value: profile.address || "—" },
          ].map(field => (
            <div className="sd-profileField" key={field.label}>
              <label className="sd-profileLabel">{field.label}</label>
              <div className="sd-profileValue">{field.value}</div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
