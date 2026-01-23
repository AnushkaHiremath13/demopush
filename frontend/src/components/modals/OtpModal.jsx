import { useState, useEffect } from "react";
import "../../styles/modals.css";

export default function OtpModal({ open, onClose, onVerify, emailOrPhone }) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (!open) return;

    setTime(30);
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        <h2>Verify OTP</h2>
        <p>We sent a code to <b>{emailOrPhone}</b></p>

        <input
          className="otp-input"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="primary-btn" onClick={() => onVerify(otp)}>
          Verify
        </button>

        {time > 0 ? (
          <p className="timer-text">Resend OTP in {time}s</p>
        ) : (
          <button className="link-btn">Resend OTP</button>
        )}

        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
