import { markdownToKanban } from '@/lib/markdown/markdown-to-kanban';
import { KanbanUpdateRequest, KanbanUpdateResponse } from '@/types/kanban';

console.log('markdown worker initializing...');

self.onmessage = (event) => {
  console.log('received message', event.data);
  const { content, id, source, timestamp } = event.data as KanbanUpdateRequest;
  try {
    const kanban = markdownToKanban(content, id);
    self.postMessage({
      result: {
        source,
        board: kanban,
        id,
        timestamp,
      } satisfies KanbanUpdateResponse,
    });
  } catch (error) {
    console.error('Error in worker:', error);
    self.postMessage({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    throw error;
  }
};

self.onerror = (event) => {
  console.error('worker error', event);
};

console.log('markdown worker initialized');

export { };

