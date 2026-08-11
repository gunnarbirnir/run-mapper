import { useEffect, useState, useRef, useCallback } from 'react';

import type { CoordinatesWithId } from '~/types';
import { isSameRoute } from '~/utils/route';

import { MapState } from './useMapState';

interface RouteUndoRedoProps {
  initialize?: boolean;
  editRouteControlPoints: CoordinatesWithId[];
  setEditRouteControlPoints: MapState['setEditRouteControlPoints'];
}

const MAX_HISTORY_LENGTH = 10;

export const useRouteUndoRedo = ({
  initialize = false,
  editRouteControlPoints,
  setEditRouteControlPoints,
}: RouteUndoRedoProps) => {
  const currentEditControlPointsRef = useRef(editRouteControlPoints);
  const [history, setHistory] = useState<CoordinatesWithId[][]>([
    editRouteControlPoints,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialize) {
      setHistory([editRouteControlPoints]);
      setCurrentIndex(0);
      currentEditControlPointsRef.current = editRouteControlPoints;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);

  useEffect(() => {
    const routeHasChanged = !isSameRoute(
      editRouteControlPoints,
      currentEditControlPointsRef.current,
    );

    if (routeHasChanged) {
      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory.slice(0, currentIndex + 1),
          editRouteControlPoints,
        ];
        return newHistory.slice(-MAX_HISTORY_LENGTH);
      });
      currentEditControlPointsRef.current = editRouteControlPoints;
    }
  }, [editRouteControlPoints, currentIndex]);

  useEffect(() => {
    setCurrentIndex(history.length - 1);
  }, [history]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setEditRouteControlPoints(newCoordinates);
      currentEditControlPointsRef.current = newCoordinates;
    }
  }, [currentIndex, history, setEditRouteControlPoints]);

  const handleRedo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setEditRouteControlPoints(newCoordinates);
      currentEditControlPointsRef.current = newCoordinates;
    }
  }, [currentIndex, history, setEditRouteControlPoints]);

  return {
    handleUndo,
    handleRedo,
    isUndoDisabled: currentIndex <= 0,
    isRedoDisabled: currentIndex >= history.length - 1,
  };
};
