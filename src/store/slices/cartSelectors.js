import { selectIsAuthenticated } from './userSelectors';

export const selectCart = (state) => state.cart.cart;
export const selectGuestCart = (state) => state.cart.guestCart;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccess = (state) => state.cart.success;
export const selectIsCartModalOpen = (state) => state.cart.isCartModalOpen;

export const selectTotalItems = (state) => {
  const isAuthenticated = selectIsAuthenticated(state);
  const cart = isAuthenticated ? selectCart(state) : selectGuestCart(state);
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total) => total + 1, 0);
};
