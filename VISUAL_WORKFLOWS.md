# KTL ISP Billing Frontend - Visual Workflows & Architecture

This document provides visual representations of the application's architecture, data flows, and key workflows.

---

## Application Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           BROWSER                                   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    React Application                          │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                  App.jsx (Router)                       │ │ │
│  │  │  - Route Management                                     │ │ │
│  │  │  - Protected Routes                                     │ │ │
│  │  │  - Layout Wrapper                                       │ │ │
│  │  └──────────┬──────────────────────────────────────────────┘ │ │
│  │             │                                                 │ │
│  │  ┌──────────▼────────────┐  ┌─────────────────────────────┐ │ │
│  │  │   Protected Routes    │  │    Public Routes            │ │ │
│  │  │  (Auth Required)      │  │    (No Auth)                │ │ │
│  │  │  - Dashboard          │  │    - Login                  │ │ │
│  │  │  - Users              │  │                             │ │ │
│  │  │  - Billing            │  │                             │ │ │
│  │  │  - Network            │  │                             │ │ │
│  │  └──────────┬────────────┘  └─────────────────────────────┘ │ │
│  │             │                                                 │ │
│  │  ┌──────────▼────────────────────────────────────────────┐  │ │
│  │  │                Layout Component                       │  │ │
│  │  │  ┌──────────────┐  ┌────────────────────────────────┐│  │ │
│  │  │  │   Header     │  │     Sidebar (Navigation)       ││  │ │
│  │  │  │  - User Info │  │     - Menu Items               ││  │ │
│  │  │  │  - Logout    │  │     - Active Highlighting      ││  │ │
│  │  │  └──────────────┘  └────────────────────────────────┘│  │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │  │ │
│  │  │  │         Page Content (Dynamic)                  │ │  │ │
│  │  │  │         - Dashboard                             │ │  │ │
│  │  │  │         - Users                                 │ │  │ │
│  │  │  │         - Billing, etc.                         │ │  │ │
│  │  │  └─────────────────────────────────────────────────┘ │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼──────────┐                    ┌───────────▼───────────┐
│   Redux Store    │                    │    React Query        │
│  (Client State)  │                    │   (Server State)      │
│                  │                    │                       │
│  - auth          │                    │  - Data Caching       │
│  - theme         │                    │  - Auto Refetch       │
│  - users         │                    │  - Loading States     │
│  - roles         │                    │  - Error Handling     │
│  - permissions   │                    │                       │
└───────┬──────────┘                    └───────────┬───────────┘
        │                                           │
        └─────────────────────┬─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Axios Instance  │
                    │  (HTTP Client)    │
                    │                   │
                    │  - Interceptors   │
                    │  - Token Refresh  │
                    │  - Error Handler  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Backend API     │
                    │   (Django REST)   │
                    │                   │
                    │  - Authentication │
                    │  - Data CRUD      │
                    │  - Business Logic │
                    └───────────────────┘
```

---

## Authentication Flow

### Complete Login Flow

```
┌──────────────┐
│    User      │
│  (Browser)   │
└──────┬───────┘
       │
       │ 1. Navigate to /login
       │
┌──────▼────────────────────────────────────────────┐
│              Login Page Component                 │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  Login Form (React Hook Form)              │ │
│  │  - Username/Login ID                        │ │
│  │  - Password                                 │ │
│  │  - Remember Me Checkbox                     │ │
│  └─────────────────┬───────────────────────────┘ │
└────────────────────┼───────────────────────────────┘
                     │
                     │ 2. Submit Form
                     │
┌────────────────────▼───────────────────────────────┐
│              useAuth Hook                          │
│              login(credentials)                    │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 3. Dispatch loginStart()
                     │
┌────────────────────▼───────────────────────────────┐
│              Redux Store                           │
│              state.loading = true                  │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 4. API Call
                     │
┌────────────────────▼───────────────────────────────┐
│         authService.login(credentials)             │
│         POST /auth/login/                          │
│         Body: { login_id, password, remember_me }  │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 5. Request Interceptor
                     │    (No token needed for login)
                     │
