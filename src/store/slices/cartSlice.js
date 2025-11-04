import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// ==============================
// 1️⃣ THUNKS (acciones asincrónicas)
// ==============================

// GET - Obtener carrito activo del usuario
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error al cargar carrito');
    }
  }
);

// POST - Agregar producto al carrito
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${BASE_URL}/cart/items`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al agregar producto al carrito'
      );
    }
  }
);

// PATCH - Actualizar cantidad de item en carrito
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.patch(
        `${BASE_URL}/cart/items/${cartItemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar item del carrito'
      );
    }
  }
);

// DELETE - Remover item del carrito
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/cart/items/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return cartItemId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al remover item del carrito'
      );
    }
  }
);

// POST - Abandonar carrito
export const abandonCart = createAsyncThunk(
  'cart/abandonCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/cart/abandon`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al abandonar carrito'
      );
    }
  }
);

// ==============================
// GUEST CART THUNKS
// ==============================

// POST - Crear carrito de invitado
export const createGuestCart = createAsyncThunk(
  'cart/createGuestCart',
  async (guestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/cart/guest`, {
        guest_id: guestId,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al crear carrito de invitado'
      );
    }
  }
);

// GET - Obtener carrito de invitado
export const fetchGuestCart = createAsyncThunk(
  'cart/fetchGuestCart',
  async (guestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/cart/guest/${guestId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al cargar carrito de invitado'
      );
    }
  }
);

// POST - Agregar producto al carrito de invitado
export const addToGuestCart = createAsyncThunk(
  'cart/addToGuestCart',
  async ({ guestId, itemData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/cart/guest/${guestId}/items`,
        itemData
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al agregar producto al carrito de invitado'
      );
    }
  }
);

// PATCH - Actualizar cantidad de item en carrito de invitado
export const updateGuestCartItem = createAsyncThunk(
  'cart/updateGuestCartItem',
  async ({ guestId, cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/cart/guest/${guestId}/items/${cartItemId}`,
        { quantity }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al actualizar item del carrito de invitado'
      );
    }
  }
);

// DELETE - Remover item del carrito de invitado
export const removeFromGuestCart = createAsyncThunk(
  'cart/removeFromGuestCart',
  async ({ guestId, cartItemId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/cart/guest/${guestId}/items/${cartItemId}`
      );
      return cartItemId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al remover item del carrito de invitado'
      );
    }
  }
);

// POST - Abandonar carrito de invitado
export const abandonGuestCart = createAsyncThunk(
  'cart/abandonGuestCart',
  async (guestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/cart/guest/${guestId}/abandon`,
        {}
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Error al abandonar carrito de invitado'
      );
    }
  }
);

// ==============================
// 2️⃣ SLICE
// ==============================
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    guestCart: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    clearCart: (state) => {
      state.cart = null;
      state.guestCart = null;
    },
    setGuestId: (state, action) => {
      if (state.guestCart) {
        state.guestCart.guest_id = action.payload;
      }
    },
  },

  // ==============================
  // 3️⃣ EXTRA REDUCERS
  // ==============================
  extraReducers: (builder) => {
    // FETCH CART
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ADD TO CART
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          const existingItem = state.cart.items.find(
            (item) => item.cart_item_id === action.payload.cart_item_id
          );
          if (existingItem) {
            Object.assign(existingItem, action.payload);
          } else {
            state.cart.items.push(action.payload);
          }
        }
        state.success = 'Producto agregado al carrito';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE CART ITEM
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          const index = state.cart.items.findIndex(
            (item) => item.cart_item_id === action.payload.cart_item_id
          );
          if (index !== -1) {
            state.cart.items[index] = action.payload;
          }
        }
        state.success = 'Cantidad actualizada';
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REMOVE FROM CART
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          state.cart.items = state.cart.items.filter(
            (item) => item.cart_item_id !== action.payload
          );
        }
        state.success = 'Producto removido del carrito';
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ABANDON CART
    builder
      .addCase(abandonCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(abandonCart.fulfilled, (state) => {
        state.loading = false;
        if (state.cart) {
          state.cart.status = 'abandoned';
        }
        state.success = 'Carrito abandonado';
      })
      .addCase(abandonCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE GUEST CART
    builder
      .addCase(createGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.guestCart = action.payload.cart;
        state.success = 'Carrito de invitado creado';
      })
      .addCase(createGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH GUEST CART
    builder
      .addCase(fetchGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.guestCart = action.payload;
      })
      .addCase(fetchGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ADD TO GUEST CART
    builder
      .addCase(addToGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.guestCart) {
          const existingItem = state.guestCart.items.find(
            (item) => item.cart_item_id === action.payload.cart_item_id
          );
          if (existingItem) {
            Object.assign(existingItem, action.payload);
          } else {
            state.guestCart.items.push(action.payload);
          }
        }
        state.success = 'Producto agregado al carrito de invitado';
      })
      .addCase(addToGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE GUEST CART ITEM
    builder
      .addCase(updateGuestCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGuestCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.guestCart) {
          const index = state.guestCart.items.findIndex(
            (item) => item.cart_item_id === action.payload.cart_item_id
          );
          if (index !== -1) {
            state.guestCart.items[index] = action.payload;
          }
        }
        state.success = 'Cantidad actualizada en carrito de invitado';
      })
      .addCase(updateGuestCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REMOVE FROM GUEST CART
    builder
      .addCase(removeFromGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.guestCart) {
          state.guestCart.items = state.guestCart.items.filter(
            (item) => item.cart_item_id !== action.payload
          );
        }
        state.success = 'Producto removido del carrito de invitado';
      })
      .addCase(removeFromGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ABANDON GUEST CART
    builder
      .addCase(abandonGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(abandonGuestCart.fulfilled, (state) => {
        state.loading = false;
        if (state.guestCart) {
          state.guestCart.status = 'abandoned';
        }
        state.success = 'Carrito de invitado abandonado';
      })
      .addCase(abandonGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { clearStatus, clearCart, setGuestId } = cartSlice.actions;
export default cartSlice.reducer;
