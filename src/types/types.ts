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