export interface Task {
  id: string;
  title: string;
  category: string;
  intervalDays: number;
  season: 'koko vuosi' | 'talvi' | 'kesä' | 'syksy' | 'kevät';
  notes?: string;
  lastDoneDate: string; // 'YYYY-MM-DD'
  doneBy?: string;
  nextDueDate: string; // 'YYYY-MM-DD'
}