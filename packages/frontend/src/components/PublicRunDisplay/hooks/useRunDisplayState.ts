import { useReducer, useCallback, useMemo } from 'react';

import type { WidgetType, DrawerType } from '../types';

export interface RunDisplayState {
  activeWidget: WidgetType | null;
  // From start of open animation to end of close animation
  openWidget: WidgetType | null;
  // When the widget is fully expanded, so does not include animations
  expandedWidget: WidgetType | null;
  activeDrawer: DrawerType | null;
  activeWaypoint: string | null;
  activeWaypointFromDrawer: boolean;
  activePointOfInterest: string | null;
  activePoiFromDrawer: boolean;
}

const initialState: RunDisplayState = {
  activeWidget: null,
  openWidget: null,
  expandedWidget: null,
  activeDrawer: null,
  activeWaypoint: null,
  activeWaypointFromDrawer: false,
  activePointOfInterest: null,
  activePoiFromDrawer: false,
};

type RunDisplayAction =
  | {
      type: 'SET_ACTIVE_WIDGET';
      payload: WidgetType | null;
    }
  | {
      type: 'WIDGET_ANIMATION_FINISHED';
    }
  | {
      type: 'SET_ACTIVE_DRAWER';
      payload: DrawerType | null;
    }
  | {
      type: 'SET_ACTIVE_WAYPOINT';
      payload: { id: string | null; fromDrawer: boolean };
    }
  | {
      type: 'SET_ACTIVE_POINT_OF_INTEREST';
      payload: { id: string | null; fromDrawer: boolean };
    }
  | {
      type: 'RESET_STATE';
    };

const runDisplayReducer = (
  state: RunDisplayState,
  action: RunDisplayAction,
) => {
  switch (action.type) {
    case 'SET_ACTIVE_WIDGET':
      return {
        ...state,
        ...(action.payload === null
          ? {
              // Close widget
              activeWidget: null,
              expandedWidget: null,
            }
          : {
              // Open widget
              ...initialState,
              activeWidget: action.payload,
              openWidget: action.payload,
            }),
      };
    case 'WIDGET_ANIMATION_FINISHED':
      return {
        ...state,
        ...(state.activeWidget
          ? {
              // Open animation
              expandedWidget: state.activeWidget,
            }
          : {
              // Close animation
              openWidget: null,
            }),
      };
    case 'SET_ACTIVE_DRAWER':
      return {
        ...state,
        ...(action.payload === null
          ? {
              // Close drawer
              activeDrawer: null,
            }
          : {
              // Open drawer
              ...initialState,
              activeDrawer: action.payload,
            }),
      };
    case 'SET_ACTIVE_WAYPOINT':
      return {
        ...initialState,
        activeWaypoint: action.payload.id,
        activeWaypointFromDrawer:
          action.payload.id === null
            ? false
            : state.activeWaypointFromDrawer || action.payload.fromDrawer,
        activeDrawer:
          action.payload.id === null && state.activeWaypointFromDrawer
            ? ('points-of-interest' as DrawerType)
            : null,
      };
    case 'SET_ACTIVE_POINT_OF_INTEREST':
      return {
        ...initialState,
        activePointOfInterest: action.payload.id,
        activePoiFromDrawer:
          action.payload.id === null
            ? false
            : state.activePoiFromDrawer || action.payload.fromDrawer,
        activeDrawer:
          action.payload.id === null && state.activePoiFromDrawer
            ? ('points-of-interest' as DrawerType)
            : null,
      };
    case 'RESET_STATE':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const useRunDisplayState = () => {
  const [state, dispatch] = useReducer(runDisplayReducer, initialState);

  const setActiveWidget = useCallback(
    (widget: WidgetType | null) => {
      dispatch({ type: 'SET_ACTIVE_WIDGET', payload: widget });
    },
    [dispatch],
  );

  const onWidgetAnimationFinished = useCallback(() => {
    dispatch({ type: 'WIDGET_ANIMATION_FINISHED' });
  }, [dispatch]);

  const setActiveDrawer = useCallback(
    (drawer: DrawerType | null) => {
      dispatch({ type: 'SET_ACTIVE_DRAWER', payload: drawer });
    },
    [dispatch],
  );

  const setActiveWaypoint = useCallback(
    (waypoint: string | null, fromDrawer: boolean = false) => {
      dispatch({
        type: 'SET_ACTIVE_WAYPOINT',
        payload: { id: waypoint, fromDrawer },
      });
    },
    [dispatch],
  );

  const setActivePointOfInterest = useCallback(
    (pointOfInterest: string | null, fromDrawer: boolean = false) => {
      dispatch({
        type: 'SET_ACTIVE_POINT_OF_INTEREST',
        payload: { id: pointOfInterest, fromDrawer },
      });
    },
    [dispatch],
  );

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  return useMemo(
    () => ({
      ...state,
      setActiveWidget,
      onWidgetAnimationFinished,
      setActiveDrawer,
      setActiveWaypoint,
      setActivePointOfInterest,
      resetState,
    }),
    [
      state,
      setActiveWidget,
      onWidgetAnimationFinished,
      setActiveDrawer,
      setActiveWaypoint,
      setActivePointOfInterest,
      resetState,
    ],
  );
};

export type RunDisplayReducerState = ReturnType<typeof useRunDisplayState>;