┌────────────────────▼───────────────────────────────┐
│              Backend API                           │
│              Django REST Framework                 │
│                                                    │
│  - Validate Credentials                            │
│  - Generate JWT Tokens                             │
│  - Return User Data                                │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 6. Response
                     │    { user, tokens: { access, refresh }, expires_at }
                     │
┌────────────────────▼───────────────────────────────┐
│         Response Interceptor                       │
│         (Success - Pass through)                   │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 7. Store tokens
                     │
┌────────────────────▼───────────────────────────────┐
│         localStorage                               │
│         - authToken = tokens.access                │
│         - refreshToken = tokens.refresh            │
│         - rememberMe = true/false                  │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 8. Update Redux State
                     │
┌────────────────────▼───────────────────────────────┐
│         Redux Store (authSlice)                    │
│         - user: { ...userData }                    │
│         - token: access_token                      │
│         - refreshToken: refresh_token              │
│         - isAuthenticated: true                    │
│         - loading: false                           │
│         - expiresAt: timestamp                     │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 9. Navigation
                     │
┌────────────────────▼───────────────────────────────┐
│         React Router                               │
│         navigate('/dashboard')                     │
└────────────────────┬───────────────────────────────┘
                     │
                     │ 10. Render Dashboard
                     │
┌────────────────────▼───────────────────────────────┐
│         Dashboard Page                             │
│         - Show user info in header                 │
│         - Display metrics and charts               │
│         - Protected by ProtectedRoute wrapper      │
└────────────────────────────────────────────────────┘
```

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────┐
│         Component makes API request                 │
│         Example: fetchUsers()                       │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 1. GET /users/
                       │    Authorization: Bearer <expired_token>
                       │
┌──────────────────────▼──────────────────────────────┐
│         Backend API                                 │
│         - Validates token                           │
│         - Token is expired                          │
│         - Returns 401 Unauthorized                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 2. 401 Response
                       │
┌──────────────────────▼──────────────────────────────┐
│         Axios Response Interceptor                  │
│         - Detects 401 status                        │
│         - Checks if not already retrying            │
│         - Sets _retry flag                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 3. Get refresh token from localStorage
                       │
┌──────────────────────▼──────────────────────────────┐
│         localStorage.getItem('refreshToken')        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 4. Call refresh endpoint
                       │
┌──────────────────────▼──────────────────────────────┐
│         POST /auth/refresh/                         │
│         Body: { refresh: <refresh_token> }          │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 5. Backend validates refresh token
                       │
┌──────────────────────▼──────────────────────────────┐
│         Backend API                                 │
│         - Validates refresh token                   │
│         - Generates new access token                │
│         - Returns { access: <new_token> }           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 6. New access token
                       │
┌──────────────────────▼──────────────────────────────┐
│         Update localStorage                         │
│         authToken = new_access_token                │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 7. Retry original request
                       │
┌──────────────────────▼──────────────────────────────┐
│         Retry GET /users/                           │
│         Authorization: Bearer <new_token>           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 8. Success response
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component receives data                     │
│         Renders user list                           │
└─────────────────────────────────────────────────────┘

                  ---- ERROR CASE ----

If refresh token is also expired:

┌──────────────────────▼──────────────────────────────┐
│         Refresh token validation fails              │
│         Backend returns 401                         │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Clear tokens & redirect
                       │
┌──────────────────────▼──────────────────────────────┐
│         Clear localStorage                          │
│         - Remove authToken                          │
│         - Remove refreshToken                       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redirect to /login                          │
│         User must login again                       │
└─────────────────────────────────────────────────────┘
```

---

## Data Fetching Flow (React Query)

### Dashboard Data Loading

