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
import ProductCard from '../ProductCard';
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
          <ProductCard key={product.product_id} product={product} />
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
