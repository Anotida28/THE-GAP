function DashboardPage() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="muted">Welcome back. Your workspace is ready.</p>
      </div>
      <div className="card-grid">
        <div className="info-card">
          <h2>Open tasks</h2>
          <p className="muted">Connect the API to populate your data.</p>
        </div>
        <div className="info-card">
          <h2>Recent activity</h2>
          <p className="muted">Log in to see the latest changes.</p>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
