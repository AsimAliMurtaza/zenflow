// types/dashboard.ts
export interface ProjectReport {
    name: string;
    dueDate: string;
    completion?: number;
  }
  
  export interface TaskReport {
    projectId: string;
    projectName: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  }
  
  export interface DashboardReports {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    approachingDeadlineProjects: ProjectReport[];
    overdueProjects: ProjectReport[];
    projectCompletions: ProjectReport[];
  }