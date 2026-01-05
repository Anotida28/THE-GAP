import { useEffect, useMemo, useState } from "react";
import { approveTimesheet, fetchTimesheetApprovals, rejectTimesheet } from "../../api/service.js";

function TimesheetApprovals() {
  const [timesheets, setTimesheets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionState, setActionState] = useState({});

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchTimesheetApprovals();
        if (isMounted) {
          setTimesheets(data ?? []);
        }
      } catch (err) {
        console.error("Failed to load timesheets", err);
        if (isMounted) {
          setError("Unable to load timesheet approvals.");
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

  const filteredTimesheets = useMemo(() => {
    if (statusFilter === "ALL") {
      return timesheets;
    }
    return timesheets.filter((item) => item.status === statusFilter);
  }, [timesheets, statusFilter]);

  const formatDate = (value) => {
    if (!value) {
      return "--";
    }
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  const handleAction = async (timesheetId, action) => {
    setActionState((prev) => ({ ...prev, [timesheetId]: action }));
    try {
      const updated = action === "approve" ? await approveTimesheet(timesheetId) : await rejectTimesheet(timesheetId);
      setTimesheets((prev) => prev.map((item) => (item.id === timesheetId ? updated : item)));
    } catch (err) {
      console.error("Failed to update timesheet", err);
      setError("Unable to update timesheet status. Try again.");
    } finally {
      setActionState((prev) => ({ ...prev, [timesheetId]: null }));
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Timesheet Approvals</h1>
          <p className="muted">Review hours submitted by your crews and keep payroll on track.</p>
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="ALL">All</option>
        </select>
      </div>

      {isLoading ? <div className="surface-card">Loading timesheets...</div> : null}
      {error ? <div className="error-card">{error}</div> : null}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Project</th>
              <th>Week ending</th>
              <th>Submitted</th>
              <th>Total hours</th>
              <th>OT hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimesheets.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="table-title">{item.workerName}</div>
                  <p className="muted">{item.id}</p>
                </td>
                <td>{item.projectName}</td>
                <td>{formatDate(item.weekEnding)}</td>
                <td>{formatDate(item.submittedAt)}</td>
                <td>{item.totalHours}</td>
                <td>{item.overtimeHours}</td>
                <td>
                  <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      disabled={actionState[item.id] != null || item.status !== "PENDING"}
                      onClick={() => handleAction(item.id, "approve")}
                    >
                      {actionState[item.id] === "approve" ? "Approving..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      disabled={actionState[item.id] != null || item.status !== "PENDING"}
                      onClick={() => handleAction(item.id, "reject")}
                    >
                      {actionState[item.id] === "reject" ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTimesheets.length === 0 ? (
              <tr>
                <td colSpan={8} className="muted empty-state">
                  No timesheets match this filter right now.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TimesheetApprovals;
