import "../../styles/dashboard.css";

const logs = [
  { id: 1, text: "Platform admin approved St. Mary Church", time: "10 mins ago" },
  { id: 2, text: "Failed login attempt detected", time: "25 mins ago" },
  { id: 3, text: "Employee email assigned to Grace Community Church", time: "1 hour ago" },
  { id: 4, text: "User blocked by platform admin", time: "2 hours ago" },
  { id: 5, text: "New church registration submitted", time: "Yesterday" }
];

export default function SecurityLogs() {
  return (
    <div className="dashboard">

      <h1 className="dashboard-title">Security & Audit Logs</h1>
     {/*  <p style={{ color: "#777", marginBottom: "14px" }}>
        System level events, approvals, and security activities.
      </p> */}
      <p style={{ color: "#777", fontSize: "13px", marginBottom: "14px" }}>
  Audit logging will be fully enabled once backend event tracking is integrated.
</p>

      <div className="dashboard-card large">
        <ul className="activity-list">
          {logs.map(log => (
            <li key={log.id} className="activity-item">
              <p>{log.text}</p>
              <span>{log.time}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
