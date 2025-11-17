import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// GET - Listar todas las categorías
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/categories');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al cargar categorías'
      );
    }
  }
);

// POST - Crear nueva categoría (admin)
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/categories', categoryData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al crear categoría');
    }
  }
);

// PATCH - Actualizar categoría (admin)
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/categories/${categoryId}`, updateData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar categoría'
      );
    }
  }
);

// DELETE - Eliminar categoría (admin)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al eliminar categoría'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // FETCH CATEGORIES
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE CATEGORY
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = 'Categoría creada con éxito';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE CATEGORY
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (cat) => cat.category_id === action.payload.category_id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = 'Categoría actualizada con éxito';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE CATEGORY
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (cat) => cat.category_id !== action.payload
        );
        state.success = 'Categoría eliminada con éxito';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { clearStatus } = categorySlice.actions;
export default categorySlice.reducer;
