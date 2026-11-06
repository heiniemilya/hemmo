export interface Task {
  id: string;
  title: string;
  category: string;
  intervalDays: number;
  lastDoneDate: string; // 'YYYY-MM-DD'
  doneBy?: string;
  nextDueDate: string; // 'YYYY-MM-DD'
  isDone?: boolean;
}