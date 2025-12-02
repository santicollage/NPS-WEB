import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../store/slices/productSlice';
import {
  selectCurrentProduct,
  selectProductsError,
} from '../../store/slices/productSelectors';
import {
  addToCart,
  addToGuestCart,
  createGuestCart,
  openCartModal,
} from '../../store/slices/cartSlice';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import { selectGuestCart } from '../../store/slices/cartSelectors';
import { selectIsAdmin } from '../../store/slices/userSelectors';
import './ProductDetail.scss';
import CloseIcon from '../../assets/icons/CloseIcon';
import LessIcon from '../../assets/icons/LessIcon';
import AddIcon from '../../assets/icons/AddIcon';
import CartIcon from '../../assets/icons/CartIcon';

import SEO from '../../components/SEO/SEO';

const ProductDetail = ({ modal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const product = useSelector(selectCurrentProduct);
  const error = useSelector(selectProductsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const guestCart = useSelector(selectGuestCart);
  const isAdmin = useSelector(selectIsAdmin);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleClose = () => {
    if (modal) {
      navigate(-1);
    } else {
      navigate('/products');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const getOrCreateGuestId = () => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  const handleAddToCart = async (openCart = true) => {
    if (!product) return;

    if (isAuthenticated) {
      await dispatch(addToCart({ product_id: product.product_id, quantity }));
    } else {
      const guestId = getOrCreateGuestId();
      if (!guestCart) {
        await dispatch(createGuestCart(guestId));
      }
      await dispatch(
        addToGuestCart({
          guestId,
          itemData: { product_id: product.product_id, quantity },
        })
      );
    }

    if (openCart) {
      handleClose(); // Close the product detail modal
      dispatch(openCartModal());
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart(false);
    handleClose();
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (error) {
    return (
      <div className={`product-detail-container ${modal ? 'modal-mode' : ''}`}>
        <div className="product-detail-content error">
          <p>{error}</p>
          <button onClick={handleClose} className="close-btn">
            <CloseIcon />
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`product-detail-container ${modal ? 'modal-mode' : ''}`}>
        <div className="product-detail-content loading">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const structuredData = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.product_id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "COP",
      "price": product.price,
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

  return (
    <div
      className={`product-detail-container ${modal ? 'modal-mode' : ''}`}
      onClick={handleClose}
    >
      <SEO
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.categories?.map(c => c.name).join(', ')}, comprar ${product.name}, repuestos ${product.reference}`}
        image={product.images && product.images.length > 0 ? product.images[0] : null}
        url={window.location.pathname}
        structuredData={structuredData}
      />
      <div
        className="product-detail-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={handleClose}>
          <CloseIcon />
        </button>

        <div className="scrollable-content">
          <div className="product-detail-header">
            <h2>{product.name}</h2>
          </div>

          <div className="product-detail-body">
            <div className="product-image-section">
              <div className="main-image">
                {selectedImage ? (
                  <img src={selectedImage} alt={product.name} />
                ) : (
                  <div className="no-image">Sin Imagen</div>
                )}
              </div>
              {product.images && product.images.length > 0 && (
                <div className="thumbnails">
                  {product.images.map((url, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImage === url ? 'active' : ''}`}
                      onClick={() => setSelectedImage(url)}
                    >
                      <img src={url} alt={`${product.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info-section">
              <p className="description">{product.description}</p>

              <div className="info-row">
                <span className="label">Estado</span>
                <span className="value">
                  {product.stock_quantity > 0
                    ? `Pocas unidades (${product.stock_quantity} und. disponibles)`
                    : 'Agotado'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Referencia</span>
                <span className="value">{product.reference || 'N/A'}</span>
              </div>

              <div className="info-row">
                <span className="label">Categoria</span>
                <div className="value categories-container">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((c) => (
                      <span key={c.category_id} className="category-tag">
                        {c.name}
                      </span>
                    ))
                  ) : (
                    <span className="category-tag">General</span>
                  )}
                </div>
              </div>

              <div className="group-row">
                <div className="quantity-selector">
                  <span className="label">Cantidad</span>
                  <div className="controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <LessIcon />
                    </button>
                    <span className="qty">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <AddIcon />
                    </button>
                  </div>
                </div>
                <span className="price">{formatPrice(product.price)}</span>
              </div>

              <div className="actions-section">
                <div className="buttons">
                  <button
                    className="btn-primary buy-now"
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity === 0 || isAdmin}
                  >
                    Comprar ahora
                  </button>
                  <button
                    className="btn-secondary add-cart"
                    onClick={() => handleAddToCart(true)}
                    disabled={product.stock_quantity === 0 || isAdmin}
                  >
                    Añadir <CartIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
