import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// GET - Obtener todos los productos con filtros
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = Object.entries(params)
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => {
          const encodedValue =
            typeof value === 'string' ? encodeURIComponent(value) : value;
          return `${key}=${encodedValue}`;
        })
        .join('&');

      const url = `/products${queryParams ? `?${queryParams}` : ''}`;
      const { data } = await api.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al cargar productos');
    }
  }
);

// GET - Obtener detalle de un producto
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al cargar producto');
    }
  }
);

// POST - Crear un nuevo producto (admin)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al crear producto');
    }
  }
);

// PATCH - Actualizar un producto (admin)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/products/${productId}`, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar producto'
      );
    }
  }
);

// DELETE - Eliminar un producto (admin)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al eliminar producto'
      );
    }
  }
);

// DELETE - Bulk Delete Products (admin)
export const bulkDeleteProducts = createAsyncThunk(
  'products/bulkDeleteProducts',
  async (productIds, { rejectWithValue }) => {
    try {
      await api.delete('/products/bulk', { data: { product_ids: productIds } });
      return productIds;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al eliminar productos masivamente'
      );
    }
  }
);

// PATCH - Bulk Update Visibility (admin)
export const bulkUpdateVisibility = createAsyncThunk(
  'products/bulkUpdateVisibility',
  async ({ productIds, visible }, { rejectWithValue }) => {
    try {
      await api.patch('/products/bulk/visibility', {
        product_ids: productIds,
        visible,
      });
      return { productIds, visible };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar visibilidad masivamente'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,

    error: null,
    success: null,
    filters: {
      category_id: null,
      name: '',
      min_price: null,
      max_price: null,
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
      limit: 20,
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
      state.filters.page = action.payload.page || state.filters.page;
      state.filters.limit = action.payload.limit || state.filters.limit;
    },
    clearFilters: (state) => {
      state.filters = {
        category_id: null,
        name: '',
        min_price: null,
        max_price: null,
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        limit: 20,
      };
      state.pagination.page = 1;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // FETCH PRODUCTS
    builder
      .addCase(fetchProducts.pending, (state) => {

        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Handle both array response and object response with products key
        const products = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload.products || [];
          
        state.items = products;
        
        // Assuming the API returns pagination info in the response
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.totalPages = Math.ceil(
            action.payload.total / state.filters.limit
          );
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
      });

    // FETCH PRODUCT BY ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload;
      });

    // CREATE PRODUCT
    builder
      .addCase(createProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.success = 'Producto creado con éxito';
      })
      .addCase(createProduct.rejected, (state, action) => {

        state.error = action.payload;
      });

    // UPDATE PRODUCT
    builder
      .addCase(updateProduct.pending, (state) => {

        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {

        const index = state.items.findIndex(
          (p) => p.product_id === action.payload.product_id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?.product_id === action.payload.product_id) {
          state.currentProduct = action.payload;
        }
        state.success = 'Producto actualizado con éxito';
      })
      .addCase(updateProduct.rejected, (state, action) => {

        state.error = action.payload;
      });

    // DELETE PRODUCT
    builder
      .addCase(deleteProduct.pending, (state) => {

        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {

        state.items = state.items.filter(
          (p) => p.product_id !== action.payload
        );
        if (state.currentProduct?.product_id === action.payload) {
          state.currentProduct = null;
        }
        state.success = 'Producto eliminado con éxito';
      })
      .addCase(deleteProduct.rejected, (state, action) => {

        state.error = action.payload;
      })

      // BULK DELETE PRODUCTS
      .addCase(bulkDeleteProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => !action.payload.includes(p.product_id)
        );
        state.success = 'Productos eliminados con éxito';
      })
      .addCase(bulkDeleteProducts.rejected, (state, action) => {
        state.error = action.payload;
      })

      // BULK UPDATE VISIBILITY
      .addCase(bulkUpdateVisibility.pending, (state) => {
        state.error = null;
      })
      .addCase(bulkUpdateVisibility.fulfilled, (state, action) => {
        const { productIds, visible } = action.payload;
        state.items = state.items.map((p) =>
          productIds.includes(p.product_id) ? { ...p, visible } : p
        );
        state.success = 'Visibilidad actualizada con éxito';
      })
      .addCase(bulkUpdateVisibility.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const {
  clearStatus,
  setFilters,
  setPagination,
  clearFilters,
  clearCurrentProduct,
} = productSlice.actions;
export default productSlice.reducer;
