import { useReducer } from 'react';

import type { WidgetType, DrawerType } from '~/types';

export interface RouteOverlayState {
  activeWidget: WidgetType | null;
  // From start of open animation to end of close animation
  openWidget: WidgetType | null;
  // When the widget is fully expanded, so does not include animations
  expandedWidget: WidgetType | null;
  activeDrawer: DrawerType | null;
}

type RouteOverlayAction =
  | {
      type: 'TOGGLE_WIDGET';
      payload: WidgetType;
    }
  | {
      type: 'WIDGET_ANIMATION_FINISHED';
    }
  | {
      type: 'TOGGLE_DRAWER';
      payload: DrawerType;
    };

const routeOverlayReducer = (
  state: RouteOverlayState,
  action: RouteOverlayAction,
) => {
  switch (action.type) {
    case 'TOGGLE_WIDGET':
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
    default:
      return state;
  }
};

export const useRouteOverlayState = () => {
  const [state, dispatch] = useReducer(routeOverlayReducer, {
    activeWidget: null,
    openWidget: null,
    expandedWidget: null,
    activeDrawer: null,
  });

  return {
    ...state,
    toggleActiveWidget: (widget: WidgetType) =>
      dispatch({ type: 'TOGGLE_WIDGET', payload: widget }),
    onWidgetAnimationFinished: () =>
      dispatch({ type: 'WIDGET_ANIMATION_FINISHED' }),
    toggleDrawer: (drawer: DrawerType) =>
      dispatch({ type: 'TOGGLE_DRAWER', payload: drawer }),
  };
};

export type RouteOverlayReducerState = ReturnType<typeof useRouteOverlayState>;
