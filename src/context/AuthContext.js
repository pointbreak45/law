import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const actionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('legalbot_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: user });
        } catch (error) {
          localStorage.removeItem('legalbot_user');
          dispatch({ type: actionTypes.LOGIN_FAILURE, payload: 'Invalid session data' });
        }
      } else {
        dispatch({ type: actionTypes.LOGIN_FAILURE, payload: null });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: actionTypes.LOGIN_START });
    
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const userData = {
        id: Date.now(),
        name: email === 'aditi.sharma@example.com' ? 'Aditi Sharma' : 'User',
        email: email,
        phone: '+91 98XX-XX-XXXX',
        location: 'Delhi, India',
        memberSince: '2025',
        plan: 'Starter',
        avatar: null
      };

      localStorage.setItem('legalbot_user', JSON.stringify(userData));
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: userData });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: actionTypes.LOGIN_FAILURE, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: actionTypes.LOGIN_START });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        memberSince: new Date().getFullYear().toString(),
        plan: 'Starter'
      };

      localStorage.setItem('legalbot_user', JSON.stringify(newUser));
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: newUser });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: actionTypes.LOGIN_FAILURE, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('legalbot_user');
    dispatch({ type: actionTypes.LOGOUT });
  };

  // Update profile function
  const updateProfile = (profileData) => {
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('legalbot_user', JSON.stringify(updatedUser));
    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: profileData });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;