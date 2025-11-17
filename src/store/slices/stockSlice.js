import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// GET - Obtener movimientos de stock
export const fetchStockMovements = createAsyncThunk(
  'stock/fetchStockMovements',
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

      const url = `/stock/movements${queryParams ? `?${queryParams}` : ''}`;
      const { data } = await api.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al cargar movimientos de stock'
      );
    }
  }
);

// POST - Crear movimiento de stock manual
export const createStockMovement = createAsyncThunk(
  'stock/createStockMovement',
  async (movementData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/stock/movements`, movementData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al crear movimiento de stock'
      );
    }
  }
);

// POST - Limpiar reservas expiradas
export const cleanupExpiredReservations = createAsyncThunk(
  'stock/cleanupExpiredReservations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/stock/cleanup`, {});
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al limpiar reservas expiradas'
      );
    }
  }
);

// GET - Listar reservas activas
export const fetchActiveReservations = createAsyncThunk(
  'stock/fetchActiveReservations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/stock/reservations`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al cargar reservas activas'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    movements: [],
    activeReservations: [],
    cleanupResult: null,
    loading: false,
    error: null,
    success: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
      state.cleanupResult = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // FETCH STOCK MOVEMENTS
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload;
        // Assuming the API returns pagination info
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.totalPages = Math.ceil(
            action.payload.total / state.pagination.limit
          );
        }
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE STOCK MOVEMENT
    builder
      .addCase(createStockMovement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStockMovement.fulfilled, (state, action) => {
        state.loading = false;
        state.movements.unshift(action.payload); // Add to beginning of array
        state.success = 'Movimiento de stock creado con éxito';
      })
      .addCase(createStockMovement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CLEANUP EXPIRED RESERVATIONS
    builder
      .addCase(cleanupExpiredReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanupExpiredReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.cleanupResult = action.payload;
        state.success = 'Limpieza de reservas completada';
      })
      .addCase(cleanupExpiredReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH ACTIVE RESERVATIONS
    builder
      .addCase(fetchActiveReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.activeReservations = action.payload;
      })
      .addCase(fetchActiveReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { clearStatus, setPagination } = stockSlice.actions;
export default stockSlice.reducer;
