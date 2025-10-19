import React, { useState, useEffect } from 'react';

export const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [lastError, setLastError] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Get the API URL from environment
        const isDev = import.meta.env.DEV;
        const url = isDev 
          ? '/api/v1' 
          : import.meta.env.VITE_API_BASE_URL || 'https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1';
        
        setApiUrl(url);
        
        console.log('🔍 ApiStatus: Checking connection to:', url);
        
        // Direct fetch instead of authService.checkConnection()
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setStatus('connected');
          setLastError('');
          console.log('✅ ApiStatus: Connected');
        } else {
          setStatus('disconnected');
          setLastError(`Server responded with ${response.status}`);
          console.log('❌ ApiStatus: Disconnected');
        }
      } catch (error: any) {
        setStatus('disconnected');
        setLastError(error.message || 'Unknown error');
        console.error('❌ ApiStatus: Error checking connection:', error);
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '✅ API Connected';
      case 'disconnected': return '❌ API Disconnected (Using Mock)';
      default: return '🔍 Checking API...';
    }
  };

  return (
    <div className="text-center">
      <div 
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
        title="Click for details"
      >
        {getStatusText()}
      </div>
      
      {showDetails && (
        <div className="mt-2 p-3 bg-white/10 rounded-lg text-xs text-white/80 border border-white/20">
          <div><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</div>
          <div><strong>API URL:</strong> {apiUrl}</div>
          {lastError && <div><strong>Last Error:</strong> {lastError}</div>}
          <div className="mt-2 text-yellow-300">
            💡 If API is disconnected, the app will use mock data for development
          </div>
        </div>
      )}
    </div>
  );
};