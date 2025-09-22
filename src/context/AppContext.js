/**
 * React Context để quản lý trạng thái ứng dụng
 */

'use client';

import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Actions
export const APP_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create Context
const AppContext = createContext();

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUser = (user) => {
    dispatch({ type: APP_ACTIONS.SET_USER, payload: user });
  };

  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    setUser,
    setLoading,
    setError,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook để sử dụng context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
