const now = new Date();

const hrAdminUser = {
  id: "user-hr-001",
  name: "Tariro Moyo",
  email: "tariro.moyo@thegapcompany.co.zw",
  role: "HR_ADMIN",
};

const pmUser = {
  id: "user-pm-001",
  name: "Kudzai Ndlovu",
  email: "kudzai.ndlovu@thegapcompany.co.zw",
  role: "PM",
};

const projectManagers = [
  { id: pmUser.id, name: pmUser.name },
  { id: "user-pm-002", name: "Faith Mlambo" },
  { id: "user-pm-003", name: "Lewis Banda" },
];

const trades = ["Carpenter", "Electrician", "Plumber", "Steel Worker", "Painter"];

const employees = [
  {
    id: "EMP-001",
    name: "Tadiwa Chikomba",
    role: "FOREMAN",
    trade: "Carpenter",
    email: "tadiwa.chikomba@thegapcompany.co.zw",
    phone: "+263 77 234 8812",
    status: "ACTIVE",
    hourlyRate: 42,
    assignedProjectId: "PRJ-001",
    assignedProjectName: "Harare CBD Office Fit-Out",
    hireDate: "2023-02-14",
  },
  {
    id: "EMP-002",
    name: "Ruvimbo Nyathi",
    role: "WORKER",
    trade: "Electrician",
    email: "ruvimbo.nyathi@thegapcompany.co.zw",
    phone: "+263 77 365 9921",
    status: "ACTIVE",
    hourlyRate: 36,
    assignedProjectId: "PRJ-002",
    assignedProjectName: "Bulawayo Industrial Depot",
    hireDate: "2022-10-03",
  },
  {
    id: "EMP-003",
    name: "Simba Dube",
    role: "WORKER",
    trade: "Steel Worker",
    email: "simba.dube@thegapcompany.co.zw",
    phone: "+263 71 442 1184",
    status: "INACTIVE",
    hourlyRate: 34,
    assignedProjectId: "PRJ-001",
    assignedProjectName: "Harare CBD Office Fit-Out",
    hireDate: "2021-06-28",
  },
  {
    id: "EMP-004",
    name: "Tatenda Moyo",
    role: "FOREMAN",
    trade: "Painter",
    email: "tatenda.moyo@thegapcompany.co.zw",
    phone: "+263 77 530 7744",
    status: "ACTIVE",
    hourlyRate: 40,
    assignedProjectId: "PRJ-003",
    assignedProjectName: "Mutare Solar Works",
    hireDate: "2024-03-19",
  },
];

const projectTemplate = (overrides) => ({
  id: "PRJ-NEW",
  name: "New Project",
  code: "",
  status: "PLANNING",
  startDate: "",
  endDate: "",
  budgetHours: 0,
  budgetCost: 0,
  latitude: 0,
  longitude: 0,
  radiusMeters: 150,
  managerId: projectManagers[0].id,
  managerName: projectManagers[0].name,
  workerIds: [],
  workerNames: [],
  address: "",
  ...overrides,
});

