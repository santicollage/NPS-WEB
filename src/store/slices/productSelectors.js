export const selectProducts = (state) => state.products.items.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsError = (state) => state.products.error;
export const selectProductsSuccess = (state) => state.products.success;
export const selectProductsFilters = (state) => state.products.filters;
export const selectProductsPagination = (state) => state.products.pagination;
