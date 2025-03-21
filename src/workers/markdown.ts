import { markdownToKanban } from '@/lib/markdown/markdown-to-kanban';

console.log('markdown worker initializing...');

self.onmessage = (event) => {
  console.log('received message', event.data);
  const { markdown, filePath } = event.data;
  try {
    const kanban = markdownToKanban(markdown, filePath);
    self.postMessage({
      result: kanban,
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

