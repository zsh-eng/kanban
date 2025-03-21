import { StyledCircle } from '@/components/icons/styled-circle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { KanbanBoard, KanbanColumn, KanbanTask } from '@/types/kanban';
import { CheckCircle, PlusIcon } from 'lucide-react';

export function KanbanBoardColumn({
  column,
  onBoardChange,
  board,
}: {
  column: KanbanColumn;
  onBoardChange: (board: KanbanBoard) => void;
  board: KanbanBoard;
}) {
  return (
    <div key={column.id} className='flex-shrink-0 w-72 pb-8'>
      <Card className='p-2 shadow-none rounded-sm bg-muted/20 gap-2 h-full'>
        <div className='flex items-center gap-2 pl-2 mt-2 mb-2'>
          <StyledCircle className='' />
          <h2 className='text-sm font-semibold mb-0 text-muted-foreground'>
            {column.title}
          </h2>
        </div>

        <div className='space-y-2 overflow-y-auto h-full'>
          {column.tasks.map((task, index) =>
            !task.completed ? (
              <div key={`${task.id}-${index}`}>
                <Card className='p-2 rounded-sm animate-in fade-in zoom-in shadow-none min-h-10'>
                  <div className='flex items-center gap-2 text-sm text-wrap'>
                    <StyledCircle className='' />
                    <div
                      className={
                        task.content === '' ? 'text-muted-foreground' : ''
                      }
                    >
                      {task.content === ''
                        ? 'Fill in a description...'
                        : task.content}
                    </div>
                  </div>
                </Card>
              </div>
            ) : null
          )}

          <Button
            variant='ghost'
            size='sm'
            className='w-full rounded-sm bg-muted/50'
            onClick={() => {
              const newBoard = { ...board };
              newBoard.columns[0].tasks.push({
                id: crypto.randomUUID(),
                content: '',
                completed: false,
                metadata: {
                  created: new Date().toISOString(),
                  modified: new Date().toISOString(),
                  links: [],
                },
              });
              onBoardChange(newBoard);
            }}
          >
            <PlusIcon className='w-4 h-4 mr-2' />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function KanbanCompletedTasksColumn({ tasks }: { tasks: KanbanTask[] }) {
  return (
    <div className='flex-shrink-0 w-80 pb-8'>
      <Card className='p-2 shadow-none rounded-sm bg-muted/20 gap-2 h-full'>
        <div className='flex items-center gap-2 pl-2 mt-2 mb-2'>
          <CheckCircle className='w-4 h-4 text-muted-foreground' />
          <h2 className='text-sm font-semibold mb-0 text-muted-foreground'>
            Done
          </h2>
        </div>

        <div className='space-y-2 overflow-y-auto h-full'>
          {tasks.map((task, index) => (
            <div key={`${task.id}-${index}`}>
              <Card className='p-3 shadow-xs rounded-sm animate-in fade-in zoom-in'>
                <div className='flex items-center gap-2 text-sm min-h-8 text-wrap'>
                  <CheckCircle className='w-4 h-4 text-muted-foreground' />
                  <div
                    className={
                      task.content === '' ? 'text-muted-foreground' : ''
                    }
                  >
                    {task.content === ''
                      ? 'Fill in a description...'
                      : task.content}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
