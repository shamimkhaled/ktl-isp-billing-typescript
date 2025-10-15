/**
 * Authentication utility functions
 */

/**
 * Clear all authentication-related data from localStorage
 */
export const clearAuthStorage = (): void => {
  // First, log what's currently in localStorage
  console.log('📋 BEFORE CLEARING - Current localStorage items:');
  Object.keys(localStorage).forEach(key => {
    console.log(`  - ${key}:`, localStorage.getItem(key));
  });

  const authKeys = [
    'authToken',
    'refreshToken', 
    'rememberMe',
    'user',
    'userId',
    'userProfile',
    'tokenExpiry',
    'sessionData'
  ];

  console.log('🧹 Attempting to clear keys:', authKeys);

  authKeys.forEach(key => {
    const beforeValue = localStorage.getItem(key);
    localStorage.removeItem(key);
    const afterValue = localStorage.getItem(key);
    console.log(`  - ${key}: "${beforeValue}" → "${afterValue}"`);
  });

  console.log('✅ Cleared authentication localStorage items:', authKeys);
  
  // Log what remains after clearing
  console.log('📋 AFTER CLEARING - Remaining localStorage items:');
  Object.keys(localStorage).forEach(key => {
    console.log(`  - ${key}:`, localStorage.getItem(key));
  });
};

/**
 * Log all remaining localStorage items (for debugging)
 */
export const logRemainingStorage = (): void => {
  const remainingItems = Object.keys(localStorage);
  console.log('📋 Remaining localStorage items:', remainingItems);
  
  if (remainingItems.length > 0) {
    remainingItems.forEach(key => {
      console.log(`  - ${key}:`, localStorage.getItem(key));
    });
  } else {
    console.log('  No items remaining in localStorage');
  }
};

/**
 * Check if user is authenticated by verifying tokens exist
 */
export const isUserAuthenticated = (): boolean => {
  const authToken = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  return !!(authToken && refreshToken);
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};