export interface KanbanTask {
  id: string;
  content: string;
  completed: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
  filePath: string;
}

export interface MarkdownFile {
  path: string;
  content: string;
  lastModified: number;
}

export type KanbanUpdateSource = 'board' | 'editor' | 'external';

export type KanbanUpdateRequest = {
  timestamp: number;
  source: KanbanUpdateSource;
  content: string;
  id: string;
};

export type KanbanUpdateResponse = {
  timestamp: number;
  source: KanbanUpdateSource;
  board: KanbanBoard;
  id: string;
};
