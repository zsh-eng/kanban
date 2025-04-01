import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme}>
      {theme === 'light' ? (
        <MoonIcon className='h-5 w-5' />
      ) : (
        <SunIcon className='h-5 w-5' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
