import { api } from "./client.js";
import {
  createMockEmployee,
  createMockProject,
  getDefaultMockPmProjectId,
  getMockAdminDashboard,
  getMockAuthPayload,
  getMockEmployees,
  getMockPmDashboard,
  getMockProjectManagers,
  getMockProjects,
  getMockProjectsForUser,
  getMockTimesheetApprovals,
  getMockTrades,
  setMockEmployeeStatus,
  updateMockEmployee,
  updateMockProject,
  updateMockTimesheetStatus,
} from "./mockData.js";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const simulateNetwork = async (result, delayMs = 200) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return result;
};

export async function fetchAdminDashboard() {
  if (useMock) {
    return simulateNetwork(getMockAdminDashboard());
  }
  const response = await api.get("/api/dashboard/admin");
  return response.data;
}

export async function fetchEmployees() {
  if (useMock) {
    return simulateNetwork(getMockEmployees());
  }
  const response = await api.get("/api/employees");
  return response.data;
}

export async function createEmployee(payload) {
  if (useMock) {
    return simulateNetwork(createMockEmployee(payload));
  }
  const response = await api.post("/api/employees", payload);
  return response.data;
}

export async function updateEmployee(id, payload) {
  if (useMock) {
    return simulateNetwork(updateMockEmployee(id, payload));
  }
  const response = await api.put(`/api/employees/${id}`, payload);
  return response.data;
}

export async function updateEmployeeStatus(id, status) {
  if (useMock) {
    return simulateNetwork(setMockEmployeeStatus(id, status));
  }
  const response = await api.put(`/api/employees/${id}`, { status });
  return response.data;
}

export async function fetchProjects() {
  if (useMock) {
    return simulateNetwork(getMockProjects());
  }
  const response = await api.get("/api/projects");
  return response.data;
}

export async function createProject(payload) {
  if (useMock) {
    return simulateNetwork(createMockProject(payload));
  }
  const response = await api.post("/api/projects", payload);
  return response.data;
}

export async function updateProject(id, payload) {
  if (useMock) {
    return simulateNetwork(updateMockProject(id, payload));
  }
  const response = await api.put(`/api/projects/${id}`, payload);
  return response.data;
}

export async function fetchPmDashboard(projectId) {
  if (useMock) {
    return simulateNetwork(getMockPmDashboard(projectId));
  }
  const response = await api.get(`/api/dashboard/pm/${projectId}`);
  return response.data;
}

export async function fetchTimesheetApprovals() {
  if (useMock) {
    return simulateNetwork(getMockTimesheetApprovals());
  }
  const response = await api.get("/api/timesheet/pending-approvals");
  return response.data;
}

export async function approveTimesheet(id) {
  if (useMock) {
    return simulateNetwork(updateMockTimesheetStatus(id, "APPROVED"));
  }
  const response = await api.post(`/api/timesheet/${id}/approve`);
  return response.data;
}

export async function rejectTimesheet(id) {
  if (useMock) {
    return simulateNetwork(updateMockTimesheetStatus(id, "REJECTED"));
  }
  const response = await api.post(`/api/timesheet/${id}/reject`);
  return response.data;
}

export async function fetchProjectManagers() {
  if (useMock) {
    return simulateNetwork(getMockProjectManagers());
  }
  const response = await api.get("/api/users?role=PM");
  return response.data;
}

export async function fetchTrades() {
  if (useMock) {
    return simulateNetwork(getMockTrades());
  }
  // Replace with backend endpoint when available.
  return [];
}

export function getDefaultPmProjectId() {
  if (useMock) {
    return getDefaultMockPmProjectId();
  }
  return null;
}

export async function fetchProjectsForUser(userId) {
  if (useMock) {
    return simulateNetwork(getMockProjectsForUser(userId));
  }
  const response = await api.get(`/api/projects?managerId=${encodeURIComponent(userId)}`);
  return response.data;
}

export function getDevAuthPayload(role) {
  if (!useMock) {
    throw new Error("Dev auth payload is only available in mock mode");
  }
  return getMockAuthPayload(role);
}

export function isMockMode() {
  return useMock;
}
