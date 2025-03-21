import {
  KanbanBoardColumn,
  KanbanCompletedTasksColumn,
} from '@/components/kanban/kanban-board-column';
import type { KanbanBoard as KanbanBoardType } from '@/types/kanban';
interface KanbanBoardProps {
  board: KanbanBoardType;
  onBoardChange: (board: KanbanBoardType) => void;
}

export function KanbanBoard({ board, onBoardChange }: KanbanBoardProps) {
  const completedTasks = board.columns.flatMap((column) =>
    column.tasks.filter((task) => task.completed)
  );

  return (
    <div className='p-2 h-full'>
      <div className='flex gap-2 overflow-x-auto h-full'>
        {board.columns.map((column) => (
          <KanbanBoardColumn
            key={column.id}
            column={column}
            onBoardChange={onBoardChange}
            board={board}
          />
        ))}
        <KanbanCompletedTasksColumn tasks={completedTasks} />
      </div>
    </div>
  );
}
