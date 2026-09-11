import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/components/labs/polylab/canvas/useCanvasStore';
import { saveCanvas } from './polylab.storage';

const AUTOSAVE_DEBOUNCE_MS = 2000;

export function useAutosave(canvasId: string) {
  const isDirty = useCanvasStore((s) => s.isDirty);
  const tiles = useCanvasStore((s) => s.tiles);
  const title = useCanvasStore((s) => s.title);
  const viewport = useCanvasStore((s) => s.viewport);
  const grid = useCanvasStore((s) => s.grid);
  const setSaveStatus = useCanvasStore((s) => s.setSaveStatus);
  const getCanvasDocument = useCanvasStore((s) => s.getCanvasDocument);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty || !canvasId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('unsaved');

    timeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const doc = getCanvasDocument();

      const success = saveCanvas(canvasId, doc);
      if (success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, tiles, title, viewport, grid, canvasId, setSaveStatus, getCanvasDocument]);
}
