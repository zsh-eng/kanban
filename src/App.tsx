import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { kanbanToMarkdown } from '@/lib/markdown/kanban-to-markdown';
import type { KanbanBoard as KanbanBoardType } from '@/types/kanban';
import MarkdownWorker from '@/workers/markdown?worker';
import { PanelRight, Sidebar } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useChangeThemeShortcut } from '@/hooks/use-change-theme-shortcut';
import { useKanbanStore } from '@/hooks/use-store';
import { useToggleRightSidebar } from '@/hooks/use-toggle-right-sidebar';
import { kanbanGlobalStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import './index.css';

const worker = new MarkdownWorker();

export default function App() {
  useChangeThemeShortcut();
  const { isRightSidebarOpen, setIsRightSidebarOpen } = useToggleRightSidebar();

  const kanbanGlobalState = useKanbanStore((state) => state);

  const [currentFile, setCurrentFile] = useState<string>('untitled.md');
  const TEMP_KANBAN = kanbanGlobalState[currentFile];
  const markdown = TEMP_KANBAN?.markdown ?? '';
  const board = TEMP_KANBAN?.board ?? null;

  useEffect(() => {
    const handleMarkdownWorkerMessage = (event: MessageEvent) => {
      const { result } = event.data;
      kanbanGlobalStore.setState({
        [currentFile]: {
          ...kanbanGlobalState[currentFile],
          board: result,
        },
      });
    };

    worker.addEventListener('message', handleMarkdownWorkerMessage);
    return () => {
      worker.removeEventListener('message', handleMarkdownWorkerMessage);
    };
  }, []);

  const handleMarkdownChange = useCallback(
    async (newMarkdown: string) => {
      worker.postMessage({
        markdown: newMarkdown,
        filePath: currentFile || 'untitled.md',
      });
      // TODO: persist to file
    },
    [currentFile]
  );

  const handleBoardChange = async (newBoard: KanbanBoardType) => {
    const newMarkdown = await kanbanToMarkdown(newBoard);
    kanbanGlobalStore.setState({
      [currentFile]: {
        ...kanbanGlobalState[currentFile],
        markdown: newMarkdown,
        board: newBoard,
      },
    });

    // TODO: persist to file
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-screen flex flex-col dark:bg-background dark:text-foreground'>
      <div className='border-b px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='icon' className='size-7'>
            <Sidebar className='w-4 h-4' />
          </Button>
          <h1 className='text-sm'>{board.title}</h1>
        </div>

        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'size-7',
            isRightSidebarOpen && 'bg-accent dark:bg-accent/50'
          )}
          onClick={() => setIsRightSidebarOpen((prev) => !prev)}
        >
          <PanelRight className='w-4 h-4' />
        </Button>
      </div>

      <ResizablePanelGroup direction='horizontal' className='flex-1'>
        <ResizablePanel defaultSize={50}>
          <KanbanBoard board={board} onBoardChange={handleBoardChange} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={50}
          minSize={isRightSidebarOpen ? 30 : 0}
          maxSize={isRightSidebarOpen ? 80 : 0}
          className={cn()}
        >
          <div className={cn('h-full p-2')}>
            <MarkdownEditor
              content={markdown}
              onChange={handleMarkdownChange}
              className='h-full'
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
