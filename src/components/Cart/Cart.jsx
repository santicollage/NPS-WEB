import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import {
  selectCart as selectCartData,
  selectGuestCart as selectGuestCartData,
  selectIsCartModalOpen,
} from '../../store/slices/cartSelectors';
import {
  updateCartItem,
  removeFromCart,
  updateGuestCartItem,
  removeFromGuestCart,
  closeCartModal,
} from '../../store/slices/cartSlice';
import './Cart.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOpen = useSelector(selectIsCartModalOpen);
  const cart = useSelector(selectCartData);
  const guestCart = useSelector(selectGuestCartData);

  const currentCart = isAuthenticated ? cart : guestCart;
  const items = currentCart?.items || [];

  const handleUpdateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) return;
    if (isAuthenticated) {
      dispatch(updateCartItem({ cartItemId, quantity }));
    } else {
      dispatch(
        updateGuestCartItem({
          guestId: guestCart.guest_id,
          cartItemId,
          quantity,
        })
      );
    }
  };

  const handleRemoveItem = (cartItemId) => {
    if (isAuthenticated) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(
        removeFromGuestCart({ guestId: guestCart.guest_id, cartItemId })
      );
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
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
          <button
            className="close-button"
            onClick={() => dispatch(closeCartModal())}
          >
            ×
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
                      src={item.image_url}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_item_id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_item_id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.cart_item_id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="total">
                  <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                </div>
                <button className="checkout-button">Proceder al Pago</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
