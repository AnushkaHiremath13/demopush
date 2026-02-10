import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { api } from "../../api/api";

export default function ChurchDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateValue) =>
    dateValue ? new Date(dateValue).toLocaleDateString("en-GB") : "-";

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await api(`/platform/church-applicants/${applicationId}`);
        if (res?.success && res.application) {
          setChurch(res.application);
        } else {
          setChurch(null);
        }
      } catch (err) {
        console.error("Church details error:", err);
        setChurch(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [applicationId]);

  const handleApprove = async () => {
    await api(`/platform/church-applicants/${applicationId}/approve`, {
      method: "PATCH",
    });
    navigate("/admin/dashboard", { replace: true });
  };

  const handleReject = async () => {
    await api(`/platform/church-applicants/${applicationId}/reject`, {
      method: "PATCH",
    });
    navigate("/admin/dashboard", { replace: true });
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!church) return <p style={{ padding: 20 }}>Application not found</p>;

  return (
    <div className="dashboard details-page">
      <h1 className="dashboard-title">Church Application Details</h1>

      <div className="dashboard-card large">
        <div className="details-header">
          <h2>{church.chr_app_name}</h2>
          <span className="status-pill pending">
            {church.chr_app_status}
          </span>
        </div>

        <div className="details-section">
          <h4>Basic Information</h4>
          <div className="details-item">
            <label>Church Code</label>
            <span>{church.chr_app_code}</span>
          </div>
          <div className="details-item">
            <label>Denomination</label>
            <span>{church.chr_app_denomination || "-"}</span>
          </div>
        </div>

        <div className="details-section">
          <h4>Contact Information</h4>
          <div className="details-item">
            <label>Email</label>
            <span>{church.chr_app_email || "-"}</span> {/* ✅ WILL NOW SHOW */}
          </div>
        </div>

        <div className="details-section">
          <h4>Location</h4>
          <div className="details-item">
            <label>City</label>
            <span>{church.chr_app_city || "-"}</span>
          </div>
          <div className="details-item">
            <label>State</label>
            <span>{church.chr_app_state || "-"}</span>
          </div>
          <div className="details-item">
            <label>Country</label>
            <span>{church.chr_app_country || "-"}</span>
          </div>
          <div className="details-item">
            <label>Pincode</label>
            <span>{church.chr_app_pincode || "-"}</span>
          </div>
          <div className="details-item">
            <label>Timezone</label>
            <span>{church.chr_app_timezone || "-"}</span>
          </div>
        </div>

        <div className="details-section">
          <h4>Application Info</h4>
          <div className="details-item">
            <label>Applied On</label>
            <span>{formatDate(church.chr_app_applied_on)}</span>
          </div>
        </div>

        <div className="details-actions">
          {church.chr_app_status === "PENDING" && (
            <>
              <button className="approve-btn" onClick={handleApprove}>
                Approve
              </button>
              <button className="reject-btn" onClick={handleReject}>
                Reject
              </button>
            </>
          )}
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
