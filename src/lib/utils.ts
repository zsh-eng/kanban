import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTextInput(event: KeyboardEvent) {
  return (
    event.target instanceof HTMLElement &&
    (event.target.isContentEditable ||
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA')
  );
}
