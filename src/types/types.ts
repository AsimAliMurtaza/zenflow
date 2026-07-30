// Enums for status and priority
export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";
export type SprintStatus = "Active" | "Planned" | "Completed";

// Assignee type (join table row)
export type TaskAssignee = {
  id: string;
  taskId: string;
  userEmail: string;
};

// Task Type
export type Task = {
  id: string;
  title: string;
  sprint?: Sprint;
  sprintId: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date | null;
  assignees?: TaskAssignee[];
  projectId: string;
  project?: Project;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type TaskBoard = {
  "To Do": Task[];
  "In Progress": Task[];
  Completed: Task[];
};

// TeamMember Type (join table row with nested user)
export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt?: Date | string;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
};

// Sprint Type
export type Sprint = {
  id: string;
  name: string;
  projectId: string;
  startDate: string | Date;
  endDate: string | Date;
  status?: SprintStatus;
  tasks?: Task[];
  completion: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Team Type
export type Team = {
  id: string;
  name: string;
  members?: TeamMember[];
  createdAt?: Date | string;
};

// Project Type
export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  assignedTeamId?: string | null;
  assignedTeam?: Team | null;
  dueDate?: string | null;
  completion?: number;
  sprints?: Sprint[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdById?: string;
};