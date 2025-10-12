# Quick Start Guide for New Developers

## Welcome! 🎉

This guide will help you get up to speed with the **KTL ISP Billing Frontend** project quickly. Follow these steps in order.

---

## ⚡ 5-Minute Quick Start

### 1. **Clone & Install** (2 minutes)
```bash
git clone <repository-url>
cd ktl-isp-billing-frontend
npm install
```

### 2. **Configure Environment** (1 minute)
Create `.env` file:
```env
REACT_APP_API_BASE_URL=https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1
```

### 3. **Start Development** (2 minutes)
```bash
npm start
```

Visit: `http://localhost:3000`

**Test Credentials** (if available):
- Login ID: `admin001`
- Password: `[ask team]`

---

## 📁 Project Structure at a Glance

```
src/
├── components/       # Reusable UI components
│   └── common/      # Header, Sidebar, Button, etc.
├── pages/           # Page components (Dashboard, Login, etc.)
├── store/           # Redux slices (authSlice, usersSlice, etc.)
├── services/        # API calls (auth.js, dashboard.js, etc.)
├── hooks/           # Custom hooks (useAuth, useTheme)
└── App.jsx          # Main app with routes
```

---

## 🔑 Key Concepts

### 1. **Authentication Flow**
```
Login → Store JWT tokens → Protected routes → Auto token refresh
```

**Files to know:**
- `src/hooks/useAuth.js` - Authentication hook
- `src/services/auth.js` - Auth API calls
- `src/store/authSlice.js` - Auth state management

### 2. **State Management**
```
Redux (global state) + React Query (server state) + useState (local state)
```

**When to use what:**
- **Redux**: User auth, theme, shared app state
- **React Query**: API data fetching, caching
- **useState**: Component-specific state

### 3. **API Calls**
```
Component → Service Function → Axios → API → Response → Redux/Component
```

**Pattern:**
```javascript
// ✅ Always use service functions
import { userService } from '../services/users';
const users = await userService.fetchUsers();

// ❌ Never call API directly
const users = await api.get('/users/');
```

---

## 🛠️ Common Development Tasks

### Add a New Page

1. **Create page component** (`src/pages/NewPage.jsx`):
```javascript
import React from 'react';

const NewPage = () => {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
};

export default NewPage;
```

2. **Add route** in `src/App.jsx`:
```javascript
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={
  <ProtectedRoute>
    <Layout>
      <NewPage />
    </Layout>
  </ProtectedRoute>
} />
```

3. **Add menu item** in `src/components/common/Sidebar.jsx`:
```javascript
{
  id: 'new-page',
  label: 'New Page',
  icon: IconName,
  path: '/new-page',
  gradient: 'from-blue-400 to-purple-400'
}
```

### Add a New API Endpoint

1. **Add endpoint** in `src/services/api.js`:
```javascript
ENDPOINTS: {
  NEW_FEATURE: {
    LIST: '/new-feature/',
    CREATE: '/new-feature/',
    DETAIL: (id) => `/new-feature/${id}/`,
  }
}
```

2. **Create service** (`src/services/newFeature.js`):
```javascript
import api, { ENDPOINTS } from './api';

export const newFeatureService = {
  getList: async (params) => {
    const response = await api.get(ENDPOINTS.NEW_FEATURE.LIST, { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post(ENDPOINTS.NEW_FEATURE.CREATE, data);
    return response.data;
  }
};
```

3. **Use in component**:
```javascript
import { newFeatureService } from '../services/newFeature';

const MyComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['newFeature'],
    queryFn: () => newFeatureService.getList()
  });
  
  // Render data
};
```

### Add Redux State

1. **Create slice** (`src/store/newSlice.js`):
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchData = createAsyncThunk(
  'new/fetchData',
  async () => {
    const response = await api.get('/endpoint/');
    return response.data;
  }
);

