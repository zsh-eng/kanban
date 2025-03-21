import { currentBoardStore, kanbanGlobalStore } from '@/lib/store';

import { NewBoardDialog } from '@/components/new-board-dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentBoardStore, useKanbanStore } from '@/hooks/use-store';
import { createDefaultKanban } from '@/lib/store/default';

function KanbanIcon() {
  return (
    <div className='border rounded-sm p-1 bg-background w-6 h-6 text-sm flex items-center justify-center'>
      K
    </div>
  );
}

export function BoardsSidebar() {
  const store = useKanbanStore((state) => state);
  const boardNames = Object.values(store).map((board) => board.name);
  const currentBoard = useCurrentBoardStore((state) => state.currentBoardName);

  function handleNewBoard(name: string) {
    const kanban = createDefaultKanban(name);
    kanbanGlobalStore.setState({
      [name]: kanban,
    });
    currentBoardStore.setState({
      currentBoardName: name,
    });
  }

  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <KanbanIcon />
            <h1 className='text-xs font-semibold'>Kanban</h1>
          </div>
          <div>
            <NewBoardDialog onNewBoard={handleNewBoard} />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className=''>
        {/* TODO: header for the kanban that allows you to add new kanbans */}
        <SidebarGroup>
          <SidebarGroupLabel>Boards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {boardNames.map((boardName) => (
                <SidebarMenuItem key={boardName}>
                  <SidebarMenuButton
                    asChild
                    data-active={currentBoard === boardName}
                  >
                    <a
                      onClick={() =>
                        currentBoardStore.setState({
                          currentBoardName: boardName,
                        })
                      }
                    >
                      <span>{boardName}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
