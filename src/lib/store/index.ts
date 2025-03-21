import { readMarkdownFiles } from '@/lib/fs/markdown';
import { markdownToKanban } from '@/lib/markdown/markdown-to-kanban';
import { KanbanBoard } from '@/types/kanban';

export type Listener = () => void;
export type Selector<T, U> = (state: T) => U;

export interface Store<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: Listener) => () => void;
}

export const createStore = <T extends Record<string, any>>(
  initialState: T
): Store<T> => {
  let state = initialState;
  const listeners = new Set<Listener>();

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = (): T => state;

  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)): void => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: T) => Partial<T>)(state)
        : partial;

    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  return { getState, setState, subscribe };
};

export type KanbanGlobalState = Record<
  string,
  {
    board: KanbanBoard;
    markdown: string;
    name: string;
  }
>;

export const kanbanGlobalStore = createStore<KanbanGlobalState>({});

export type CurrentBoardState = {
  currentBoardName: string | null;
};
export const currentBoardStore = createStore<CurrentBoardState>({
  currentBoardName: null,
});

const DEFAULT_KANBAN_STRING =
  '# My Kanban Board\n\n## To Do\n\n- [ ] First task\n\n## In Progress\n\n';

async function initializeKanbanGlobalStore() {
  const files = await readMarkdownFiles();
  if ('error' in files) {
    console.error(files.error);
    return;
  }

  const kanbans = files.files.map((file) => {
    return {
      name: file.name,
      board: markdownToKanban(file.content, file.name),
      markdown: file.content,
    };
  });

  if (kanbans.length === 0) {
    kanbans.push({
      name: 'untitled.md',
      board: markdownToKanban(DEFAULT_KANBAN_STRING, 'untitled.md'),
      markdown: DEFAULT_KANBAN_STRING,
    });
  }

  const kanbanObject = Object.fromEntries(
    kanbans.map((kanban) => [kanban.name, kanban])
  );

  kanbanGlobalStore.setState(kanbanObject);
  currentBoardStore.setState({ currentBoardName: kanbans[0].name });
}

initializeKanbanGlobalStore();
