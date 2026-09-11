import { useEffect } from 'react';
import { useCanvasStore } from './useCanvasStore';

export function useKeyboardShortcuts() {
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const removeSelected = useCanvasStore((s) => s.removeSelected);
  const duplicateSelected = useCanvasStore((s) => s.duplicateSelected);
  const selectAll = useCanvasStore((s) => s.selectAll);
  const clearSelection = useCanvasStore((s) => s.clearSelection);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const updateTile = useCanvasStore((s) => s.updateTile);
  const tiles = useCanvasStore((s) => s.tiles);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (cmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y / Cmd+Shift+Z / Ctrl+Shift+Z
      if (
        (cmdOrCtrl && e.key.toLowerCase() === 'y') ||
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Select All: Ctrl+A / Cmd+A
      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Delete / Backspace: Delete selected tiles
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          removeSelected();
          return;
        }
      }

      // Escape: Deselect all
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
      }

      // Arrow keys: Nudge selected tile(s) for fine placement and accessibility
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedIds.length > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;

          selectedIds.forEach((id) => {
            const tile = tiles[id];
            if (tile && !tile.isLocked) {
              updateTile(id, { x: tile.x + dx, y: tile.y + dy }, false);
            }
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    removeSelected,
    duplicateSelected,
    selectAll,
    clearSelection,
    selectedIds,
    updateTile,
    tiles,
  ]);
}
