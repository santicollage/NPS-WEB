import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ProductCard.scss';
import ContactIcon from '../../assets/icons/ContactIcon';
import CartIcon from '../../assets/icons/CartIcon';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import { selectGuestCart } from '../../store/slices/cartSelectors';
import {
  addToCart,
  addToGuestCart,
  createGuestCart,
  openCartModal,
} from '../../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const guestCart = useSelector(selectGuestCart);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getOrCreateGuestId = () => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  const handleAddToCart = async () => {
    if (isAuthenticated) {
      await dispatch(
        addToCart({ product_id: product.product_id, quantity: 1 })
      );
    } else {
      const guestId = getOrCreateGuestId();
      if (!guestCart) {
        await dispatch(createGuestCart(guestId));
      }
      await dispatch(
        addToGuestCart({
          guestId,
          itemData: { product_id: product.product_id, quantity: 1 },
        })
      );
    }
    dispatch(openCartModal());
  };

  const handleContactClick = () => {
    const phoneNumber = '573229713519';
    const message = `Hola, estoy interesado en más información sobre el producto ${product.name} = ${product.reference}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="no-image">
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          {product.reference && (
            <span className="product-reference">Ref: {product.reference}</span>
          )}
        </div>
        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.stock_quantity !== undefined && (
            <span
              className={`product-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}
            >
              {product.stock_quantity > 0
                ? `Stock: ${product.stock_quantity}`
                : 'Agotado'}
            </span>
          )}
        </div>

        <div className="product-category">
          <span>{product.category_name || 'Sin categoría'}</span>
        </div>
      </div>

      <div className="product-actions">
        <div className="action-buttons-row">
          <button className="btn-secondary">Ver Detalles</button>
          <button
            className="contact-btn btn-quartertiary"
            onClick={handleContactClick}
          >
            <ContactIcon />
            Consultar
          </button>
        </div>
        <button
          className="btn-tertiary"
          disabled={product.stock_quantity === 0}
          onClick={handleAddToCart}
        >
          {product.stock_quantity === 0 ? '' : <CartIcon />}
          {product.stock_quantity === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