```
┌─────────────────────────────────────────────────────┐
│         Dashboard Component Mounts                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 1. useQuery hook initialization
                       │
┌──────────────────────▼──────────────────────────────┐
│         React Query                                 │
│         const { data, isLoading, error } = useQuery({│
│           queryKey: ['dashboard'],                  │
│           queryFn: () => dashboardService.getData(),│
│           refetchInterval: 30000,                   │
│           staleTime: 5000                          │
│         })                                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 2. Check cache
                       │
              ┌────────┴────────┐
              │                 │
       Cache HIT            Cache MISS
              │                 │
              │                 │
    ┌─────────▼────────┐  ┌────▼──────────────────┐
    │ Return cached    │  │ Execute queryFn       │
    │ data immediately │  │ (API call)            │
    └─────────┬────────┘  └────┬──────────────────┘
              │                 │
              │           ┌─────▼───────────────────┐
              │           │ dashboardService        │
              │           │   .getDashboardData()   │
              │           └─────┬───────────────────┘
              │                 │
              │           ┌─────▼───────────────────┐
              │           │ GET /dashboard/overview/│
              │           │ Auth: Bearer <token>    │
              │           └─────┬───────────────────┘
              │                 │
              │           ┌─────▼───────────────────┐
              │           │ Backend API             │
              │           │ - Calculates metrics    │
              │           │ - Aggregates data       │
              │           │ - Returns JSON          │
              │           └─────┬───────────────────┘
              │                 │
              │           ┌─────▼───────────────────┐
              │           │ Response:               │
              │           │ {                       │
              │           │   metrics: {...},       │
              │           │   zones: [...],         │
              │           │   onlineUsers: [...]    │
              │           │ }                       │
              │           └─────┬───────────────────┘
              │                 │
              └─────────────────┴───────────────────┘
                                │
                                │ 3. Cache response
                                │
┌───────────────────────────────▼─────────────────────┐
│         React Query Cache                           │
│         - Store data with key ['dashboard']         │
│         - Set staleTime timer                       │
│         - Set refetchInterval timer                 │
└───────────────────────────────┬─────────────────────┘
                                │
                                │ 4. Return data to component
                                │
┌───────────────────────────────▼─────────────────────┐
│         Dashboard Component                         │
│         - data available                            │
│         - isLoading: false                          │
│         - Renders UI with data                      │
│                                                     │
│         Every 30 seconds:                           │
│         - Automatically refetch                     │
│         - Update cache                              │
│         - Re-render component                       │
└─────────────────────────────────────────────────────┘
```

---

## Redux State Management Flow

### User Creation Flow

```
┌─────────────────────────────────────────────────────┐
│         CreateUser Page Component                   │
│         - User fills form                           │
│         - Clicks "Create User" button               │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 1. Form submission
                       │    handleSubmit(formData)
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component                                   │
│         dispatch(createUser(formData))              │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 2. Dispatch Redux Thunk
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux Thunk (usersSlice)                    │
│         export const createUser = createAsyncThunk( │
│           'users/createUser',                       │
│           async (userData) => {...}                 │
│         )                                           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 3. Thunk execution starts
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux State (usersSlice)                    │
│         createUser.pending:                         │
│         - state.loading = true                      │
│         - state.error = null                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 4. Component shows loading state
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component Re-renders                        │
│         - Button shows spinner                      │
│         - Form disabled                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 5. API call
                       │
┌──────────────────────▼──────────────────────────────┐
│         api.post(ENDPOINTS.USERS.CREATE, userData)  │
│         POST /users/                                │
│         Authorization: Bearer <token>               │
│         Body: { name, email, user_type, ... }       │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 6. Backend processing
                       │
┌──────────────────────▼──────────────────────────────┐
│         Backend API                                 │
│         - Validates data                            │
│         - Creates user in database                  │
│         - Returns created user object               │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 7. Success response
                       │    { id, name, email, ... }
                       │
┌──────────────────────▼──────────────────────────────┐
│         Axios Response Interceptor                  │
│         - Success, pass through                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 8. Thunk fulfilled
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux State (usersSlice)                    │
│         createUser.fulfilled:                       │
│         - state.loading = false                     │
│         - state.users.push(action.payload)          │
│         - state.error = null                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 9. Component re-renders
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component                                   │
│         - Show success toast                        │
│         - Navigate to users list                    │
│         - Reset form                                │
└─────────────────────────────────────────────────────┘

                  ---- ERROR CASE ----

If API call fails:

┌──────────────────────▼──────────────────────────────┐
│         Backend returns error                       │
│         Status: 400 Bad Request                     │
│         Body: { message: "Email already exists" }   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Error response
                       │
┌──────────────────────▼──────────────────────────────┐
│         Axios Response Interceptor                  │
│         - Shows error toast                         │
│         - Returns rejected promise                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Thunk rejected
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux State (usersSlice)                    │
│         createUser.rejected:                        │
│         - state.loading = false                     │
│         - state.error = action.error.message        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Component re-renders
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component                                   │
│         - Show error message                        │
│         - Re-enable form                            │
│         - User can fix and retry                    │
└─────────────────────────────────────────────────────┘
```

