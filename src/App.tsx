import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { kanbanToMarkdown } from '@/lib/markdown/kanban-to-markdown';
import type {
  KanbanBoard as KanbanBoardType,
  KanbanUpdateRequest,
  KanbanUpdateResponse,
  KanbanUpdateSource,
} from '@/types/kanban';
import MarkdownWorker from '@/workers/markdown?worker';
import { PanelRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useChangeThemeShortcut } from '@/hooks/use-change-theme-shortcut';
import { useCurrentBoardStore, useKanbanStore } from '@/hooks/use-store';
import { useToggleRightSidebar } from '@/hooks/use-toggle-right-sidebar';
import { kanbanGlobalStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import './index.css';

const worker = new MarkdownWorker();

function sendMessage(update: KanbanUpdateRequest) {
  worker.postMessage(update);
}

function subscribeToUpdate(
  source: KanbanUpdateSource,
  callback: (update: KanbanUpdateResponse) => void
): () => void {
  const handleMessage = (event: MessageEvent) => {
    const { result } = event.data;
    if (result.source === source) {
      callback(result);
    }
  };

  worker.addEventListener('message', handleMessage);
  return () => {
    worker.removeEventListener('message', handleMessage);
  };
}

export default function App() {
  useChangeThemeShortcut();
  const { isRightSidebarOpen, setIsRightSidebarOpen } = useToggleRightSidebar();

  const kanbanGlobalState = useKanbanStore((state) => state);

  const currentBoardName = useCurrentBoardStore(
    (state) => state.currentBoardName
  );
  const [boardRevision, setBoardRevision] = useState(0);

  const TEMP_KANBAN = kanbanGlobalState[currentBoardName ?? ''];
  // TODO: we should remove the markdown as well
  const markdown = TEMP_KANBAN ? kanbanToMarkdown(TEMP_KANBAN.board) : null;
  const board = TEMP_KANBAN?.board ?? null;

  useEffect(() => {
    if (!currentBoardName) {
      return;
    }

    const unsubEditorToBoardUpdates = subscribeToUpdate('editor', (update) => {
      kanbanGlobalStore.setState({
        [currentBoardName]: {
          ...kanbanGlobalState[currentBoardName],
          board: update.board,
        },
      });
    });

    return () => {
      unsubEditorToBoardUpdates();
    };
  }, [currentBoardName]);

  const handleMarkdownChange = useCallback(
    async (newMarkdown: string) => {
      sendMessage({
        source: 'editor',
        content: newMarkdown,
        id: currentBoardName || 'untitled.md',
        timestamp: Date.now(),
      });
    },
    [currentBoardName]
  );

  const handleBoardChange = async (newBoard: KanbanBoardType) => {
    if (!currentBoardName) {
      return;
    }

    kanbanGlobalStore.setState({
      [currentBoardName]: {
        ...kanbanGlobalState[currentBoardName],
        board: newBoard,
      },
    });
    console.log('updating revision')
    setBoardRevision((prev) => prev + 1);

    // TODO: persist to file
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-full flex flex-col dark:bg-background dark:text-foreground dark:rounded-full w-full'>
      <div className='border-b px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center gap-1'>
          <SidebarTrigger />
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

      <ResizablePanelGroup direction='horizontal' className=''>
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
            {markdown ? (
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
                className='h-full'
                revision={boardRevision}
              />
            ) : (
              <div className='h-full flex items-center justify-center'>
                <p>No board selected</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
