import { useReducer } from 'react';

import type { WidgetType, DrawerType } from '~/types';

export interface RouteOverlayState {
  activeWidget: WidgetType | null;
  // From start of open animation to end of close animation
  openWidget: WidgetType | null;
  // When the widget is fully expanded, so does not include animations
  expandedWidget: WidgetType | null;
  activeDrawer: DrawerType | null;
  visibleWidgets: Record<WidgetType, boolean>;
}

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
    default:
      return state;
  }
};

const initialState: RouteOverlayState = {
  activeWidget: null,
  openWidget: null,
  expandedWidget: null,
  activeDrawer: null,
  visibleWidgets: {
    distance: true,
    elevation: true,
  },
};

export const useRouteOverlayState = () => {
  const [state, dispatch] = useReducer(routeOverlayReducer, initialState);

  return {
    ...state,
    toggleActiveWidget: (widget: WidgetType) =>
      dispatch({ type: 'TOGGLE_ACTIVE_WIDGET', payload: widget }),
    onWidgetAnimationFinished: () =>
      dispatch({ type: 'WIDGET_ANIMATION_FINISHED' }),
    toggleDrawer: (drawer: DrawerType) =>
      dispatch({ type: 'TOGGLE_DRAWER', payload: drawer }),
    toggleVisibleWidget: (widget: WidgetType) =>
      dispatch({ type: 'TOGGLE_VISIBLE_WIDGET', payload: widget }),
  };
};

export type RouteOverlayReducerState = ReturnType<typeof useRouteOverlayState>;