---

## Component Lifecycle & Data Flow

### Typical Page Component Lifecycle

```
┌─────────────────────────────────────────────────────┐
│         Component Initialization                    │
│         Example: Users Page                         │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 1. Component Mounts
                       │
┌──────────────────────▼──────────────────────────────┐
│         const Users = () => {                       │
│           // Hooks initialization                   │
│           const dispatch = useDispatch()            │
│           const { users, loading } = useSelector()  │
│           const [searchTerm, setSearchTerm] = ...   │
│         }                                           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 2. useEffect runs
                       │
┌──────────────────────▼──────────────────────────────┐
│         useEffect(() => {                           │
│           dispatch(fetchUsers({ page: 1 }))         │
│         }, [dispatch])                              │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 3. Dispatch action
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux Thunk: fetchUsers                     │
│         - state.loading = true                      │
│         - API call to GET /users/                   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 4. While loading...
                       │
┌──────────────────────▼──────────────────────────────┐
│         Component renders loading state             │
│         if (loading) return <LoadingSpinner />      │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 5. API response received
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux State Updated                         │
│         - state.loading = false                     │
│         - state.users = [...response data]          │
│         - state.pagination = { count, next, prev }  │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 6. Component re-renders
                       │
┌──────────────────────▼──────────────────────────────┐
│         Render users table                          │
│         {users.map(user => (                        │
│           <UserRow key={user.id} user={user} />     │
│         ))}                                         │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 7. User interaction
                       │    (e.g., search, delete)
                       │
┌──────────────────────▼──────────────────────────────┐
│         Event Handler                               │
│         handleSearch(term) {                        │
│           dispatch(fetchUsers({ search: term }))    │
│         }                                           │
│                                                     │
│         handleDelete(userId) {                      │
│           dispatch(deleteUser(userId))              │
│         }                                           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 8. Redux action dispatched
                       │
┌──────────────────────▼──────────────────────────────┐
│         Redux Thunk executes                        │
│         - Update loading state                      │
│         - API call                                  │
│         - Update state on success/error             │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 9. Component re-renders with new data
                       │
┌──────────────────────▼──────────────────────────────┐
│         Updated UI displayed                        │
│         - Show success/error toast                  │
│         - Update table                              │
│         - Reset forms if needed                     │
└─────────────────────────────────────────────────────┘
```

---

## Navigation & Routing Flow

