import { BoardsSidebar } from '@/components/boards-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <SidebarProvider className='h-screen bg-muted'>
        <BoardsSidebar />
        <SidebarInset className='overflow-auto'>
          <App />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
