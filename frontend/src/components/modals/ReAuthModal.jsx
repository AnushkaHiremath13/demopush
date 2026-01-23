import { useState } from "react";
import "../../styles/modals.css";

export default function ReAuthModal({ open, onClose, onConfirm }) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        <h2>Security Check</h2>
        <p>For your security, please confirm your password.</p>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary-btn" onClick={() => onConfirm(password)}>
          Continue
        </button>

        <button className="link-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
