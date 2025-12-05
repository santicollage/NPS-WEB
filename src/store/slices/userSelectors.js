export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsAdmin = (state) => state.user.isAdmin;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;

// Users list selectors for admin management
export const selectUsersList = (state) => state.user.usersList;
export const selectUsersTotal = (state) => state.user.usersTotal;
export const selectUsersLoading = (state) => state.user.usersLoading;
export const selectUsersError = (state) => state.user.usersError;
