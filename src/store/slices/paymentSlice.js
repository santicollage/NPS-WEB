import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// POST - Crear transacción de pago en Wompi
export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/payments/create`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al crear pago');
    }
  }
);

// GET - Verificar estado de pago de una orden
export const checkPaymentStatus = createAsyncThunk(
  'payments/checkPaymentStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/payments/${orderId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al verificar estado de pago'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    currentPayment: null,
    paymentStatus: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentStatus = null;
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // CREATE PAYMENT
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.success = 'Pago creado con éxito';
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CHECK PAYMENT STATUS
    builder
      .addCase(checkPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { clearStatus, clearCurrentPayment, clearPaymentStatus } =
  paymentSlice.actions;
export default paymentSlice.reducer;
