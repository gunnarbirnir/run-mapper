import { useEffect, useState, useRef, useCallback } from 'react';

import type { CoordinatesWithId } from '~/types';
import { isSameRoute } from '~/utils/route';

import type { ActiveRouteState } from './useActiveRoute';

interface RouteUndoRedoProps {
  initialize?: boolean;
  activeRouteControlPoints: CoordinatesWithId[];
  setActiveRouteControlPoints: ActiveRouteState['setActiveRouteControlPoints'];
}

const MAX_HISTORY_LENGTH = 10;

export const useRouteUndoRedo = ({
  initialize = false,
  activeRouteControlPoints,
  setActiveRouteControlPoints,
}: RouteUndoRedoProps) => {
  const currentActiveControlPointsRef = useRef(activeRouteControlPoints);
  const [history, setHistory] = useState<CoordinatesWithId[][]>([
    activeRouteControlPoints,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialize) {
      setHistory([activeRouteControlPoints]);
      setCurrentIndex(0);
      currentActiveControlPointsRef.current = activeRouteControlPoints;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);

  useEffect(() => {
    const routeHasChanged = !isSameRoute(
      activeRouteControlPoints,
      currentActiveControlPointsRef.current,
    );

    if (routeHasChanged) {
      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory.slice(0, currentIndex + 1),
          activeRouteControlPoints,
        ];
        return newHistory.slice(-MAX_HISTORY_LENGTH);
      });
      currentActiveControlPointsRef.current = activeRouteControlPoints;
    }
  }, [activeRouteControlPoints, currentIndex]);

  useEffect(() => {
    setCurrentIndex(history.length - 1);
  }, [history]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setActiveRouteControlPoints(newCoordinates);
      currentActiveControlPointsRef.current = newCoordinates;
    }
  }, [currentIndex, history, setActiveRouteControlPoints]);

  const handleRedo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const newCoordinates = history[newIndex];

      setCurrentIndex(newIndex);
      setActiveRouteControlPoints(newCoordinates);
      currentActiveControlPointsRef.current = newCoordinates;
    }
  }, [currentIndex, history, setActiveRouteControlPoints]);

  return {
    handleUndo,
    handleRedo,
    isUndoDisabled: currentIndex <= 0,
    isRedoDisabled: currentIndex >= history.length - 1,
  };
};
