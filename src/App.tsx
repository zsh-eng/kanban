import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { kanbanToMarkdown } from '@/lib/markdown/kanban-to-markdown';
import { markdownToKanban } from '@/lib/markdown/markdown-to-kanban';
import type { KanbanBoard as KanbanBoardType } from '@/types/kanban';
import MarkdownWorker from '@/workers/markdown?worker';
import { PanelRight, Sidebar } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useChangeThemeShortcut } from '@/hooks/use-change-theme-shortcut';
import { useToggleRightSidebar } from '@/hooks/use-toggle-right-sidebar';
import { cn } from '@/lib/utils';
import './index.css';

const worker = new MarkdownWorker();

export default function App() {
  useChangeThemeShortcut();
  const { isRightSidebarOpen, setIsRightSidebarOpen } = useToggleRightSidebar();

  const [markdown, setMarkdown] = useState<string>(
    '# My Kanban Board\n\n## To Do\n\n- [ ] First task\n\n## In Progress\n\n## Done\n'
  );
  const [board, setBoard] = useState<KanbanBoardType | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialBoard = () => {
      const initialBoard = markdownToKanban(markdown, 'untitled.md');
      setBoard(initialBoard);
    };
    loadInitialBoard();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { result } = event.data;
      setBoard(result);
    };

    worker.addEventListener('message', handleMessage);
    return () => {
      worker.removeEventListener('message', handleMessage);
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
    setBoard(newBoard);
    const newMarkdown = await kanbanToMarkdown(newBoard);
    setMarkdown(newMarkdown);

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
