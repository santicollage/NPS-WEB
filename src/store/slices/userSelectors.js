export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsAdmin = (state) => state.user.isAdmin;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;
