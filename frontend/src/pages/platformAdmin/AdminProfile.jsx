import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import OtpModal from "../../components/modals/OtpModal";
import ReAuthModal from "../../components/modals/ReAuthModal";

export default function AdminProfile() {
  const [editMode, setEditMode] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleReauth = (password) => {
    console.log("Re-auth password:", password);
    setReauthOpen(false);
    setOtpOpen(true);
  };

  const handleOtpVerify = (otp) => {
    console.log("OTP entered:", otp);
    setProfile((prev) => ({
      ...prev,
      uphoneverified: true,
    }));
    setOtpOpen(false);
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Profile</h1>

      {/* ================= PROFILE HEADER ================= */}
      <div className="dashboard-card profile-header">
        <div className="profile-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-img"
          />
          <div>
            <h2>{profile.uname}</h2>
            <p>{profile.uemail}</p>
            <span className={`status-pill ${profile.ustatus.toLowerCase()}`}>
              {profile.ustatus}
            </span>
          </div>
        </div>

        <button
          className="approve-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="dashboard-card">
        <h3>Personal Information</h3>

        <div className="profile-grid">
          <div>
            <label>Gender</label>
            <input
              disabled={!editMode}
              name="ugender"
              value={profile.ugender || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              disabled={!editMode}
              name="udob"
              value={profile.udob || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              disabled={!editMode}
              name="uphone"
              value={profile.uphone || ""}
              onChange={handleChange}
              onBlur={() => editMode && setReauthOpen(true)}
            />
            <span
              className={`verify-pill ${
                profile.uphoneverified ? "verified" : "not-verified"
              }`}
            >
              {profile.uphoneverified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= ADDRESS ================= */}
      <div className="dashboard-card">
        <h3>Address Information</h3>

        <div className="profile-grid">
          <div>
            <label>Address</label>
            <input
              disabled={!editMode}
              name="uaddress"
              value={profile.uaddress || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>City</label>
            <input
              disabled={!editMode}
              name="ucity"
              value={profile.ucity || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>State</label>
            <input
              disabled={!editMode}
              name="ustate"
              value={profile.ustate || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Country</label>
            <input
              disabled={!editMode}
              name="ucountry"
              value={profile.ucountry || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Pincode</label>
            <input
              disabled={!editMode}
              name="upincode"
              value={profile.upincode || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* ================= ACCOUNT INFO ================= */}
      <div className="dashboard-card">
        <h3>Account Information</h3>

        <div className="profile-grid">
          <div>
            <label>Email Verified</label>
            <p className={profile.uemailverified ? "verified-text" : "not-verified-text"}>
              {profile.uemailverified ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label>Phone Verified</label>
            <p className={profile.uphoneverified ? "verified-text" : "not-verified-text"}>
              {profile.uphoneverified ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label>Last Login</label>
            <p>{profile.lastlogin || "-"}</p>
          </div>

          <div>
            <label>Joined On</label>
            <p>{profile.createdat}</p>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <ReAuthModal
        open={reauthOpen}
        onClose={() => setReauthOpen(false)}
        onConfirm={handleReauth}
      />

      <OtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        emailOrPhone={profile.uphone}
        onVerify={handleOtpVerify}
      />
    </div>
  );
}
