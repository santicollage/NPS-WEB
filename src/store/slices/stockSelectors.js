export const selectStockMovements = (state) => state.stock.movements;
export const selectActiveReservations = (state) =>
  state.stock.activeReservations;
export const selectCleanupResult = (state) => state.stock.cleanupResult;
export const selectStockLoading = (state) => state.stock.loading;
export const selectStockError = (state) => state.stock.error;
export const selectStockSuccess = (state) => state.stock.success;
export const selectStockPagination = (state) => state.stock.pagination;
