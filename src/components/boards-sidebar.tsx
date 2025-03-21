import { currentBoardStore } from '@/lib/store';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentBoardStore, useKanbanStore } from '@/hooks/use-store';

export function BoardsSidebar() {
  const store = useKanbanStore((state) => state);
  const boardNames = Object.keys(store);
  const currentBoard = useCurrentBoardStore((state) => state.currentBoardName);

  return (
    <Sidebar variant='inset'>
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
