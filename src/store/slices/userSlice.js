import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ==============================
// 1️⃣ THUNKS (async actions)
// ==============================

// POST - Register a new user
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem('guest_id');
      const payload = guestId ? { ...userData, guest_id: guestId } : userData;
      const { data } = await api.post('/users', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error registering user');
    }
  }
);

// POST - Login with email and password
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem('guest_id');
      const payload = guestId ? { ...credentials, guest_id: guestId } : credentials;
      const { data } = await api.post('/auth/login', payload);
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error logging in');
    }
  }
);

// POST - Login with Google OAuth
export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (tokenData, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem('guest_id');
      const payload = guestId ? { ...tokenData, guest_id: guestId } : tokenData;
      const { data } = await api.post('/auth/google', payload);
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error logging in with Google'
      );
    }
  }
);

// GET - Get authenticated user data
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching user data');
    }
  }
);

// GET - Get specific user details
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching user');
    }
  }
);

// PATCH - Update user information
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/users/${userId}`, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error updating user');
    }
  }
);

// DELETE - Delete user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error deleting user');
    }
  }
);

// POST - Refresh session
export const refreshSession = createAsyncThunk(
  'user/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/refresh');
      // Save new token to localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error refreshing session');
    }
  }
);

// POST - Logout
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout', {});
      localStorage.removeItem('token');
      return null;
    } catch (err) {
      // Even if logout fails, remove token
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data || 'Error logging out');
    }
  }
);

// PUT - Change password
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ userId, passwordData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/auth/change-password', passwordData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error changing password');
    }
  }
);

// GET - Fetch all users (admin only)
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async ({ page = 1, limit = 20, search = '', role = '' }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (role) params.role = role;
      
      const { data } = await api.get('/users', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching users');
    }
  }
);

// PUT - Update user role (admin only)
export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/role`, { role });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error updating user role');
    }
  }
);

// POST - Forgot password (request email)
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error requesting password reset');
    }
  }
);

// POST - Reset password (with token)
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/reset-password', { token, newPassword });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error resetting password');
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    isAdmin: false,

    // Users list for admin management
    usersList: [],
    usersTotal: 0,
    usersLoading: false,
    usersError: null,

    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      state.error = null;
      state.success = null;
      localStorage.removeItem('token');
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {

        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {

        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin';
        state.success = 'User registered successfully';
      })
      .addCase(registerUser.rejected, (state, action) => {

        state.error = action.payload;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {

        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {

        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === 'admin';
        state.success = 'Login successful';
      })
      .addCase(loginUser.rejected, (state, action) => {

        state.error = action.payload;
      });

    // GOOGLE LOGIN
    builder
      .addCase(loginWithGoogle.pending, (state) => {

        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {

        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === 'admin';
        state.success = 'Google login successful';
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {

        state.error = action.payload;
      });

    // FETCH CURRENT USER
    builder
      .addCase(fetchCurrentUser.pending, (state) => {

        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {

        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {

        state.error = action.payload;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.currentUser = null;
      });

    // FETCH USER BY ID
    builder
      .addCase(fetchUserById.pending, (state) => {

        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state) => {

        // Assuming this is for admin purposes, not updating currentUser
        state.success = 'User fetched successfully';
      })
      .addCase(fetchUserById.rejected, (state, action) => {

        state.error = action.payload;
      });

    // UPDATE USER
    builder
      .addCase(updateUser.pending, (state) => {

        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {

        state.currentUser = action.payload;
        state.isAdmin = action.payload.role === 'admin';
        state.success = 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {

        state.error = action.payload;
      });

    // DELETE USER
    builder
      .addCase(deleteUser.pending, (state) => {

        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {

        state.currentUser = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.success = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {

        state.error = action.payload;
      });

    // REFRESH SESSION
    builder
      .addCase(refreshSession.pending, (state) => {

        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state) => {

        state.success = 'Session refreshed successfully';
      })
      .addCase(refreshSession.rejected, (state) => {

        state.error = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {

        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {

        state.currentUser = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.success = 'Logged out successfully';
      })
      .addCase(logoutUser.rejected, (state, action) => {

        state.error = action.payload;
        // Still logout even if server fails
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
      });

    // CHANGE PASSWORD
    builder
      .addCase(changePassword.pending, (state) => {
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.success = 'Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      });

    // FETCH ALL USERS
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.usersList = action.payload.users;
        state.usersTotal = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      });

    // UPDATE USER ROLE
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.success = 'User role updated successfully';
        // Update the user in the list if it exists
        const index = state.usersList.findIndex(
          (user) => user.user_id === action.payload.user_id
        );
        if (index !== -1) {
          state.usersList[index] = action.payload;
        }
        if (index !== -1) {
          state.usersList[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
      });

    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.success = action.payload.message || 'Password reset email sent';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.success = action.payload.message || 'Password reset successfully';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearStatus, setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
