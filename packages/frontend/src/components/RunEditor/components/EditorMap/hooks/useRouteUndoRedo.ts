import { useEffect, useState, useRef, useCallback } from 'react';

import type { Coordinates } from '~/types';
import { isSameRoute } from '~/utils/route';

import { MapState } from './useMapState';

interface RouteUndoRedoProps {
  initialize?: boolean;
  editRouteCoordinates: Coordinates[];
  setEditRouteCoordinates: MapState['setEditRouteCoordinates'];
}

const MAX_HISTORY_LENGTH = 10;

export const useRouteUndoRedo = ({
  initialize = false,
  editRouteCoordinates,
  setEditRouteCoordinates,
}: RouteUndoRedoProps) => {
  const currentEditCoordinatesRef = useRef(editRouteCoordinates);
  const [history, setHistory] = useState<Coordinates[][]>([
    editRouteCoordinates,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialize) {
      setHistory([editRouteCoordinates]);
      setCurrentIndex(0);
      currentEditCoordinatesRef.current = editRouteCoordinates;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);

  useEffect(() => {
    const routeHasChanged = !isSameRoute(
      editRouteCoordinates,
      currentEditCoordinatesRef.current,
    );

    if (routeHasChanged) {
      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory.slice(0, currentIndex + 1),
          editRouteCoordinates,
        ];
        return newHistory.slice(-MAX_HISTORY_LENGTH);
      });
      currentEditCoordinatesRef.current = editRouteCoordinates;
    }
  }, [editRouteCoordinates, currentIndex]);

  useEffect(() => {
    setCurrentIndex(history.length - 1);
  }, [history]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setEditRouteCoordinates(newCoordinates);
      currentEditCoordinatesRef.current = newCoordinates;
    }
  }, [currentIndex, history, setEditRouteCoordinates]);

  const handleRedo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setEditRouteCoordinates(newCoordinates);
      currentEditCoordinatesRef.current = newCoordinates;
    }
  }, [currentIndex, history, setEditRouteCoordinates]);

  return {
    handleUndo,
    handleRedo,
    isUndoDisabled: currentIndex <= 0,
    isRedoDisabled: currentIndex >= history.length - 1,
  };
};