const projects = [
  projectTemplate({
    id: "PRJ-001",
    name: "Harare CBD Office Fit-Out",
    code: "HCO-25",
    status: "ACTIVE",
    startDate: "2024-06-10",
    endDate: "2025-04-30",
    budgetHours: 3800,
    budgetCost: 295000,
    latitude: -17.8252,
    longitude: 31.0335,
    radiusMeters: 180,
    managerId: pmUser.id,
    managerName: pmUser.name,
    workerIds: ["EMP-001", "EMP-003"],
    workerNames: ["Tadiwa Chikomba", "Simba Dube"],
    address: "48 Jason Moyo Ave, Harare",
  }),
  projectTemplate({
    id: "PRJ-002",
    name: "Bulawayo Industrial Depot",
    code: "BID-25",
    status: "ACTIVE",
    startDate: "2024-02-20",
    endDate: "2025-11-15",
    budgetHours: 5100,
    budgetCost: 410000,
    latitude: -20.1325,
    longitude: 28.6265,
    radiusMeters: 240,
    managerId: "user-pm-002",
    managerName: "Faith Mlambo",
    workerIds: ["EMP-002"],
    workerNames: ["Ruvimbo Nyathi"],
    address: "1146 Khami Rd, Bulawayo",
  }),
  projectTemplate({
    id: "PRJ-003",
    name: "Mutare Solar Works",
    code: "MSW-25",
    status: "PLANNING",
    startDate: "2025-03-01",
    endDate: "2026-07-30",
    budgetHours: 5900,
    budgetCost: 475000,
    latitude: -18.9707,
    longitude: 32.6709,
    radiusMeters: 200,
    managerId: "user-pm-003",
    managerName: "Lewis Banda",
    workerIds: ["EMP-004"],
    workerNames: ["Tatenda Moyo"],
    address: "32 Aerodrome Rd, Mutare",
  }),
];

const defaultPmProjectId = "PRJ-001";

const adminDashboard = {
  summary: [
    { label: "Active Employees", value: employees.filter((e) => e.status === "ACTIVE").length },
    { label: "Open Projects", value: projects.filter((p) => p.status === "ACTIVE").length },
    { label: "Pending Timesheets", value: 7 },
    { label: "Safety Incidents (30d)", value: 1 },
  ],
  alerts: [
    {
      id: "alert-1",
      title: "Safety refreshers due",
      detail: "Three electrical workers need site safety refreshers in 14 days.",
      type: "warning",
    },
    {
      id: "alert-2",
      title: "Overtime trending up",
      detail: "Harare CBD Office Fit-Out exceeded its overtime threshold last week.",
      type: "info",
    },
  ],
  recentActivity: [
    {
      id: "activity-1",
      description: "Timesheet approved for Tadiwa Chikomba (PRJ-001)",
      timestamp: new Date(now.getTime() - 1000 * 60 * 55).toISOString(),
    },
    {
      id: "activity-2",
      description: "New worker onboarded: Precious Chuma",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "activity-3",
      description: "Project status updated: Mutare Solar Works",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
    },
  ],
};

const pmDashboardSummaries = {
  "PRJ-001": {
    projectId: "PRJ-001",
    projectName: "Harare CBD Office Fit-Out",
    weekOf: "2025-01-05",
    hours: {
      planned: 3800,
      used: 1510,
      variance: -85,
    },
    budget: {
      planned: 295000,
      spent: 118400,
      variance: -16200,
    },
    attendance: {
      present: 36,
      absent: 2,
      tardy: 3,
    },
    performance: {
      qualityScore: 92,
      safetyScore: 97,
      productivityScore: 89,
    },
    pendingApprovals: 5,
  },
  "PRJ-002": {
    projectId: "PRJ-002",
    projectName: "Bulawayo Industrial Depot",
    weekOf: "2025-01-05",
    hours: {
      planned: 5100,
      used: 2030,
      variance: -40,
    },
    budget: {
      planned: 410000,
      spent: 171300,
      variance: -8700,
    },
    attendance: {
      present: 32,
      absent: 1,
      tardy: 4,
    },
    performance: {
      qualityScore: 91,
      safetyScore: 96,
      productivityScore: 90,
    },
    pendingApprovals: 2,
  },
};

