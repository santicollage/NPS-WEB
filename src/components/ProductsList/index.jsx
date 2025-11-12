import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsFilters,
  selectProductsPagination,
} from '../../store/slices/productSelectors';
import { fetchProducts, setPagination } from '../../store/slices/productSlice';
import './ProductsList.scss';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectProductsFilters);
  const pagination = useSelector(selectProductsPagination);

  console.log(products);
  console.log(filters);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === 'object'
        ? error.message || error.statusText || JSON.stringify(error)
        : error;

    return (
      <div className="product-list">
        <div className="error">
          <h3>Error al cargar productos</h3>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="product-list">
        <div className="no-products">
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="products-grid">
        {products?.map((product) => (
          <div key={product.product_id} className="product-card">
            <div className="product-image">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                />
              ) : (
                <div className="no-image">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <div className="product-details">
                <span className="product-price">
                  {formatPrice(product.price)}
                </span>
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
              <button className="view-details-btn">Ver Detalles</button>
              <button
                className="add-to-cart-btn"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0
                  ? 'Agotado'
                  : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            Anterior
          </button>

          <span className="pagination-info">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
