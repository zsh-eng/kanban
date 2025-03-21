import type { KanbanBoard, KanbanColumn, KanbanTask } from '@/types/kanban';
import type { ListItem, Text } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const extractLinks = (content: string): string[] => {
  const wikiLinkRegex = /\[\[(.*?)\]\]/g;
  const matches = [...content.matchAll(wikiLinkRegex)];
  return matches.map((match) => match[1]);
};

const parseTaskContent = (
  node: ListItem
): { content: string; completed: boolean } => {
  // Get the paragraph node first
  const paragraphNode = node.children[0];
  if (!paragraphNode || paragraphNode.type !== 'paragraph') {
    return { content: '', completed: false };
  }

  // Get the text node from the paragraph
  const textNode = paragraphNode.children[0];
  if (!textNode || !('value' in textNode)) {
    return { content: '', completed: false };
  }

  const textContent = textNode.value;
  const checkboxMatch = textContent.match(/^\[([ x])\]\s*(.*)$/i);

  if (!checkboxMatch) {
    return { content: textContent, completed: false };
  }

  return {
    content: checkboxMatch[2],
    completed: checkboxMatch[1].toLowerCase() === 'x',
  };
};

export const markdownToKanban = (
  markdown: string,
  filePath: string
): KanbanBoard => {
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdown);
  const board: KanbanBoard = {
    id: filePath,
    title: 'Untitled Board',
    columns: [],
    filePath,
  };

  let headingSeen = false;

  let currentColumn: KanbanColumn | null = null;

  visit(tree, ['heading', 'list'], (node) => {
    if (node.type === 'heading') {
      const headingNode = node;
      const headingText = (headingNode?.children?.[0] as Text)?.value;

      if (!headingText) {
        return;
      }

      if (headingNode.depth === 1 && !headingSeen) {
        board.title = headingText;
        headingSeen = true;
      } else if (headingNode.depth === 2) {
        currentColumn = {
          id: `column-${board.columns.length}`,
          title: headingText,
          tasks: [],
        };
        board.columns.push(currentColumn);
      }
    } else if (node.type === 'list' && currentColumn) {
      const listNode = node;

      listNode.children.forEach((item: ListItem, index) => {
        if (item.type === 'listItem') {
          const { content, completed } = parseTaskContent(item);
          const task: KanbanTask = {
            id: `task-${currentColumn!.id}-${index}`,
            content,
            completed,
            metadata: {
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
              links: extractLinks(content),
            },
          };
          currentColumn!.tasks.push(task);
        }
      });
    }
  });

  return board;
};
