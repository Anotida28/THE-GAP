import { useEffect, useMemo, useState } from "react";
import {
  createEmployee,
  fetchEmployees,
  fetchProjects,
  fetchTrades,
  updateEmployee,
  updateEmployeeStatus,
} from "../../api/service.js";

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  role: "WORKER",
  trade: "",
  status: "ACTIVE",
  hourlyRate: "",
  assignedProjectId: "",
};

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [trades, setTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setPageError("");
      try {
        const [employeeData, projectData, tradeData] = await Promise.all([
          fetchEmployees(),
          fetchProjects(),
          fetchTrades(),
        ]);
        if (!isMounted) {
          return;
        }
        setEmployees(employeeData ?? []);
        setProjects(projectData ?? []);
        setTrades(tradeData ?? []);
      } catch (err) {
        console.error("Failed to load employees", err);
        if (isMounted) {
          setPageError("Unable to load employees. Try refreshing.");
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

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        || employee.email.toLowerCase().includes(searchTerm.toLowerCase())
        || employee.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;
      const matchesRole = roleFilter === "ALL" || employee.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [employees, searchTerm, statusFilter, roleFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormState(defaultFormState);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingId(employee.id);
    setFormError("");
    setFormState({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      trade: employee.trade,
      status: employee.status,
      hourlyRate: employee.hourlyRate ?? "",
      assignedProjectId: employee.assignedProjectId ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(defaultFormState);
    setEditingId(null);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const project = projects.find((item) => item.id === formState.assignedProjectId);
      const payload = {
        ...formState,
        hourlyRate: formState.hourlyRate ? Number(formState.hourlyRate) : null,
        assignedProjectName: project ? project.name : "",
      };

      let updated;
      if (editingId) {
        updated = await updateEmployee(editingId, payload);
        setEmployees((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } else {
        updated = await createEmployee(payload);
        setEmployees((prev) => [updated, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save employee", err);
      setFormError("Unable to save employee. Check the details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async (employee) => {
    const nextStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const updated = await updateEmployeeStatus(employee.id, nextStatus);
      setEmployees((prev) => prev.map((item) => (item.id === employee.id ? updated : item)));
    } catch (err) {
      console.error("Failed to update status", err);
      setPageError("Unable to update employee status. Try again.");
    }
  };

  const roleOptions = [
    { value: "ALL", label: "All roles" },
    { value: "WORKER", label: "Worker" },
    { value: "FOREMAN", label: "Foreman" },
    { value: "PM", label: "PM" },
    { value: "HR_ADMIN", label: "HR Admin" },
  ];

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p className="muted">Search, filter, and manage your workforce roster.</p>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          Add Employee
        </button>
      </div>

      {isLoading ? <div className="surface-card">Loading employees...</div> : null}
      {pageError ? <div className="error-card">{pageError}</div> : null}

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name, email, or ID"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Trade</th>
              <th>Project</th>
              <th>Status</th>
              <th>Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  <div className="table-title">{employee.name}</div>
                  <p className="muted">{employee.email}</p>
                </td>
                <td>{employee.role}</td>
                <td>{employee.trade}</td>
                <td>{employee.assignedProjectName || "Unassigned"}</td>
                <td>
                  <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td>{employee.hourlyRate ? `$${employee.hourlyRate}/hr` : "--"}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="ghost-button" onClick={() => openEditModal(employee)}>
                      Edit
                    </button>
                    <button type="button" className="ghost-button" onClick={() => handleStatusToggle(employee)}>
                      {employee.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="muted empty-state">
                  No employees found. Adjust filters or add a new record.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit employee" : "Add employee"}</h2>
              <button type="button" className="icon-button" onClick={closeModal} aria-label="Close">
                x
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  <span>Name</span>
                  <input name="name" value={formState.name} onChange={handleChange} required />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" value={formState.email} onChange={handleChange} required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" value={formState.phone} onChange={handleChange} placeholder="(415) 555-1234" />
                </label>
                <label>
                  <span>Role</span>
                  <select name="role" value={formState.role} onChange={handleChange}>
                    <option value="WORKER">Worker</option>
                    <option value="FOREMAN">Foreman</option>
                    <option value="PM">Project Manager</option>
                    <option value="HR_ADMIN">HR Admin</option>
                  </select>
                </label>
                <label>
                  <span>Trade</span>
                  <select name="trade" value={formState.trade} onChange={handleChange}>
                    <option value="">Select trade</option>
                    {trades.map((trade) => (
                      <option key={trade} value={trade}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select name="status" value={formState.status} onChange={handleChange}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </label>
                <label>
                  <span>Hourly rate</span>
                  <input
                    name="hourlyRate"
                    value={formState.hourlyRate}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="1"
                  />
                </label>
                <label>
                  <span>Assigned project</span>
                  <select name="assignedProjectId" value={formState.assignedProjectId} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {formError ? <p className="form-error">{formError}</p> : null}
              <div className="modal-footer">
                <button type="button" className="ghost-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default EmployeesPage;
