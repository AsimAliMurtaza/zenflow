// types.ts
export type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  assignedTo: { name: string };
};

export type TaskBoard = {
  "To Do": Task[];
  "In Progress": Task[];
  Completed: Task[];
};

// types.ts
export type Project = {
  _id: string;
  name: string;
  description: string;
  completion: number;
  status: string;
  assignedTeam: { _id: string; name: string };
  dueDate?: string;
  tasks: Task[];
  sprints: Sprint[];
};

export type Team = {
  _id: string;
  name: string;
};

export type Sprint = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
};
