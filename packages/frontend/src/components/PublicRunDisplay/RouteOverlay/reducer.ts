import { useReducer, useCallback, useMemo } from 'react';

import type { WidgetType, DrawerType } from '../types';

export interface RouteOverlayState {
  activeWidget: WidgetType | null;
  // From start of open animation to end of close animation
  openWidget: WidgetType | null;
  // When the widget is fully expanded, so does not include animations
  expandedWidget: WidgetType | null;
  activeDrawer: DrawerType | null;
  visibleWidgets: Record<WidgetType, boolean>;
  activeWaypoint: string | null;
}

const initialState: RouteOverlayState = {
  activeWidget: null,
  openWidget: null,
  expandedWidget: null,
  activeDrawer: null,
  visibleWidgets: {
    distance: true,
    elevation: true,
  },
  activeWaypoint: null,
};

type RouteOverlayAction =
  | {
      type: 'TOGGLE_ACTIVE_WIDGET';
      payload: WidgetType;
    }
  | {
      type: 'WIDGET_ANIMATION_FINISHED';
    }
  | {
      type: 'TOGGLE_DRAWER';
      payload: DrawerType;
    }
  | {
      type: 'TOGGLE_VISIBLE_WIDGET';
      payload: WidgetType;
    }
  | {
      type: 'SET_ACTIVE_WAYPOINT';
      payload: string | null;
    }
  | {
      type: 'RESET_STATE';
    };

const routeOverlayReducer = (
  state: RouteOverlayState,
  action: RouteOverlayAction,
) => {
  switch (action.type) {
    case 'TOGGLE_ACTIVE_WIDGET':
      return {
        ...state,
        ...(state.activeWidget
          ? {
              // Close widget
              activeWidget: null,
              expandedWidget: null,
            }
          : {
              // Open widget
              activeWidget: action.payload,
              openWidget: action.payload,
              activeDrawer: null,
              activeWaypoint: null,
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
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        ...(state.activeDrawer
          ? {
              // Close drawer
              activeDrawer: null,
            }
          : {
              // Open drawer
              activeDrawer: action.payload,
              activeWidget: null,
              activeWaypoint: null,
              openWidget: null,
              expandedWidget: null,
            }),
      };
    case 'TOGGLE_VISIBLE_WIDGET':
      return {
        ...state,
        visibleWidgets: {
          ...state.visibleWidgets,
          [action.payload]: !state.visibleWidgets[action.payload],
        },
      };
    case 'SET_ACTIVE_WAYPOINT':
      return {
        ...state,
        activeWaypoint: action.payload,
        activeDrawer: null,
        activeWidget: null,
        openWidget: null,
        expandedWidget: null,
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        // Maintain visible widgets
        visibleWidgets: state.visibleWidgets,
      };
    default:
      return state;
  }
};

export const useRouteOverlayState = () => {
  const [state, dispatch] = useReducer(routeOverlayReducer, initialState);

  const toggleActiveWidget = useCallback(
    (widget: WidgetType) => {
      dispatch({ type: 'TOGGLE_ACTIVE_WIDGET', payload: widget });
    },
    [dispatch],
  );

  const onWidgetAnimationFinished = useCallback(() => {
    dispatch({ type: 'WIDGET_ANIMATION_FINISHED' });
  }, [dispatch]);

  const toggleDrawer = useCallback(
    (drawer: DrawerType) => {
      dispatch({ type: 'TOGGLE_DRAWER', payload: drawer });
    },
    [dispatch],
  );

  const toggleVisibleWidget = useCallback(
    (widget: WidgetType) => {
      dispatch({ type: 'TOGGLE_VISIBLE_WIDGET', payload: widget });
    },
    [dispatch],
  );

  const setActiveWaypoint = useCallback(
    (waypoint: string | null) => {
      dispatch({
        type: 'SET_ACTIVE_WAYPOINT',
        payload: waypoint,
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
      toggleActiveWidget,
      onWidgetAnimationFinished,
      toggleDrawer,
      toggleVisibleWidget,
      setActiveWaypoint,
      resetState,
    }),
    [
      state,
      toggleActiveWidget,
      onWidgetAnimationFinished,
      toggleDrawer,
      toggleVisibleWidget,
      setActiveWaypoint,
      resetState,
    ],
  );
};

export type RouteOverlayReducerState = ReturnType<typeof useRouteOverlayState>;
