export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectGuestOrder = (state) => state.orders.guestOrder;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersSuccess = (state) => state.orders.success;
export const selectOrdersFilters = (state) => state.orders.filters;
export const selectOrdersPagination = (state) => state.orders.pagination;
