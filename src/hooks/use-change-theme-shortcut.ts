import { useTheme } from '@/components/theme-provider';
import { useEffect } from 'react';

export function useChangeThemeShortcut() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'd' && !event.shiftKey) {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setTheme, theme]);
}
