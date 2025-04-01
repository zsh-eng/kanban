import { KanbanBoard } from '@/types/kanban';

export function createDefaultKanban(filename: string) {
  const filenameWithExtension = filename.endsWith('.md')
    ? filename
    : filename + '.md';

  const DEFAULT_KANBAN: {
    board: KanbanBoard;
    markdown: string;
    name: string;
  } = {
    board: {
      id: filenameWithExtension,
      title: filenameWithExtension,
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [
            {
              id: '1',
              completed: false,
              content: 'First task',
            },
          ],
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [],
        },
      ],
      filePath: filenameWithExtension,
    },
    markdown: `# Default Kanban Board

## To Do

- [ ] First task

## In Progress

`,
    name: filenameWithExtension,
  };

  return DEFAULT_KANBAN;
}
