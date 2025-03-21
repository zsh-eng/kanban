import { isTextInput } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const useToggleRightSidebar = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextInput(event)) {
        return;
      }

      if (event.key === ']') {
        setIsRightSidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { isRightSidebarOpen, setIsRightSidebarOpen };
};
