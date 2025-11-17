import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// POST - Crear orden desde carrito (usuario autenticado)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders`, orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al crear orden');
    }
  }
);

// GET - Listar órdenes del usuario
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
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

      const url = `/orders${queryParams ? `?${queryParams}` : ''}`;
      const { data } = await api.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al cargar órdenes');
    }
  }
);

// GET - Obtener detalle de una orden
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al cargar orden');
    }
  }
);

// PATCH - Actualizar estado de orden (admin)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar estado de orden'
      );
    }
  }
);

// ==============================
// GUEST ORDER THUNKS
// ==============================

// POST - Crear orden de invitado desde carrito
export const createGuestOrder = createAsyncThunk(
  'orders/createGuestOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/guest`, orderData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al crear orden de invitado'
      );
    }
  }
);

// GET - Obtener detalle de orden de invitado
export const fetchGuestOrder = createAsyncThunk(
  'orders/fetchGuestOrder',
  async (orderToken, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/guest/${orderToken}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al cargar orden de invitado'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    guestOrder: null,
    loading: false,
    error: null,
    success: null,
    filters: {
      status: null,
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
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearGuestOrder: (state) => {
      state.guestOrder = null;
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // CREATE ORDER
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = 'Orden creada con éxito';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH ORDERS
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        // Assuming the API returns pagination info
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.totalPages = Math.ceil(
            action.payload.total / state.filters.limit
          );
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH ORDER BY ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE ORDER STATUS
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = 'Estado de orden actualizado';
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE GUEST ORDER
    builder
      .addCase(createGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.guestOrder = action.payload;
        state.success = 'Orden de invitado creada con éxito';
      })
      .addCase(createGuestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH GUEST ORDER
    builder
      .addCase(fetchGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.guestOrder = action.payload;
      })
      .addCase(fetchGuestOrder.rejected, (state, action) => {
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
  clearCurrentOrder,
  clearGuestOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