```
┌─────────────────────────────────────────────────────┐
│         User clicks navigation link                 │
│         Example: Sidebar -> "Users"                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 1. <Link to="/users">
                       │
┌──────────────────────▼──────────────────────────────┐
│         React Router                                │
│         - Captures route change                     │
│         - Updates browser URL                       │
│         - Triggers route matching                   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 2. Match route in App.jsx
                       │
┌──────────────────────▼──────────────────────────────┐
│         <Route path="/users" element={...} />       │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ 3. ProtectedRoute wrapper
                       │
┌──────────────────────▼──────────────────────────────┐
│         const ProtectedRoute = ({ children }) => {  │
│           const { isAuthenticated, loading } = ...  │
│                                                     │
│           if (loading) return <LoadingSpinner />    │
│           return isAuthenticated ?                  │
│             children :                              │
│             <Navigate to="/login" />                │
│         }                                           │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
       Authenticated        Not Authenticated
              │                 │
              │                 │
    ┌─────────▼────────┐  ┌────▼──────────────────┐
    │ Render Layout    │  │ Redirect to /login    │
    │ - Header         │  │                       │
    │ - Sidebar        │  └───────────────────────┘
    │ - Page Content   │
    └─────────┬────────┘
              │
              │ 4. Layout renders
              │
    ┌─────────▼────────────────────────────────────┐
    │ <Layout>                                     │
    │   <Header />                                 │
    │   <Sidebar />                                │
    │   <main>                                     │
    │     {children} // Users component            │
    │   </main>                                    │
    │ </Layout>                                    │
    └─────────┬────────────────────────────────────┘
              │
              │ 5. Sidebar highlights active route
              │
    ┌─────────▼────────────────────────────────────┐
    │ const isActive = (path) => {                 │
    │   return location.pathname === path          │
    │ }                                            │
    │                                              │
    │ <Link                                        │
    │   className={isActive('/users') ?            │
    │     'active-class' : 'inactive-class'}       │
    │ >                                            │
    └─────────┬────────────────────────────────────┘
              │
              │ 6. Users component mounts
              │
    ┌─────────▼────────────────────────────────────┐
    │ <Users />                                    │
    │ - Fetches user data                          │
    │ - Renders user list                          │
    │ - Handles user interactions                  │
    └──────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────┐
│         API Request Fails                           │
│         Example: Network error, 500 error, etc.     │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Error response
                       │
┌──────────────────────▼──────────────────────────────┐
│         Axios Response Interceptor                  │
│         api.interceptors.response.use(              │
│           (response) => response,                   │
│           async (error) => { ... }                  │
│         )                                           │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
        401 Unauthorized    Other Errors
              │                 │
              │                 │
    ┌─────────▼────────┐  ┌────▼──────────────────┐
    │ Token Refresh    │  │ Extract error message │
    │ Logic            │  │ const message =       │
    │ (See Token       │  │   error.response?.    │
    │ Refresh Flow)    │  │     data?.message     │
    └──────────────────┘  └────┬──────────────────┘
                               │
                               │ Show toast
                               │
                     ┌─────────▼────────────────────┐
                     │ toast.error(message)         │
                     │ - Display error notification │
                     │ - Auto-dismiss after 4s      │
                     └─────────┬────────────────────┘
                               │
                               │ Reject promise
                               │
                     ┌─────────▼────────────────────┐
                     │ return Promise.reject(error) │
                     └─────────┬────────────────────┘
                               │
                               │ Redux Thunk catches error
                               │
                     ┌─────────▼────────────────────┐
                     │ Redux State                  │
                     │ thunk.rejected:              │
                     │ - state.loading = false      │
                     │ - state.error = error.message│
                     └─────────┬────────────────────┘
                               │
                               │ Component re-renders
                               │
                     ┌─────────▼────────────────────┐
                     │ Component                    │
                     │ {error && (                  │
                     │   <ErrorMessage>             │
                     │     {error}                  │
                     │   </ErrorMessage>            │
                     │ )}                           │
                     └──────────────────────────────┘
```

---

## State Flow Summary

### Redux State Flow
```
User Action → Component → dispatch(action) → Redux Thunk
→ API Call → Response → Update State → Component Re-render
```

### React Query State Flow
```
Component Mount → useQuery → Check Cache → (Miss: API Call)
→ Response → Update Cache → Return Data → Component Render
```

### Form State Flow
```
User Input → React Hook Form → Validation → Submit
→ API Call → Success/Error → Toast Notification
→ Navigate/Reset
```

---

This visual documentation should help new developers understand the data flow and architecture of the application at a glance!
