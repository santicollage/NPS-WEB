import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// GET - Obtener todos los productos con filtros
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const url = `${BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const { data } = await axios.get(url);
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
      const { data } = await axios.get(`${BASE_URL}/products/${productId}`);
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
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${BASE_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = localStorage.getItem('token');
      const { data } = await axios.patch(
        `${BASE_URL}/products/${productId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al eliminar producto'
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
    loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Assuming the API returns pagination info in the response
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.totalPages = Math.ceil(
            action.payload.total / state.filters.limit
          );
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH PRODUCT BY ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE PRODUCT
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = 'Producto creado con éxito';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE PRODUCT
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE PRODUCT
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (p) => p.product_id !== action.payload
        );
        if (state.currentProduct?.product_id === action.payload) {
          state.currentProduct = null;
        }
        state.success = 'Producto eliminado con éxito';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
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