const timesheetApprovals = [
  {
    id: "TS-1001",
    workerName: "Tadiwa Chikomba",
    projectName: "Harare CBD Office Fit-Out",
    projectId: "PRJ-001",
    weekEnding: "2024-12-27",
    submittedAt: "2024-12-28T17:30:00Z",
    totalHours: 42,
    overtimeHours: 4,
    status: "PENDING",
  },
  {
    id: "TS-1002",
    workerName: "Ruvimbo Nyathi",
    projectName: "Bulawayo Industrial Depot",
    projectId: "PRJ-002",
    weekEnding: "2024-12-27",
    submittedAt: "2024-12-28T16:45:00Z",
    totalHours: 40,
    overtimeHours: 0,
    status: "PENDING",
  },
  {
    id: "TS-1003",
    workerName: "Tatenda Moyo",
    projectName: "Mutare Solar Works",
    projectId: "PRJ-003",
    weekEnding: "2024-12-20",
    submittedAt: "2024-12-21T15:10:00Z",
    totalHours: 38,
    overtimeHours: 0,
    status: "PENDING",
  },
];

let employeeCounter = employees.length + 1;
let projectCounter = projects.length + 1;

const mockState = {
  adminDashboard,
  employees,
  projects,
  pmDashboardSummaries,
  timesheetApprovals,
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getMockAdminDashboard() {
  return clone(mockState.adminDashboard);
}

export function getMockEmployees() {
  return clone(mockState.employees);
}

export function createMockEmployee(data) {
  const newEmployee = {
    id: `EMP-${String(employeeCounter).padStart(3, "0")}`,
    status: "ACTIVE",
    hourlyRate: 0,
    assignedProjectId: "",
    assignedProjectName: "",
    hireDate: new Date().toISOString().slice(0, 10),
    ...data,
  };
  employeeCounter += 1;
  mockState.employees.push(newEmployee);
  return clone(newEmployee);
}

export function updateMockEmployee(id, data) {
  const index = mockState.employees.findIndex((employee) => employee.id === id);
  if (index === -1) {
    throw new Error("Employee not found");
  }
  mockState.employees[index] = {
    ...mockState.employees[index],
    ...data,
  };
  return clone(mockState.employees[index]);
}

export function setMockEmployeeStatus(id, status) {
  return updateMockEmployee(id, { status });
}

export function getMockProjects() {
  return clone(mockState.projects);
}

export function createMockProject(data) {
  const newProject = {
    ...projectTemplate({}),
    id: `PRJ-${String(projectCounter).padStart(3, "0")}`,
    status: "PLANNING",
    ...data,
  };
  projectCounter += 1;
  mockState.projects.push(newProject);
  return clone(newProject);
}

export function updateMockProject(id, data) {
  const index = mockState.projects.findIndex((project) => project.id === id);
  if (index === -1) {
    throw new Error("Project not found");
  }
  mockState.projects[index] = {
    ...mockState.projects[index],
    ...data,
  };
  return clone(mockState.projects[index]);
}

export function getMockPmDashboard(projectId) {
  const summary = mockState.pmDashboardSummaries[projectId];
  if (!summary) {
    throw new Error("PM dashboard data not found");
  }
  return clone(summary);
}

export function getMockTimesheetApprovals() {
  return clone(mockState.timesheetApprovals);
}

export function updateMockTimesheetStatus(id, status) {
  const index = mockState.timesheetApprovals.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Timesheet not found");
  }
  mockState.timesheetApprovals[index] = {
    ...mockState.timesheetApprovals[index],
    status,
    processedAt: new Date().toISOString(),
  };
  return clone(mockState.timesheetApprovals[index]);
}

export function getMockAuthPayload(role) {
  if (role === "HR_ADMIN") {
    return { accessToken: "mock-token-admin", user: hrAdminUser };
  }
  if (role === "PM") {
    return { accessToken: "mock-token-pm", user: pmUser };
  }
  throw new Error("Unsupported role");
}

export function getMockProjectManagers() {
  return clone(projectManagers);
}

export function getMockTrades() {
  return clone(trades);
}

export function getDefaultMockPmProjectId() {
  return defaultPmProjectId;
}

export function getMockProjectsForUser(userId) {
  return clone(mockState.projects.filter((project) => project.managerId === userId));
}

export function resetMockState() {
  // Intentionally left blank for now; implement if needed for tests.
}
