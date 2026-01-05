import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../api/service.js";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await fetchAdminDashboard();
        if (isMounted) {
          setDashboard(result);
        }
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
        if (isMounted) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatTimestamp = (isoString) => {
    if (!isoString) {
      return "";
    }
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="muted">High-level pulse on your workforce and projects.</p>
      </div>

      {isLoading ? <div className="surface-card">Loading dashboard...</div> : null}
      {error ? <div className="error-card">{error}</div> : null}

      {dashboard && !isLoading ? (
        <>
          <div className="card-grid">
            {dashboard.summary?.map((item) => (
              <div className="info-card" key={item.label}>
                <p className="muted">{item.label}</p>
                <p className="metric">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid-two">
            <div className="surface-card">
              <div className="section-header">
                <h2>Alerts & Risks</h2>
                <p className="muted">Prioritize items that need your attention.</p>
              </div>
              <ul className="alert-list">
                {(dashboard.alerts ?? []).map((alert) => (
                  <li key={alert.id} className={`alert alert-${alert.type}`}>
                    <p className="alert-title">{alert.title}</p>
                    <p className="muted">{alert.detail}</p>
                  </li>
                ))}
                {dashboard.alerts?.length ? null : (
                  <li className="muted">No alerts right now. Keep up the great work.</li>
                )}
              </ul>
            </div>
            <div className="surface-card">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <p className="muted">Latest changes across your organization.</p>
              </div>
              <ul className="activity-feed">
                {(dashboard.recentActivity ?? []).map((item) => (
                  <li key={item.id}>
                    <p>{item.description}</p>
                    <span className="muted">{formatTimestamp(item.timestamp)}</span>
                  </li>
                ))}
                {dashboard.recentActivity?.length ? null : (
                  <li className="muted">Activity will appear here once the API is connected.</li>
                )}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default AdminDashboard;
