import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import {
  selectCart as selectCartData,
  selectGuestCart as selectGuestCartData,
  selectIsCartModalOpen,
} from '../../store/slices/cartSelectors';
import {
  fetchCart,
  fetchGuestCart,
  updateCartItem,
  removeFromCart,
  updateGuestCartItem,
  removeFromGuestCart,
  closeCartModal,
} from '../../store/slices/cartSlice';
import './Cart.scss';
import LessIcon from '../../assets/icons/LessIcon';
import AddIcon from '../../assets/icons/AddIcon';
import RemoveIcon from '../../assets/icons/RemoveIcon';
import CloseIcon from '../../assets/icons/CloseIcon';
import CartIcon2 from '../../assets/icons/CartIcon2';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOpen = useSelector(selectIsCartModalOpen);
  const cart = useSelector(selectCartData);
  const guestCart = useSelector(selectGuestCartData);

  const currentCart = isAuthenticated ? cart : guestCart;
  const items = currentCart?.items || [];

  const formatPrice = (price) => {
    return price.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const debounceRef = useRef(null);
  const localQuantitiesRef = useRef({});
  const [localQuantities, setLocalQuantities] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  const updateLocalQuantity = (cartItemId, quantity) => {
    localQuantitiesRef.current[cartItemId] = quantity;
    setLocalQuantities((prev) => ({ ...prev, [cartItemId]: quantity }));
  };

  useEffect(() => {
    if (isOpen) {
      setLocalQuantities({});
      setEditingItemId(null);
      if (isAuthenticated) {
        dispatch(fetchCart());
      } else {
        const guestId = localStorage.getItem('guest_id');
        if (guestId) {
          dispatch(fetchGuestCart(guestId));
        }
      }
    }
  }, [isOpen, isAuthenticated, dispatch]);

  const handleUpdateQuantity = useCallback(
    async (cartItemId, newQuantity) => {
      if (newQuantity <= 0) return;

      const previousQuantity =
        items.find((item) => item.cart_item_id === cartItemId)?.quantity ?? 1;

      updateLocalQuantity(cartItemId, newQuantity);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        const quantity = localQuantitiesRef.current[cartItemId];
        if (quantity !== undefined) {
          try {
            if (isAuthenticated) {
              await dispatch(updateCartItem({ cartItemId, quantity })).unwrap();
            } else {
              await dispatch(
                updateGuestCartItem({
                  guestId: guestCart.guest_id,
                  cartItemId,
                  quantity,
                })
              ).unwrap();
            }
          } catch (error) {
            updateLocalQuantity(cartItemId, previousQuantity);
            alert(error.error.message || 'Error al actualizar cantidad');
          }
        }
      }, 1000);
    },
    [isAuthenticated, guestCart, dispatch, items]
  );

  const handleRemoveItem = (cartItemId) => {
    if (isAuthenticated) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(
        removeFromGuestCart({ guestId: guestCart.guest_id, cartItemId })
      );
    }
  };

  const handleStartEditing = (cartItemId) => {
    const currentQuantity =
      localQuantities[cartItemId] ??
      items.find((item) => item.cart_item_id === cartItemId)?.quantity ??
      1;
    setEditingItemId(cartItemId);
    setEditingQuantity(currentQuantity.toString());
  };

  const handleConfirmQuantity = async () => {
    const quantity = parseInt(editingQuantity, 10);
    if (quantity > 0) {
      const previousQuantity =
        items.find((item) => item.cart_item_id === editingItemId)?.quantity ??
        1;

      updateLocalQuantity(editingItemId, quantity);

      try {
        if (isAuthenticated) {
          await dispatch(
            updateCartItem({ cartItemId: editingItemId, quantity })
          ).unwrap();
        } else {
          await dispatch(
            updateGuestCartItem({
              guestId: guestCart.guest_id,
              cartItemId: editingItemId,
              quantity,
            })
          ).unwrap();
        }
      } catch (error) {
        updateLocalQuantity(editingItemId, previousQuantity);
        alert(error.error.message || 'Error al actualizar cantidad');
      }
    }
    setEditingItemId(null);
    setEditingQuantity('');
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (total, item) =>
        total +
        item.product.price *
          (localQuantities[item.cart_item_id] ?? item.quantity),
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + (parseFloat(currentCart?.shipping_cost) || 0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="cart-modal-overlay"
      onClick={() => dispatch(closeCartModal())}
    >
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <CartIcon2 />
          <button
            className="close-button"
            onClick={() => dispatch(closeCartModal())}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="cart-content">
          {items.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.cart_item_id} className="cart-item">
                    <img
                      src={item.product.images?.[0] || ''}
                      alt={item.product.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <div className="item-container">
                        <h3 
                          onClick={() => {
                            dispatch(closeCartModal());
                            navigate(`/products/${item.product.product_id}`, { state: { backgroundLocation: location } });
                          }}
                        >
                          {item.product.name}
                        </h3>
                        {item.product.reference && (
                          <p className="item-reference">Ref: {item.product.reference}</p>
                        )}
                      </div>
                      <div className="item-container">
                        <p className="item-price">
                          $
                          {formatPrice(
                            item.product.price *
                              (localQuantities[item.cart_item_id] ??
                                item.quantity)
                          )}
                        </p>
                        <div className="quantity-controls">
                          <button
                            className="res-button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cart_item_id,
                                (localQuantities[item.cart_item_id] ??
                                  item.quantity) - 1
                              )
                            }
                            disabled={
                              (localQuantities[item.cart_item_id] ??
                                item.quantity) <= 1
                            }
                          >
                            <LessIcon />
                          </button>
                          {editingItemId === item.cart_item_id ? (
                            <input
                              type="number"
                              value={editingQuantity}
                              onChange={(e) =>
                                setEditingQuantity(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleConfirmQuantity();
                                }
                              }}
                              onBlur={handleConfirmQuantity}
                              autoFocus
                              min="1"
                            />
                          ) : (
                            <span
                              onClick={() =>
                                handleStartEditing(item.cart_item_id)
                              }
                            >
                              {localQuantities[item.cart_item_id] ??
                                item.quantity}
                            </span>
                          )}
                          <button
                            className="add-button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.cart_item_id,
                                (localQuantities[item.cart_item_id] ??
                                  item.quantity) + 1
                              )
                            }
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.cart_item_id)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="total">
                  <span className="subtotal">
                    Subtotal: ${formatPrice(calculateSubtotal())}
                  </span>
                  {(parseFloat(currentCart?.shipping_cost) || 0) > 0 && (
                    <span className="shipping-cost">
                      Envío: ${formatPrice(parseFloat(currentCart.shipping_cost))}
                    </span>
                  )}
                  <strong>Total: ${formatPrice(calculateTotal())}</strong>
                </div>
                <button className="checkout-button">Pagar ahora</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
