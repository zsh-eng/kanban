import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { KanbanBoard, KanbanTask } from '@/types/kanban';
import { CheckCircle, Columns, MoveRight } from 'lucide-react';

interface TaskContextMenuProps {
  children: React.ReactNode;
  task: KanbanTask;
  board: KanbanBoard;
  columnId: string;
  onBoardChange: (board: KanbanBoard) => void;
}

export function TaskContextMenu({
  children,
  task,
  board,
  columnId,
  onBoardChange,
}: TaskContextMenuProps) {
  const handleMarkAsCompleted = () => {
    const newBoard = { ...board };

    // Find the column that contains the task
    const column = newBoard.columns.find((col) => col.id === columnId);
    if (!column) return;

    // Find the task in the column
    const taskIndex = column.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1) return;

    // Update the task to be completed
    column.tasks[taskIndex].completed = true;

    onBoardChange(newBoard);
  };

  const handleMoveToColumn = (targetColumnId: string) => {
    if (targetColumnId === columnId) return;

    const newBoard = { ...board };

    // Find the source column
    const sourceColumn = newBoard.columns.find((col) => col.id === columnId);
    if (!sourceColumn) return;

    // Find the target column
    const targetColumn = newBoard.columns.find(
      (col) => col.id === targetColumnId
    );
    if (!targetColumn) return;

    // Find the task in the source column
    const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1) return;

    // Remove the task from source column
    const [removedTask] = sourceColumn.tasks.splice(taskIndex, 1);

    // Add the task to target column
    targetColumn.tasks.push(removedTask);

    onBoardChange(newBoard);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className='w-64'>
        <ContextMenuItem onClick={handleMarkAsCompleted}>
          <CheckCircle className='mr-2 h-4 w-4' />
          Mark as completed
        </ContextMenuItem>
        <ContextMenuItem className='font-medium text-muted-foreground pointer-events-none'>
          <Columns className='mr-2 h-4 w-4' />
          Move to column
        </ContextMenuItem>
        {board.columns.map((column) =>
          column.id !== columnId ? (
            <ContextMenuItem
              key={column.id}
              onClick={() => handleMoveToColumn(column.id)}
              className='pl-6'
            >
              <MoveRight className='mr-2 h-4 w-4' />
              {column.title}
            </ContextMenuItem>
          ) : null
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
