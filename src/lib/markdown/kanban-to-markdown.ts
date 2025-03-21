import { KanbanBoard } from '@/types/kanban';

export const kanbanToMarkdown = async (board: KanbanBoard): Promise<string> => {
  let markdown = `# ${board.title}\n\n`;

  board.columns.forEach((column) => {
    markdown += `## ${column.title}\n\n`;
    column.tasks.forEach((task) => {
      const checkbox = task.completed ? '[x]' : '[ ]';
      markdown += `- ${checkbox} ${task.content}\n`;
    });
    markdown += '\n';
  });

  return markdown;
};
