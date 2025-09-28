import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';

export const useTokenExpiration = () => {
  const dispatch = useAppDispatch();
  const { expiresAt, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const checkExpiration = () => {
      const now = new Date();
      const expirationTime = new Date(expiresAt);

      if (now >= expirationTime) {
        dispatch(logout());
      }
    };

    // Check immediately
    checkExpiration();

    // Check every minute
    const interval = setInterval(checkExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isAuthenticated, dispatch]);
};