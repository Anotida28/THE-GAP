import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  fetchEmployees,
  fetchProjectManagers,
  fetchProjects,
  updateProject,
} from "../../api/service.js";

const defaultFormState = {
  name: "",
  code: "",
  status: "PLANNING",
  startDate: "",
  endDate: "",
  budgetHours: "",
  budgetCost: "",
  latitude: "",
  longitude: "",
  radiusMeters: "",
  managerId: "",
  workerIds: [],
  address: "",
};

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setPageError("");
      try {
        const [projectData, managerData, employeeData] = await Promise.all([
          fetchProjects(),
          fetchProjectManagers(),
          fetchEmployees(),
        ]);
        if (!isMounted) {
          return;
        }
        setProjects(projectData ?? []);
        setManagers(managerData ?? []);
        setEmployees(employeeData ?? []);
      } catch (err) {
        console.error("Failed to load projects", err);
        if (isMounted) {
          setPageError("Unable to load projects. Try refreshing.");
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

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
        || project.code.toLowerCase().includes(searchTerm.toLowerCase())
        || project.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormState(defaultFormState);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingId(project.id);
    setFormError("");
    setFormState({
      name: project.name,
      code: project.code,
      status: project.status,
      startDate: project.startDate ?? "",
      endDate: project.endDate ?? "",
      budgetHours: project.budgetHours ?? "",
      budgetCost: project.budgetCost ?? "",
      latitude: project.latitude ?? "",
      longitude: project.longitude ?? "",
      radiusMeters: project.radiusMeters ?? "",
      managerId: project.managerId ?? "",
      workerIds: project.workerIds ?? [],
      address: project.address ?? "",
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

  const handleWorkerChange = (event) => {
    const options = Array.from(event.target.selectedOptions).map((option) => option.value);
    setFormState((prev) => ({ ...prev, workerIds: options }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const manager = managers.find((item) => item.id === formState.managerId);
      const payload = {
        ...formState,
        budgetHours: formState.budgetHours ? Number(formState.budgetHours) : null,
        budgetCost: formState.budgetCost ? Number(formState.budgetCost) : null,
        latitude: formState.latitude ? Number(formState.latitude) : null,
        longitude: formState.longitude ? Number(formState.longitude) : null,
        radiusMeters: formState.radiusMeters ? Number(formState.radiusMeters) : null,
        managerName: manager ? manager.name : "",
        workerNames: formState.workerIds
          .map((id) => employees.find((worker) => worker.id === id)?.name)
          .filter(Boolean),
      };

      let updated;
      if (editingId) {
        updated = await updateProject(editingId, payload);
        setProjects((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } else {
        updated = await createProject(payload);
        setProjects((prev) => [updated, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save project", err);
      setFormError("Unable to save project. Check the details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getManagerName = (project) => {
    if (project.managerName) {
      return project.managerName;
    }
    const manager = managers.find((managerOption) => managerOption.id === project.managerId);
    return manager ? manager.name : "Unassigned";
  };

  const statusOptions = [
    { value: "ALL", label: "All statuses" },
    { value: "PLANNING", label: "Planning" },
    { value: "ACTIVE", label: "Active" },
    { value: "ON_HOLD", label: "On hold" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const workerOptions = employees.filter((employee) => employee.role === "WORKER" || employee.role === "FOREMAN");

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Project Management</h1>
          <p className="muted">Define project scopes, geofences, and field teams.</p>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          Add Project
        </button>
      </div>

      {isLoading ? <div className="surface-card">Loading projects...</div> : null}
      {pageError ? <div className="error-card">{pageError}</div> : null}

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name, code, or ID"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statusOptions.map((option) => (
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
              <th>Code</th>
              <th>Project</th>
              <th>Status</th>
              <th>Dates</th>
              <th>Manager</th>
              <th>Budget (hrs)</th>
              <th>Geofence</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.code}</td>
                <td>
                  <div className="table-title">{project.name}</div>
                  <p className="muted">{project.address || project.id}</p>
                </td>
                <td>
                  <span className={`status-badge status-${(project.status || "").toLowerCase()}`}>
                    {project.status}
                  </span>
                </td>
                <td>
                  <div>{project.startDate || "TBD"}</div>
                  <div className="muted">{project.endDate || "TBD"}</div>
                </td>
                <td>{getManagerName(project)}</td>
                <td>{project.budgetHours ? project.budgetHours.toLocaleString() : "--"}</td>
                <td>
                  <div>Lat: {project.latitude ?? "--"}</div>
                  <div>Lng: {project.longitude ?? "--"}</div>
                  <div className="muted">Radius: {project.radiusMeters ?? "--"} m</div>
                </td>
                <td>
                  {(project.workerNames ?? []).slice(0, 3).map((name) => (
                    <span key={name} className="chip">
                      {name}
                    </span>
                  ))}
                  {project.workerNames?.length > 3 ? (
                    <span className="muted">+{project.workerNames.length - 3} more</span>
                  ) : null}
                </td>
                <td>
                  <button type="button" className="ghost-button" onClick={() => openEditModal(project)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={9} className="muted empty-state">
                  No projects found. Adjust filters or add a new project.
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
              <h2>{editingId ? "Edit project" : "Add project"}</h2>
              <button type="button" className="icon-button" onClick={closeModal} aria-label="Close">
                x
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-grid large">
                <label>
                  <span>Project name</span>
                  <input name="name" value={formState.name} onChange={handleChange} required />
                </label>
                <label>
                  <span>Project code</span>
                  <input name="code" value={formState.code} onChange={handleChange} />
                </label>
                <label>
                  <span>Status</span>
                  <select name="status" value={formState.status} onChange={handleChange}>
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </label>
                <label>
                  <span>Start date</span>
                  <input type="date" name="startDate" value={formState.startDate} onChange={handleChange} />
                </label>
                <label>
                  <span>End date</span>
                  <input type="date" name="endDate" value={formState.endDate} onChange={handleChange} />
                </label>
                <label>
                  <span>Budgeted hours</span>
                  <input
                    name="budgetHours"
                    type="number"
                    min="0"
                    step="1"
                    value={formState.budgetHours}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Budgeted cost ($)</span>
                  <input
                    name="budgetCost"
                    type="number"
                    min="0"
                    step="100"
                    value={formState.budgetCost}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Latitude</span>
                  <input
                    name="latitude"
                    type="number"
                    step="0.0001"
                    value={formState.latitude}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Longitude</span>
                  <input
                    name="longitude"
                    type="number"
                    step="0.0001"
                    value={formState.longitude}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Geofence radius (m)</span>
                  <input
                    name="radiusMeters"
                    type="number"
                    min="0"
                    step="10"
                    value={formState.radiusMeters}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Address</span>
                  <input name="address" value={formState.address} onChange={handleChange} />
                </label>
                <label>
                  <span>Project manager</span>
                  <select name="managerId" value={formState.managerId} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full-width">
                  <span>Field team (select multiple)</span>
                  <select multiple value={formState.workerIds} onChange={handleWorkerChange}>
                    {workerOptions.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
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

export default ProjectsPage;
