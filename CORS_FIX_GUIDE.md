# CORS and Development Setup Guide

## Issue Fixed: CORS Error

The CORS error you encountered was happening because:

1. **Cross-Origin Request**: Your local development server (`http://localhost:3001`) was trying to make requests to the production API (`https://ktl-isp-billing-app-qza33.ondigitalocean.app`)
2. **Missing CORS Headers**: The production API doesn't allow requests from localhost origins
3. **Browser Security**: Modern browsers block such cross-origin requests for security reasons

## Solution Implemented

### 1. **Vite Proxy Configuration**

Updated `vite.config.ts` to proxy API requests:

```typescript
server: {
  port: 3000,
  host: true,
  proxy: {
    '/api': {
      target: 'https://ktl-isp-billing-app-qza33.ondigitalocean.app',
      changeOrigin: true,
      secure: true,
      ws: true,
      // Proxy logs for debugging
      configure: (proxy, options) => {
        proxy.on('proxyReq', (proxyReq, req, res) => {
          console.log('Sending Request to the Target:', req.method, req.url);
          proxyReq.setHeader('Origin', 'https://ktl-isp-billing-app-qza33.ondigitalocean.app');
        });
        proxy.on('proxyRes', (proxyRes, req, res) => {
          console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
        });
      },
    },
  },
}
```

### 2. **Dynamic API Base URL**

Updated `src/services/api.ts` to use different URLs for development vs production:

```typescript
// Use proxy URL in development, full URL in production
const API_BASE_URL = import.meta.env.DEV
  ? "/api/v1" // Use proxy in development
  : import.meta.env.VITE_API_BASE_URL ||
    "https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1";
```

### 3. **How It Works**

**Development Mode:**

- Frontend runs on `http://localhost:3000`
- API requests go to `/api/v1/*` (relative URLs)
- Vite proxy forwards these to `https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1/*`
- Browser sees requests as same-origin, no CORS issues

**Production Mode:**

- Uses full API URLs directly
- No proxy needed

## Testing the Fix

1. **Server Started**: Development server is running on `http://localhost:3000`
2. **Proxy Active**: Console shows proxy requests like:

   ```
   Sending Request to the Target: POST /api/v1/auth/login/
   Received Response from the Target: [status] /api/v1/auth/login/
   ```

3. **Login Should Work**: Try logging in now - the CORS error should be resolved

## Alternative Solutions (if needed)

### Option A: Browser CORS Disable (Temporary)

If you still have issues, you can start Chrome with disabled CORS for development:

```bash
# Linux/Mac
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev_test"

# Windows
chrome.exe --disable-web-security --user-data-dir="C:\temp\chrome_dev_test"
```

⚠️ **Warning**: Only use this for development, never for regular browsing!

### Option B: Backend CORS Configuration

The backend could be configured to allow localhost origins:

```python
# Django settings.py (if using Django)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com"
]
```

### Option C: Environment Variables

You can also set different API URLs via environment variables:

```bash
# .env.development
VITE_API_BASE_URL=/api/v1

# .env.production
VITE_API_BASE_URL=https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1
```

## Debugging Tools

1. **Network Tab**: Check browser DevTools Network tab to see if requests are going to localhost instead of the remote server
2. **Console Logs**: Proxy logs show request forwarding
3. **Response Headers**: Check if CORS headers are present in responses

## What to Expect Now

✅ **CORS Error Fixed**: No more cross-origin blocking  
✅ **Requests Proxied**: API calls go through Vite proxy  
✅ **Login Functional**: Authentication should work normally  
✅ **Development Smooth**: No need to disable browser security

The application should now work normally for development while maintaining production compatibility.
