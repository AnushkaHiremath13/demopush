import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { api } from "../../api/api";

export default function ChurchDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= DATE FORMATTER ================= */

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-GB");
  };

  /* ================= LOAD DETAILS ================= */

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await api(
          `/platform/church-applicants/${applicationId}`
        );

        if (data?.success) {
          setChurch(data.application);
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

  /* ================= ACTIONS ================= */

  const handleApprove = async () => {
    try {
      await api(
        `/platform/church-applicants/${applicationId}/approve`,
        { method: "PATCH" }
      );
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Approval failed");
    }
  };

  const handleReject = async () => {
    try {
      await api(
        `/platform/church-applicants/${applicationId}/reject`,
        { method: "PATCH" }
      );
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Rejection failed");
    }
  };

  /* ================= STATES ================= */

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!church) return <p style={{ padding: 20 }}>Application not found</p>;

  /* ================= UI ================= */

  return (
    <div className="dashboard details-page">
      <h1 className="dashboard-title">Church Application Details</h1>

      <div className="dashboard-card large">
        <div className="details-header">
          <h2>{church.cname}</h2>
          <span className="status-pill pending">
            {church.application_status}
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
          <h4>Contact Information</h4>
          <div className="details-list">
            <div className="details-item">
              <label>Email</label>
              <span>{church.cemail || "-"}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Address & Location</h4>
          <div className="details-list">
            <div className="details-item">
              <label>Address</label>
              <span>{church.caddress || "-"}</span>
            </div>
            <div className="details-item">
              <label>City</label>
              <span>{church.ccity || "-"}</span>
            </div>
            <div className="details-item">
              <label>State</label>
              <span>{church.cstate || "-"}</span>
            </div>
            <div className="details-item">
              <label>Country</label>
              <span>{church.ccountry || "-"}</span>
            </div>
            <div className="details-item">
              <label>Pincode</label>
              <span>{church.cpincode || "-"}</span>
            </div>
            <div className="details-item">
              <label>Timezone</label>
              <span>{church.ctimezone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Application Info</h4>
          <div className="details-list">
            <div className="details-item">
              <label>Applied On</label>
              <span>{formatDate(church.applied_on)}</span>
            </div>
          </div>
        </div>

        <div className="details-actions">
          {church.application_status === "PENDING" && (
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
