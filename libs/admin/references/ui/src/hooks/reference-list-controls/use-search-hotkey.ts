import { useEffect, useRef } from 'react';

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/** Focuses the returned input on «/» unless the user is already typing somewhere. */
export function useSearchHotkey() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTyping(event.target) || !inputRef.current) return;
      event.preventDefault();
      inputRef.current.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  return inputRef;
}
