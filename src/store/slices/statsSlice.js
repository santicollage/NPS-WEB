import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async Thunks
export const fetchStatsSummary = createAsyncThunk(
  'stats/fetchSummary',
  async ({ from, to } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/stats/summary', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSalesData = createAsyncThunk(
  'stats/fetchSales',
  async ({ groupBy = 'day', from, to } = {}, { rejectWithValue }) => {
    try {
      const params = { groupBy };
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/stats/sales', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'stats/fetchTopProducts',
  async ({ limit = 5, from, to } = {}, { rejectWithValue }) => {
    try {
      const params = { limit };
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/stats/top-products', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  'stats/fetchCustomerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats/customers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConversionStats = createAsyncThunk(
  'stats/fetchConversionStats',
  async ({ from, to } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/stats/conversion', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPurchaseTimeStats = createAsyncThunk(
  'stats/fetchPurchaseTimeStats',
  async ({ from, to } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/stats/purchase-time', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  summary: null,
  sales: [],
  topProducts: [],
  customerStats: null,
  conversion: null,
  purchaseTime: null,
  loading: {
    summary: false,
    sales: false,
    topProducts: false,
    customerStats: false,
    conversion: false,
    purchaseTime: false,
  },
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchStatsSummary.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(fetchStatsSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(fetchStatsSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.payload;
      });

    // Sales Data
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.loading.sales = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading.sales = false;
        state.sales = action.payload;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading.sales = false;
        state.error = action.payload;
      });

    // Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading.topProducts = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading.topProducts = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading.topProducts = false;
        state.error = action.payload;
      });

    // Customer Stats
    builder
      .addCase(fetchCustomerStats.pending, (state) => {
        state.loading.customerStats = true;
        state.error = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.loading.customerStats = false;
        state.customerStats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.loading.customerStats = false;
        state.error = action.payload;
      });

    // Conversion Stats
    builder
      .addCase(fetchConversionStats.pending, (state) => {
        state.loading.conversion = true;
        state.error = null;
      })
      .addCase(fetchConversionStats.fulfilled, (state, action) => {
        state.loading.conversion = false;
        state.conversion = action.payload;
      })
      .addCase(fetchConversionStats.rejected, (state, action) => {
        state.loading.conversion = false;
        state.error = action.payload;
      });

    // Purchase Time Stats
    builder
      .addCase(fetchPurchaseTimeStats.pending, (state) => {
        state.loading.purchaseTime = true;
        state.error = null;
      })
      .addCase(fetchPurchaseTimeStats.fulfilled, (state, action) => {
        state.loading.purchaseTime = false;
        state.purchaseTime = action.payload;
      })
      .addCase(fetchPurchaseTimeStats.rejected, (state, action) => {
        state.loading.purchaseTime = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatsError } = statsSlice.actions;

export default statsSlice.reducer;
