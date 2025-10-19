/**
 * Performance monitoring utilities for authentication
 */

interface PerformanceTimer {
  start: number;
  label: string;
}

class PerformanceMonitor {
  private timers: Map<string, PerformanceTimer> = new Map();

  startTimer(label: string): void {
    this.timers.set(label, {
      start: performance.now(),
      label,
    });
  }

  endTimer(label: string): number {
    const timer = this.timers.get(label);
    if (!timer) {
      console.warn(`Timer "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - timer.start;
    this.timers.delete(label);

    // Log slow operations (> 1 second)
    if (duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    } else if (duration > 500) {
      console.info(`⚠️ Moderate delay: ${label} took ${duration.toFixed(2)}ms`);
    } else {
      console.log(`✅ Fast operation: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
    this.startTimer(label);
    return operation().finally(() => {
      this.endTimer(label);
    });
  }
}

export const perfMonitor = new PerformanceMonitor();

// Auth-specific performance helpers
export const authPerf = {
  measureLogin: <T>(operation: () => Promise<T>) =>
    perfMonitor.measureAsync('Auth: Login', operation),
  
  measureTokenRefresh: <T>(operation: () => Promise<T>) =>
    perfMonitor.measureAsync('Auth: Token Refresh', operation),
  
  measureLogout: <T>(operation: () => Promise<T>) =>
    perfMonitor.measureAsync('Auth: Logout', operation),
  
  measureInitialAuth: <T>(operation: () => T) => {
    perfMonitor.startTimer('Auth: Initial State Load');
    const result = operation();
    perfMonitor.endTimer('Auth: Initial State Load');
    return result;
  },
};