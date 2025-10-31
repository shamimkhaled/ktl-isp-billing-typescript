# 🚀 User Management - Frontend Developer Guide

> **For Beginners in React & TypeScript**
>
> This guide will help you understand the User Management system, how it connects to the backend, and how to add new features.

---

## 📚 Table of Contents

1. [Project Overview](#-project-overview)
2. [File Structure](#-file-structure)
3. [Backend Integration](#-backend-integration)
4. [Key Concepts](#-key-concepts)
5. [How Data Flows](#-how-data-flows)
6. [Adding New Features](#-adding-new-features)
7. [Working with APIs](#-working-with-apis)
8. [Common Tasks](#-common-tasks)
9. [Troubleshooting](#-troubleshooting)
10. [Best Practices](#-best-practices)

---

## 🎯 Project Overview

### What is User Management?

User Management is a system that controls:

- **Who** can access the system (Users)
- **What** they can do (Permissions)
- **How** they're grouped (Roles)

### Tech Stack

```
Frontend:
- React 19 (UI Framework)
- TypeScript (Type Safety)
- Redux Toolkit (State Management)
- React Hook Form + Zod (Form Validation)
- Axios (API Calls)
- TailwindCSS (Styling)

Backend:
- Django REST Framework
- PostgreSQL Database
- JWT Authentication
```

---

## 📁 File Structure

### Overview

```
src/
├── pages/UserManagement/          # 🎨 UI Components
│   ├── Users.tsx                  # Main user list & CRUD
│   ├── RoleManagement.tsx         # Role management
│   ├── PermissionManagement.tsx   # Permission management
│   ├── UserProfile.tsx            # View user profile
│   └── MainProfile.tsx            # Current user profile
│
├── services/                      # 🔌 API Communication
│   ├── api.ts                     # Core API client (axios)
│   ├── user.service.ts            # User API calls
│   ├── role.service.ts            # Role API calls
│   ├── permission.service.ts      # Permission API calls
│   └── auth.service.ts            # Authentication
│
├── types/                         # 📝 TypeScript Definitions
│   ├── user.types.ts              # User, Role, Permission types
│   ├── auth.types.ts              # Auth-related types
│   └── api.types.ts               # API response types
│
├── hooks/                         # 🎣 Custom React Hooks
│   ├── useUsers.ts                # User state & operations
│   ├── useAuth.ts                 # Authentication state
│   └── useDebounce.ts             # Search debouncing
│
├── store/                         # 🗄️ Redux State Management
│   ├── index.ts                   # Store configuration
│   ├── userSlice.ts               # User state slice
│   └── authSlice.ts               # Auth state slice
│
├── components/common/             # 🧩 Reusable Components
│   ├── Button.tsx                 # Custom button
│   ├── Input.tsx                  # Form input
│   ├── Modal.tsx                  # Modal dialog
│   ├── Card.tsx                   # Card container
│   └── LoadingSpinner.tsx         # Loading indicator
│
└── utils/                         # 🛠️ Helper Functions
    ├── helpers.tsx                # Utility functions
    ├── validators.ts              # Form validators
    └── constants.ts               # App constants
```

### Detailed File Explanation

#### 1. **Pages (UI Components)**

```typescript
// pages/UserManagement/Users.tsx
// This is the MAIN file you'll work with most often
// It handles:
// - Displaying user list in a table
// - Creating new users (modal form)
// - Editing existing users (modal form)
// - Deleting users (confirmation modal)
// - Searching & filtering users

// Key sections:
// - State management (useState hooks)
// - Data fetching (useUsers hook)
// - Form handling (react-hook-form)
// - UI rendering (JSX/TSX)
```

#### 2. **Services (API Layer)**

```typescript
// services/user.service.ts
// This file talks to the backend API
// Each method = one API endpoint

export class UserService {
  async getUsers(params?) {
    // GET /api/v1/users/
    return apiService.get("/users/", params);
  }

  async createUser(userData) {
    // POST /api/v1/users/
    return apiService.post("/users/", userData);
  }

  async updateUser(id, userData) {
    // PATCH /api/v1/users/{id}/
    return apiService.patch(`/users/${id}/`, userData);
  }

  async deleteUser(id) {
    // DELETE /api/v1/users/{id}/
    return apiService.delete(`/users/${id}/`);
  }
}
```

#### 3. **Types (TypeScript Definitions)**

```typescript
// types/user.types.ts
// Defines the shape of your data
// MUST match backend API responses

interface User {
  id: string;
  login_id: string; // Username
  email: string;
  name: string;
  mobile: string;
  user_type: string; // Role name
  is_active: boolean;
  created_at: string;
  // ... more fields
}

// When creating a user
interface UserCreate {
  login_id: string;
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  user_type: string;
  // ... optional fields
}
```

#### 4. **Hooks (Custom Logic)**

```typescript
// hooks/useUsers.ts
// Simplifies using Redux store + API calls
// Use this instead of calling services directly!

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);

  const fetchUsers = useCallback(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  const createUser = useCallback(
    async (userData) => {
      await dispatch(createUserAsync(userData)).unwrap();
    },
    [dispatch]
  );

  return { users, loading, error, fetchUsers, createUser };
};

// Usage in component:
const { users, loading, createUser } = useUsers();
```

#### 5. **Store (State Management)**

```typescript
// store/userSlice.ts
// Redux Toolkit slice for user state
// Handles API calls and updates state

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async (params) => {
    const response = await userService.getUsers(params);
    return response;
  }
);

// State shape:
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
}
```

---

## 🔌 Backend Integration

### API Base URL

```typescript
// Development (your local machine)
http://localhost:3006/api → Proxied to backend

// Production
https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1
```

### Authentication

```typescript
// 1. Login
POST /api/v1/auth/login/
Request: { login_id: "admin", password: "pass123" }
Response: {
  success: true,
  data: {
    user: { id, name, email, ... },
    tokens: {
      access: "jwt_token_here",
      refresh: "refresh_token_here"
    },
    expires_at: "2025-10-31T12:00:00Z"
  }
}

// 2. Token is stored in localStorage
localStorage.setItem('authToken', tokens.access)

// 3. Every API call includes token
Authorization: Bearer <access_token>

// 4. Token auto-refreshes on expiration
```

### API Endpoints Reference

#### **Users**

| Method | Endpoint                         | Purpose                    |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/api/v1/users/`                 | List all users (paginated) |
| POST   | `/api/v1/users/`                 | Create new user            |
| GET    | `/api/v1/users/{id}/`            | Get single user            |
| PATCH  | `/api/v1/users/{id}/`            | Update user (partial)      |
| PUT    | `/api/v1/users/{id}/`            | Update user (full)         |
| DELETE | `/api/v1/users/{id}/`            | Delete user                |
| GET    | `/api/v1/users/profile/`         | Get current user profile   |
| POST   | `/api/v1/users/change-password/` | Change password            |

#### **Roles**

| Method    | Endpoint                | Purpose             |
| --------- | ----------------------- | ------------------- |
| GET       | `/api/v1/roles/`        | List all roles      |
| POST      | `/api/v1/roles/`        | Create new role     |
| GET       | `/api/v1/roles/{id}/`   | Get single role     |
| PUT/PATCH | `/api/v1/roles/{id}/`   | Update role         |
| DELETE    | `/api/v1/roles/{id}/`   | Delete role         |
| POST      | `/api/v1/roles/assign/` | Assign role to user |

#### **Permissions**

| Method | Endpoint                         | Purpose                 |
| ------ | -------------------------------- | ----------------------- |
| GET    | `/api/v1/permissions/`           | List Django permissions |
| GET    | `/api/v1/custom-permissions/`    | List custom permissions |
| POST   | `/api/v1/custom-permissions/`    | Create permission       |
| GET    | `/api/v1/permission-categories/` | List categories         |

### Request/Response Format

#### **Success Response**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User created successfully"
}
```

#### **Error Response**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["This field is required"],
    "login_id": ["User with this login ID already exists"]
  }
}
```

#### **Paginated Response**

```json
{
  "count": 150,
  "next": "https://api/users/?page=2",
  "previous": null,
  "results": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ]
}
```

---

## 🧠 Key Concepts

### 1. **React Components**

```typescript
// Functional component with TypeScript
const Users: React.FC = () => {
  // State (data that can change)
  const [searchTerm, setSearchTerm] = useState("");

  // Effect (runs on mount)
  useEffect(() => {
    fetchUsers();
  }, []);

  // Render UI
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
```

### 2. **TypeScript Types**

```typescript
// Define shape of data
interface User {
  id: string;
  name: string;
  email: string;
}

// Use in function
function getUser(id: string): User {
  // TypeScript knows what User looks like
  return { id, name: "John", email: "john@example.com" };
}

// Use in component
const user: User = { id: "1", name: "Jane", email: "jane@example.com" };
```

### 3. **Async/Await (API Calls)**

```typescript
// Old way (callbacks)
userService
  .getUsers()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });

// New way (async/await)
const fetchData = async () => {
  try {
    const data = await userService.getUsers();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### 4. **State Management (Redux)**

```typescript
// Without Redux (component state only)
const [users, setUsers] = useState([]);

// With Redux (global state)
const users = useSelector((state) => state.user.users);
const dispatch = useDispatch();

// Why Redux?
// - State shared across components
// - Centralized API call logic
// - Easier to debug
```

### 5. **Form Handling**

```typescript
// React Hook Form + Zod validation
const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name too short"),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});

// In JSX
<input {...register("email")} />;
{
  errors.email && <span>{errors.email.message}</span>;
}
```

---

## 🔄 How Data Flows

### Example: Creating a New User

```
1. User clicks "Add New User" button
   ↓
2. Modal opens with UserForm component
   ↓
3. User fills form and clicks Submit
   ↓
4. handleCreateUser() function called
   ↓
5. Form validation runs (Zod schema)
   ↓
6. If valid, call createUser() from useUsers hook
   ↓
7. Hook dispatches createUserAsync (Redux thunk)
   ↓
8. Thunk calls userService.createUser(data)
   ↓
9. Service calls apiService.post('/users/', data)
   ↓
10. API client sends POST to backend
    ↓
11. Backend creates user in database
    ↓
12. Backend returns response
    ↓
13. API client receives response
    ↓
14. Redux updates state with new user
    ↓
15. Component re-renders with updated user list
    ↓
16. Modal closes, success message shown
```

### Visual Diagram

```
┌─────────────┐
│  Component  │ (Users.tsx)
│   (UI)      │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  useUsers   │ (Custom Hook)
│   (Logic)   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Redux Store │ (State Management)
│  userSlice  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Service   │ (user.service.ts)
│  (API Call) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Client  │ (api.ts - Axios)
│  (HTTP)     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Backend   │ (Django REST API)
│  (Database) │
└─────────────┘
```

---

## ➕ Adding New Features

### Step-by-Step Guide

#### **Scenario: Add "Suspend User" Feature**

Let's add a button to temporarily suspend users.

#### **Step 1: Add Backend Endpoint (Ask Backend Team)**

```
POST /api/v1/users/{id}/suspend/
Request: { reason: string }
Response: { success: true, data: { ...user, is_suspended: true } }
```

#### **Step 2: Update TypeScript Types**

```typescript
// File: src/types/user.types.ts

// Add new field to User interface
export interface User {
  id: string;
  name: string;
  // ... existing fields
  is_suspended: boolean; // ← ADD THIS
  suspension_reason?: string; // ← ADD THIS
}

// Add new function signature
export interface SuspendUserData {
  reason: string;
}
```

#### **Step 3: Add Service Method**

```typescript
// File: src/services/user.service.ts

export class UserService {
  // ... existing methods

  // ADD THIS METHOD
  async suspendUser(id: string, data: SuspendUserData): Promise<User> {
    return apiService.post<User>(`/users/${id}/suspend/`, data);
  }

  async unsuspendUser(id: string): Promise<User> {
    return apiService.post<User>(`/users/${id}/unsuspend/`);
  }
}
```

#### **Step 4: Add Redux Actions**

```typescript
// File: src/store/userSlice.ts

// ADD THIS THUNK
export const suspendUserAsync = createAsyncThunk(
  'users/suspendUser',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await userService.suspendUser(id, { reason });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to suspend user');
    }
  }
);

// ADD TO extraReducers
.addCase(suspendUserAsync.fulfilled, (state, action) => {
  const index = state.users.findIndex(user => user.id === action.payload.id);
  if (index !== -1) {
    state.users[index] = action.payload; // Update user in state
  }
})
```

#### **Step 5: Add to Custom Hook**

```typescript
// File: src/hooks/useUsers.ts

export const useUsers = () => {
  // ... existing code

  // ADD THIS
  const suspendUser = useCallback(
    async (id: string, reason: string) => {
      try {
        await dispatch(suspendUserAsync({ id, reason })).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  return {
    users,
    loading,
    error,
    // ... existing returns
    suspendUser, // ← ADD THIS
  };
};
```

#### **Step 6: Add UI Button**

```typescript
// File: src/pages/UserManagement/Users.tsx

export const Users: React.FC = () => {
  const { users, suspendUser } = useUsers();
  const [suspendingUser, setSuspendingUser] = useState<User | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");

  const handleSuspend = async () => {
    if (!suspendingUser) return;

    const result = await suspendUser(suspendingUser.id, suspensionReason);
    if (result.success) {
      toast.success("User suspended successfully");
      setSuspendingUser(null);
      setSuspensionReason("");
    } else {
      toast.error(result.error || "Failed to suspend user");
    }
  };

  return (
    <div>
      {/* Add button in the action menu */}
      <button onClick={() => setSuspendingUser(user)} className="menu-item">
        Suspend User
      </button>

      {/* Add modal for suspension reason */}
      <Modal
        isOpen={!!suspendingUser}
        onClose={() => setSuspendingUser(null)}
        title="Suspend User"
      >
        <div>
          <label>Reason for suspension:</label>
          <textarea
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder="Enter reason..."
          />
          <button onClick={handleSuspend}>Suspend</button>
        </div>
      </Modal>
    </div>
  );
};
```

#### **Step 7: Test**

1. Run development server: `npm run dev`
2. Click "Suspend User" button
3. Check browser Network tab for API call
4. Verify user is suspended in UI
5. Check Redux DevTools for state update

---

## 🔧 Working with APIs

### Making API Calls

#### **Method 1: Using Custom Hook (Recommended)**

```typescript
// In your component
const { users, loading, createUser } = useUsers();

const handleCreate = async (data) => {
  const result = await createUser(data);
  if (result.success) {
    toast.success("User created!");
  }
};
```

#### **Method 2: Direct Service Call**

```typescript
import { userService } from "../services/user.service";

const handleCreate = async (data) => {
  try {
    const user = await userService.createUser(data);
    console.log("Created:", user);
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

#### **Method 3: Redux Dispatch (Advanced)**

```typescript
import { useAppDispatch } from "../store";
import { createUserAsync } from "../store/userSlice";

const dispatch = useAppDispatch();

const handleCreate = async (data) => {
  try {
    const result = await dispatch(createUserAsync(data)).unwrap();
    console.log("Created:", result);
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

### Handling Loading States

```typescript
const { users, loading, error } = useUsers();

if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <div>Error: {error}</div>;
}

return <div>{users.map(user => ...)}</div>;
```

### Error Handling

```typescript
try {
  const result = await createUser(userData);
  if (result.success) {
    toast.success("User created!");
  } else {
    toast.error(result.error || "Failed to create user");
  }
} catch (error: any) {
  // Validation errors
  if (error.errors) {
    Object.keys(error.errors).forEach((field) => {
      toast.error(`${field}: ${error.errors[field].join(", ")}`);
    });
  } else {
    toast.error(error.message || "Something went wrong");
  }
}
```

### Testing API in Browser

```javascript
// Open browser console and test manually

// Get users
fetch("/api/v1/users/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
})
  .then((r) => r.json())
  .then(console.log);

// Create user
fetch("/api/v1/users/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    login_id: "testuser",
    email: "test@example.com",
    password: "testpass123",
    password_confirm: "testpass123",
    name: "Test User",
    user_type: "field_staff",
    address: "123 Test St",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📋 Common Tasks

### Task 1: Add a New Field to User Form

**Scenario:** Add "NID Number" field to user creation form.

```typescript
// 1. Update type
// File: src/types/user.types.ts
export interface User {
  // ... existing fields
  nid_number?: string; // ← ADD THIS
}

export interface UserCreate {
  // ... existing fields
  nid_number?: string; // ← ADD THIS
}

// 2. Update validation schema
// File: src/pages/UserManagement/Users.tsx
const userCreateSchema = z.object({
  // ... existing fields
  nid_number: z
    .string()
    .regex(/^\d{10}$/, "NID must be 10 digits")
    .optional(), // ← ADD THIS
});

// 3. Add input field to form
<Input
  label="NID Number (Optional)"
  {...register("nid_number")}
  error={errors.nid_number?.message}
  disabled={loading}
  placeholder="Enter 10-digit NID"
/>;
```

### Task 2: Add Search Functionality

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 300); // Wait 300ms after typing

// Filter users
const filteredUsers = users.filter(
  (user) =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
);

// Or fetch from API with search
useEffect(() => {
  fetchUsers({ search: debouncedSearch });
}, [debouncedSearch]);
```

### Task 3: Add Sorting

```typescript
const [sortBy, setSortBy] = useState("name");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

const sortedUsers = [...users].sort((a, b) => {
  const aVal = a[sortBy];
  const bVal = b[sortBy];

  if (sortOrder === "asc") {
    return aVal > bVal ? 1 : -1;
  } else {
    return aVal < bVal ? 1 : -1;
  }
});
```

### Task 4: Add Bulk Actions

```typescript
const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

const handleSelectAll = () => {
  if (selectedUsers.length === users.length) {
    setSelectedUsers([]);
  } else {
    setSelectedUsers(users.map((u) => u.id));
  }
};

const handleBulkDelete = async () => {
  await Promise.all(selectedUsers.map((id) => deleteUser(id)));
  setSelectedUsers([]);
};
```

### Task 5: Export Data to CSV

```typescript
const exportToCSV = () => {
  const headers = ["ID", "Name", "Email", "Role"];
  const rows = users.map((u) => [u.id, u.name, u.email, u.user_type]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
};
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### **Issue 1: API Call Not Working**

```typescript
// ❌ Problem: Getting CORS error
Error: Access to XMLHttpRequest has been blocked by CORS policy

// ✅ Solution: Check backend CORS settings
// Backend needs to allow your frontend origin
CORS_ALLOWED_ORIGINS = ["http://localhost:3006"]

// In development, use proxy (already configured in vite.config.ts)
```

#### **Issue 2: TypeScript Errors**

```typescript
// ❌ Problem: Property does not exist on type
error TS2339: Property 'new_field' does not exist on type 'User'

// ✅ Solution: Update type definition
// File: src/types/user.types.ts
export interface User {
  // ... existing fields
  new_field: string;  // Add the missing field
}
```

#### **Issue 3: Component Not Re-rendering**

```typescript
// ❌ Problem: State updated but UI doesn't change
users.push(newUser); // Mutating state directly

// ✅ Solution: Create new array
setUsers([...users, newUser]); // Immutable update

// Or use Redux (handles this automatically)
dispatch(createUserAsync(newUser));
```

#### **Issue 4: Form Validation Not Working**

```typescript
// ❌ Problem: Form submits even with errors
<form onSubmit={onSubmit}>

// ✅ Solution: Use react-hook-form's handleSubmit
<form onSubmit={handleSubmit(onSubmit)}>
// handleSubmit validates before calling onSubmit
```

#### **Issue 5: Token Expired**

```typescript
// ❌ Problem: Getting 401 Unauthorized
Error: Token has expired

// ✅ Solution: Token auto-refreshes
// Check if refresh token is also expired
// Log out and log in again
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
window.location.href = '/login';
```

### Debugging Tools

#### **1. Browser DevTools**

```javascript
// Console
console.log("Users:", users);
console.log("API Response:", response);

// Network Tab
// - See all API requests
// - Check request/response headers
// - View request payload
// - Check response status

// React DevTools
// - Inspect component props
// - View component state
// - See component hierarchy
```

#### **2. Redux DevTools**

```javascript
// Install extension: Redux DevTools
// View state: state.user.users
// Time travel: Replay actions
// See dispatched actions
```

#### **3. VS Code Debugger**

```json
// .vscode/launch.json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug React App",
  "url": "http://localhost:3006",
  "webRoot": "${workspaceFolder}/src"
}

// Set breakpoints in code
// Press F5 to start debugging
```

### Logging API Calls

```typescript
// Already configured in src/services/api.ts
// Check console for:
📤 API Request: POST /api/v1/users/
📥 API Response: 201 /api/v1/users/
❌ API Error: {message, status, url}
```

---

## ✅ Best Practices

### 1. **Code Organization**

```typescript
// ✅ Good: One component per file
// Users.tsx - Main component
// UserRow.tsx - Table row component
// UserForm.tsx - Form component

// ❌ Bad: Everything in one file
// Users.tsx - 2000 lines of code
```

### 2. **TypeScript Types**

```typescript
// ✅ Good: Always define types
interface UserFormData {
  name: string;
  email: string;
}

const handleSubmit = (data: UserFormData) => { ... }

// ❌ Bad: Using 'any'
const handleSubmit = (data: any) => { ... }
```

### 3. **Error Handling**

```typescript
// ✅ Good: Try-catch with user feedback
try {
  await createUser(data);
  toast.success("User created!");
} catch (error) {
  toast.error("Failed to create user");
  console.error(error);
}

// ❌ Bad: Silent errors
createUser(data); // No error handling
```

### 4. **State Updates**

```typescript
// ✅ Good: Immutable updates
setUsers([...users, newUser]);
setUser({ ...user, name: "New Name" });

// ❌ Bad: Mutating state
users.push(newUser);
user.name = "New Name";
```

### 5. **API Calls**

```typescript
// ✅ Good: Use custom hooks
const { users, createUser } = useUsers();

// ✅ Also good: Direct service call
const user = await userService.createUser(data);

// ❌ Bad: Fetch API directly in component
fetch('/api/v1/users/').then(...);
```

### 6. **Loading States**

```typescript
// ✅ Good: Show loading indicator
{
  loading ? <LoadingSpinner /> : <UserList />;
}

// ❌ Bad: No loading feedback
<UserList />; // Empty while loading
```

### 7. **Form Validation**

```typescript
// ✅ Good: Zod schema validation
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
});

// ❌ Bad: Manual validation
if (!email.includes('@')) { ... }
```

### 8. **Component Props**

```typescript
// ✅ Good: Define prop types
interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => { ... }

// ❌ Bad: No prop types
const UserRow = ({ user, onEdit, onDelete }) => { ... }
```

### 9. **Code Comments**

```typescript
// ✅ Good: Explain WHY, not WHAT
// Retry API calls because backend can be slow
originalRequest._retryCount += 1;

// ❌ Bad: Obvious comments
// Increment retry count
originalRequest._retryCount += 1;
```

### 10. **Git Commits**

```bash
# ✅ Good: Descriptive commits
git commit -m "feat: add user suspension feature"
git commit -m "fix: resolve role assignment validation error"

# ❌ Bad: Vague commits
git commit -m "update"
git commit -m "fix bug"
```

---

## 📚 Learning Resources

### React & TypeScript

- **Official React Docs:** https://react.dev/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React TypeScript Cheatsheet:** https://react-typescript-cheatsheet.netlify.app/

### State Management

- **Redux Toolkit:** https://redux-toolkit.js.org/
- **Redux DevTools:** https://github.com/reduxjs/redux-devtools

### Forms

- **React Hook Form:** https://react-hook-form.com/
- **Zod Validation:** https://zod.dev/

### Styling

- **TailwindCSS:** https://tailwindcss.com/docs

### Tools

- **Axios:** https://axios-http.com/docs/intro
- **Vite:** https://vitejs.dev/

---

## 🎓 Next Steps

### Beginner Level (You are here)

- ✅ Understand file structure
- ✅ Know how to make API calls
- ✅ Can add simple UI elements
- ✅ Can update types and services

### Intermediate Level

- 🔄 Add complex features (filters, sorting)
- 🔄 Handle complex state management
- 🔄 Write reusable components
- 🔄 Optimize performance

### Advanced Level

- ⏭️ Build custom hooks
- ⏭️ Implement advanced patterns
- ⏭️ Write tests
- ⏭️ Optimize bundle size

---

## 📞 Getting Help

### When Stuck:

1. **Check Console:** Look for error messages
2. **Check Network Tab:** See API request/response
3. **Check Redux DevTools:** See state changes
4. **Read Type Definitions:** Understand data structure
5. **Check Swagger Docs:** Verify API endpoints
6. **Ask Backend Team:** For API-related issues
7. **Google Error Message:** Stack Overflow is your friend

### File a Bug Report:

```markdown
## Bug Description

User creation fails with validation error

## Steps to Reproduce

1. Click "Add New User"
2. Fill form with test@example.com
3. Click Submit

## Expected Behavior

User should be created

## Actual Behavior

Error: "Email already exists"

## Screenshots

[Attach screenshot]

## Console Errors

[Paste error from console]

## API Request

POST /api/v1/users/
{ login_id: "test", email: "test@example.com", ... }

## API Response

{ success: false, message: "Email already exists" }
```

---

## 🚀 Quick Reference Card

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Git workflow
git status
git add .
git commit -m "feat: description"
git push origin branch-name
```

### File Locations Quick Access

| What           | Where                                |
| -------------- | ------------------------------------ |
| Main user page | `src/pages/UserManagement/Users.tsx` |
| API calls      | `src/services/user.service.ts`       |
| Types          | `src/types/user.types.ts`            |
| State          | `src/store/userSlice.ts`             |
| Hook           | `src/hooks/useUsers.ts`              |
| Components     | `src/components/common/`             |

### Code Snippets

#### Create a new API endpoint

```typescript
// 1. Service
async newEndpoint(data: DataType): Promise<ResponseType> {
  return apiService.post<ResponseType>('/endpoint/', data);
}

// 2. Redux Thunk
export const newEndpointAsync = createAsyncThunk(
  'slice/newEndpoint',
  async (data: DataType, { rejectWithValue }) => {
    try {
      return await service.newEndpoint(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Hook
const callEndpoint = useCallback(async (data: DataType) => {
  const result = await dispatch(newEndpointAsync(data)).unwrap();
  return result;
}, [dispatch]);
```

#### Add a new field to form

```typescript
// 1. Type
interface FormData {
  existing_field: string;
  new_field: string; // Add this
}

// 2. Schema
const schema = z.object({
  existing_field: z.string(),
  new_field: z.string().min(3), // Add this
});

// 3. JSX
<Input
  label="New Field"
  {...register("new_field")}
  error={errors.new_field?.message}
/>;
```

---

## 🎉 Congratulations!

You now have a comprehensive understanding of:

- ✅ Frontend file structure
- ✅ Backend API integration
- ✅ How data flows through the app
- ✅ How to add new features
- ✅ Common tasks and troubleshooting

**Remember:** Programming is learned by doing. Start with small changes, test frequently, and don't be afraid to make mistakes!

---

## 📄 Appendix

### Environment Variables

```bash
# .env file
VITE_API_BASE_URL=https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1
```

### Project Scripts

```json
{
  "dev": "vite", // Start dev server
  "build": "tsc -b && vite build", // Build for production
  "lint": "eslint .", // Check code quality
  "preview": "vite preview" // Preview production build
}
```

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- Auto Rename Tag
- ES7+ React/Redux/React-Native snippets

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Maintained by:** Frontend Team

For questions or suggestions, please contact the development team.
