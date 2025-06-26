import { useCallback, useRef, useState } from "react";

interface TouchDragOptions {
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string) => void;
  onDragMove?: (id: string, position: { x: number; y: number }) => void;
  activationDelay?: number;
  activationDistance?: number;
}

interface TouchDragState {
  isDragging: boolean;
  dragId: string | null;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
}

export const useTouchDrag = (options: TouchDragOptions = {}) => {
  const {
    onDragStart,
    onDragEnd,
    onDragMove,
    activationDelay = 150,
    activationDistance = 10,
  } = options;

  const [state, setState] = useState<TouchDragState>({
    isDragging: false,
    dragId: null,
    startPosition: null,
    currentPosition: null,
  });

  const touchStartTimeRef = useRef<number>(0);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: string) => {
      const touch = e.touches[0];
      const startPos = { x: touch.clientX, y: touch.clientY };

      touchStartTimeRef.current = Date.now();

      setState((prev) => ({
        ...prev,
        startPosition: startPos,
        currentPosition: startPos,
        dragId: id,
      }));

      // Set up activation delay
      touchTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isDragging: true,
        }));
        onDragStart?.(id);
      }, activationDelay);

      // Prevent default to avoid scrolling during potential drag
      e.preventDefault();
    },
    [activationDelay, onDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!state.startPosition || !state.dragId) return;

      const touch = e.touches[0];
      const currentPos = { x: touch.clientX, y: touch.clientY };

      // Calculate distance moved
      const distance = Math.sqrt(
        Math.pow(currentPos.x - state.startPosition.x, 2) +
          Math.pow(currentPos.y - state.startPosition.y, 2)
      );

      // Cancel drag if moved too far before activation
      if (
        !state.isDragging &&
        distance > activationDistance &&
        touchTimeoutRef.current
      ) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
        setState((prev) => ({
          ...prev,
          isDragging: false,
          dragId: null,
          startPosition: null,
          currentPosition: null,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        currentPosition: currentPos,
      }));

      if (state.isDragging) {
        onDragMove?.(state.dragId, currentPos);
        e.preventDefault();
      }
    },
    [state, activationDistance, onDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    const touchDuration = Date.now() - touchStartTimeRef.current;
    const wasDragging = state.isDragging;

    if (wasDragging && state.dragId) {
      onDragEnd?.(state.dragId);
    }

    setState({
      isDragging: false,
      dragId: null,
      startPosition: null,
      currentPosition: null,
    });

    // Return whether this was a tap (short touch without drag)
    return !wasDragging && touchDuration < 200;
  }, [state, onDragEnd]);

  const cancelDrag = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    setState({
      isDragging: false,
      dragId: null,
      startPosition: null,
      currentPosition: null,
    });
  }, []);

  return {
    ...state,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cancelDrag,
  };
};
