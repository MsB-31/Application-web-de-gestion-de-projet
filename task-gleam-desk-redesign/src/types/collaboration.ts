export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  editedAt?: string;
}

export type HistoryAction =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'TITLE_CHANGED'
  | 'DESCRIPTION_CHANGED'
  | 'COMMENT_ADDED';

export interface HistoryEntry {
  id: string;
  taskId: string;
  action: HistoryAction;
  authorId: string;
  authorName: string;
  authorInitials: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}
