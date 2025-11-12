import React from 'react';
import './ProductCard.scss';
import ContactIcon from '../../assets/icons/ContactIcon';
import CartIcon from '../../assets/icons/CartIcon';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
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
        >
          {product.stock_quantity === 0 ? '' : <CartIcon />}
          {product.stock_quantity === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
