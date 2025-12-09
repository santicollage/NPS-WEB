export const selectProducts = (state) => {
  const items = state.products?.items;
  return Array.isArray(items) ? items : [];
};
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsError = (state) => state.products.error;
export const selectProductsSuccess = (state) => state.products.success;
export const selectProductsFilters = (state) => state.products.filters;
export const selectProductsPagination = (state) => state.products.pagination;
