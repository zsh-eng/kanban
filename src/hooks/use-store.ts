import { CurrentBoardState, KanbanGlobalState, Store, currentBoardStore, kanbanGlobalStore } from '@/lib/store';
import { useSyncExternalStore } from 'react';

export function useStore<T, U>(
  store: Store<T>,
  selector: (state: T) => U = (state) => state as unknown as U
): U {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

export function useKanbanStore<U>(
  selector: (state: KanbanGlobalState) => U = (state) => state as unknown as U
): U {
  return useStore(kanbanGlobalStore, selector);
}

export function useCurrentBoardStore<U>(
  selector: (state: CurrentBoardState) => U = (state) => state as unknown as U
): U {
  return useStore(currentBoardStore, selector);
}
