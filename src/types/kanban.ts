export interface KanbanTask {
  id: string;
  content: string;
  completed: boolean;
  metadata: {
    created: string;
    modified: string;
    links: string[];
  };
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

export type DragEndResult = {
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
};
