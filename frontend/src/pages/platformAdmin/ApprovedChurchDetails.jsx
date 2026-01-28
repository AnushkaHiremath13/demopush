import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function ApprovedChurchDetails() {
  const { churchId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChurch();
  }, []);

  const loadChurch = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/platform/church/${churchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setChurch(data.church);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!church) return <p>Church not found</p>;

  return (
    <div className="dashboard details-page">
      <h1 className="dashboard-title">Church Details</h1>

      <div className="dashboard-card large">
        <div className="details-header">
          <h2>{church.cname}</h2>
          <span className={`status-pill ${church.cstatus.toLowerCase()}`}>
            {church.cstatus}
          </span>
        </div>

        <div className="details-section">
          <h4>Basic Information</h4>
          <div className="details-list">
            <div className="details-item">
              <label>Church Code</label>
              <span>{church.ccode}</span>
            </div>
            <div className="details-item">
              <label>Denomination</label>
              <span>{church.cdenomination || "-"}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Address</h4>
          <div className="details-list">
            <div className="details-item"><label>Address</label><span>{church.caddress}</span></div>
            <div className="details-item"><label>City</label><span>{church.ccity}</span></div>
            <div className="details-item"><label>State</label><span>{church.cstate}</span></div>
            <div className="details-item"><label>Country</label><span>{church.ccountry}</span></div>
            <div className="details-item"><label>Pincode</label><span>{church.cpincode}</span></div>
          </div>
        </div>

        <div className="details-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
