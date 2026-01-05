import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPmDashboard,
  fetchProjectsForUser,
} from "../../api/service.js";
import { getUser } from "../../auth/authStore.js";

function PMDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      if (!user) {
        return;
      }
      try {
        const data = await fetchProjectsForUser(user.id);
        if (!isMounted) {
          return;
        }
        setProjects(data ?? []);
      } catch (err) {
        console.error("Failed to load PM projects", err);
        if (isMounted) {
          setError("Unable to load projects for this PM.");
        }
      }
    };

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!projectId || projectId === "current") {
      if (projects.length > 0) {
        navigate(`/app/pm/dashboard/${projects[0].id}`, { replace: true });
      }
      return;
    }

    let isMounted = true;
    const loadSummary = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchPmDashboard(projectId);
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to load PM dashboard", err);
        if (isMounted) {
          setError("Unable to load project metrics for this site.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [projectId, projects, navigate]);

  useEffect(() => {
    if (projectId && projectId !== "current" && projects.length > 0) {
      const exists = projects.some((project) => project.id === projectId);
      if (!exists) {
        navigate(`/app/pm/dashboard/${projects[0].id}`, { replace: true });
      }
    }
  }, [projectId, projects, navigate]);

  const performanceScores = useMemo(() => {
    if (!summary?.performance) {
      return [];
    }
    return [
      { label: "Quality", value: summary.performance.qualityScore },
      { label: "Safety", value: summary.performance.safetyScore },
      { label: "Productivity", value: summary.performance.productivityScore },
    ];
  }, [summary]);

  const handleProjectChange = (event) => {
    const nextId = event.target.value;
    if (nextId) {
      navigate(`/app/pm/dashboard/${nextId}`);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Project Dashboard</h1>
          <p className="muted">Compare progress and keep the field teams on target.</p>
        </div>
        <select value={projectId && projectId !== "current" ? projectId : projects[0]?.id ?? ""} onChange={handleProjectChange}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <div className="surface-card">
          No projects assigned yet. Once projects are linked to your account, their metrics will appear here.
        </div>
      ) : null}

      {isLoading ? <div className="surface-card">Loading project metrics...</div> : null}
      {error ? <div className="error-card">{error}</div> : null}

      {summary && !isLoading ? (
        <>
          <div className="card-grid">
            <div className="info-card">
              <p className="muted">Hours</p>
              <p className="metric">{summary.hours?.used ?? 0} / {summary.hours?.planned ?? 0}</p>
              <p className="muted">Variance: {summary.hours?.variance ?? 0} hrs</p>
            </div>
            <div className="info-card">
              <p className="muted">Budget</p>
              <p className="metric">${summary.budget?.spent?.toLocaleString() ?? 0}</p>
              <p className="muted">Planned: ${summary.budget?.planned?.toLocaleString() ?? 0}</p>
            </div>
            <div className="info-card">
              <p className="muted">Attendance</p>
              <p className="metric">{summary.attendance?.present ?? 0} present</p>
                  <p className="muted">
                    {summary.attendance?.absent ?? 0} absent | {summary.attendance?.tardy ?? 0} tardy
                  </p>
            </div>
            <div className="info-card">
              <p className="muted">Pending approvals</p>
              <p className="metric">{summary.pendingApprovals ?? 0}</p>
              <p className="muted">Timesheets waiting for review</p>
            </div>
          </div>

          <div className="grid-two">
            <div className="surface-card">
              <div className="section-header">
                <h2>Budget vs Actual</h2>
                <p className="muted">Track the gap between planned hours and costs.</p>
              </div>
              <div className="stat-block">
                <div>
                  <span className="stat-label">Hours planned</span>
                  <span className="stat-value">{summary.hours?.planned ?? "--"}</span>
                </div>
                <div>
                  <span className="stat-label">Hours used</span>
                  <span className="stat-value">{summary.hours?.used ?? "--"}</span>
                </div>
                <div>
                  <span className="stat-label">Cost planned</span>
                  <span className="stat-value">${summary.budget?.planned?.toLocaleString() ?? "--"}</span>
                </div>
                <div>
                  <span className="stat-label">Cost spent</span>
                  <span className="stat-value">${summary.budget?.spent?.toLocaleString() ?? "--"}</span>
                </div>
              </div>
            </div>
            <div className="surface-card">
              <div className="section-header">
                <h2>Performance Pulse</h2>
                <p className="muted">Quality, safety, and productivity snapshot.</p>
              </div>
              <ul className="score-list">
                {performanceScores.map((score) => (
                  <li key={score.label}>
                    <span>{score.label}</span>
                    <span>{score.value ?? "--"}</span>
                  </li>
                ))}
                {performanceScores.length === 0 ? (
                  <li className="muted">Performance metrics not available yet.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default PMDashboard;
