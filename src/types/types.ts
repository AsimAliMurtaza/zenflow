// types.ts
export type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  assignedTo?: string;
};

export type TaskBoard = {
  "To Do": Task[];
  "In Progress": Task[];
  "Completed": Task[];
};

// types.ts
export type Project = {
  _id: string;
  name: string;
  description: string;
  completion: number;
  status: string;
  assignedTeam: { _id: string; name: string };
  teamMembers: string[];
  dueDate?: string;
};

export type Team = {
  _id: string;
  name: string;
};
