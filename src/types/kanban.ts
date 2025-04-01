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