const newSlice = createSlice({
  name: 'new',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = newSlice.actions;
export default newSlice.reducer;
```

2. **Add to store** (`src/store/index.js`):
```javascript
import newSlice from './newSlice';

export const store = configureStore({
  reducer: {
    // ... existing
    new: newSlice,
  }
});
```

3. **Use in component**:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../store/newSlice';

const Component = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.new);
  
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
};
```

---

## 🎨 Styling Guidelines

### Tailwind Classes Pattern

```javascript
// Container
<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">

// Button
<button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all">

// Card
<div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">

// Text
<h1 className="text-4xl font-bold text-white">
<p className="text-white/60">
```

### Theme-Aware Classes

```javascript
// Light theme variant
<div className="bg-white/10 light:bg-gray-100">
<p className="text-white light:text-gray-900">
```

### Responsive Design

```javascript
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## 🐛 Debugging Tips

### 1. **Check Redux DevTools**
```javascript
// Install Redux DevTools extension for Chrome/Firefox
// View state changes in real-time
```

### 2. **Check React Query DevTools**
```javascript
// Add to App.jsx for development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

### 3. **Console Logging**
```javascript
// Debug API responses
console.log('API Response:', response.data);

// Debug Redux state
const state = useSelector(state => state);
console.log('Redux State:', state);

// Debug component renders
useEffect(() => {
  console.log('Component rendered');
});
```

### 4. **Network Tab**
```javascript
// Open browser DevTools → Network
// Filter: XHR/Fetch
// Check request/response for API calls
```

### 5. **Common Issues**

**Problem**: "401 Unauthorized"
```javascript
// Solution: Check if token exists and is valid
localStorage.getItem('authToken')
// If expired, logout and login again
```

**Problem**: Component not re-rendering
```javascript
// Solution: Check if state is being updated correctly
// Use Redux DevTools or React DevTools to inspect state
```

**Problem**: API call failing
```javascript
// Solution:
// 1. Check network tab for actual error
// 2. Verify endpoint in services/api.js
// 3. Check backend is running
// 4. Verify auth token is being sent
```

---

## 📚 Learn the Codebase

### Day 1: Foundation
- [ ] Read this Quick Start Guide
- [ ] Explore project structure
- [ ] Run the app locally
- [ ] Login and explore features
- [ ] Review `src/App.jsx` for routing
- [ ] Review `src/services/api.js` for endpoints

### Day 2: Authentication
- [ ] Study `src/hooks/useAuth.js`
- [ ] Review `src/store/authSlice.js`
- [ ] Understand token refresh mechanism
- [ ] Review protected route logic

### Day 3: State Management
- [ ] Learn Redux slices structure
- [ ] Understand React Query usage
- [ ] Review dashboard data fetching
- [ ] Study users management slice

### Day 4: Components & UI
- [ ] Explore common components
- [ ] Review Header and Sidebar
- [ ] Understand glassmorphic styling
- [ ] Study Tailwind configuration

### Day 5: Practice
- [ ] Add a simple new feature
- [ ] Fix a minor bug
- [ ] Create a new component
- [ ] Write tests for a component

---

## 🔗 Important Files Reference

### Core Files
| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app, routing, layout |
| `src/index.js` | Entry point |
| `src/index.css` | Global styles, Tailwind imports |

### Authentication
| File | Purpose |
|------|---------|
| `src/hooks/useAuth.js` | Auth hook with login/logout |
| `src/services/auth.js` | Auth API calls |
| `src/store/authSlice.js` | Auth Redux state |
| `src/pages/Login.jsx` | Login page |

### State Management
| File | Purpose |
|------|---------|
| `src/store/index.js` | Redux store configuration |
| `src/store/authSlice.js` | Authentication state |
| `src/store/usersSlice.js` | Users state |
| `src/store/rolesSlice.js` | Roles state |

### API
| File | Purpose |
|------|---------|
| `src/services/api.js` | Axios config, interceptors, endpoints |
| `src/services/auth.js` | Auth service functions |
| `src/services/dashboard.js` | Dashboard services |

### Components
| File | Purpose |
|------|---------|
| `src/components/common/Header.jsx` | App header |
| `src/components/common/Sidebar.jsx` | Navigation sidebar |
| `src/components/common/Button.jsx` | Reusable button |
| `src/components/common/LoadingSpinner.jsx` | Loading indicator |

### Pages
| File | Purpose |
|------|---------|
| `src/pages/Dashboard.jsx` | Main dashboard |
| `src/pages/Login.jsx` | Login page |
| `src/pages/Users.jsx` | User management |
| `src/pages/SDTZone.jsx` | Zone management |

---

## 💡 Pro Tips

### 1. **Use Console Snippets**
```javascript
// Check auth status
localStorage.getItem('authToken')
localStorage.getItem('refreshToken')

// Check Redux state
window.__REDUX_DEVTOOLS_EXTENSION__?.()
```

### 2. **Hot Reload Issues**
```bash
# If hot reload stops working:
rm -rf node_modules/.cache
npm start
```

### 3. **VS Code Extensions**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag

### 4. **Code Snippets**
```javascript
// Create React component (type 'rfc' + Tab)
import React from 'react'

export default function ComponentName() {
  return (
    <div>ComponentName</div>
  )
}

// Create Redux slice (type 'redux-slice')
import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'name',
  initialState: {},
  reducers: {}
})

export default slice.reducer
```

### 5. **Testing Changes**
```bash
# Test login flow
1. Clear localStorage
2. Go to /login
3. Enter credentials
4. Verify redirect to dashboard
5. Check user info in header
6. Test logout
```

---

## 🚀 Next Steps

1. **Read the full documentation**: `KTL_ISP_BILLING_FRONTEND_DOCUMENTATION.md`
2. **Join team communication**: Slack/Discord/etc.
3. **Review open issues**: Check GitHub issues
4. **Ask questions**: Don't hesitate to ask the team
5. **Start contributing**: Pick a good first issue

---

## 📞 Get Help

- **Documentation**: Read the full docs
- **Team Chat**: Ask in team channel
- **Code Review**: Submit PRs for feedback
- **Pair Programming**: Schedule with senior dev

---

**Happy Coding! 🎉**

Remember: Every expert developer was once a beginner. Take your time to understand the codebase, and don't be afraid to ask questions!
