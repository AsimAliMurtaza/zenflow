// Enums for status and priority
export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

// Task Type
export type Task = {
  _id: string;
  title: string;
  sprint: Sprint;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date;
  assignedTo?: string | null;
  project: Project;
};

export type TaskBoard = {
  "To Do": Task[];
  "In Progress": Task[];
  Completed: Task[];
};

// TeamMember Type
export type TeamMember = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

// Sprint Type
export type Sprint = {
  _id: string;
  name: string;
  projectId: Project;
  startDate: string | Date;
  endDate: string | Date;
  tasks: Task[];
  completion: number; // represents percent completion of tasks
};

// Team Type
export type Team = {
  _id: string;
  name: string;
  members?: string[]; // Added members array (optional)
};
// types/types.ts
export type Project = {
  _id: string;
  name: string;
  description: string;
  status: TaskStatus;
  assignedTeam: string | null; // Use Team instead of string
  dueDate: string;
  completion?: number; // Optional
  sprints?: Sprint[]; // Optional
  createdAt?: Date; // Optional
  updatedAt?: Date; // Optional
  createdBy?: string; // Optional
};