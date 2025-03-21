import { useTheme } from '@/components/theme-provider';
import { isTextInput } from '@/lib/utils';
import { useEffect } from 'react';

export function useChangeThemeShortcut() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore theme toggle shortcut if user is typing in an input field
      if (isTextInput(event)) {
        return;
      }

      if (event.key === 't' && !event.shiftKey) {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setTheme, theme]);
}
