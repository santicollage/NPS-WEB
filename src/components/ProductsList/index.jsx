import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProducts,
  selectProductsError,
  selectProductsFilters,
  selectProductsPagination,
} from '../../store/slices/productSelectors';
import { selectIsAdmin } from '../../store/slices/userSelectors';
import {
  fetchProducts,
  setPagination,
  bulkDeleteProducts,
  bulkUpdateVisibility,
} from '../../store/slices/productSlice';
import ProductCard from '../ProductCard';
import ProductFormModal from '../ProductFormModal';
import './ProductsList.scss';
import RemoveIcon from '../../assets/icons/RemoveIcon';
import EyeIcon from '../../assets/icons/EyeIcon';
import EyeOffIcon from '../../assets/icons/EyeOffIcon';
import AddProductIcon from '../../assets/icons/AddProductIcon';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectProductsFilters);
  const pagination = useSelector(selectProductsPagination);
  const isAdmin = useSelector(selectIsAdmin);

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters, isAdmin]);

  // Clear selection when filters or page changes
  useEffect(() => {
    setSelectedProductIds([]);
  }, [filters, pagination.page]);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = products.map((p) => p.product_id);
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar ${selectedProductIds.length} productos?`
      )
    ) {
      await dispatch(bulkDeleteProducts(selectedProductIds));
      setSelectedProductIds([]);
      dispatch(fetchProducts(filters)); // Refresh list
    }
  };

  const handleBulkVisibility = async (visible) => {
    await dispatch(
      bulkUpdateVisibility({ productIds: selectedProductIds, visible })
    );
    setSelectedProductIds([]);
    dispatch(fetchProducts(filters)); // Refresh list
  };

  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

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

  return (
    <div className="product-list">
      {isAdmin && (
        <div className="admin-actions-bar">
          <div className="selection-controls">
            <label className="select-all">
              <input
                type="checkbox"
                checked={
                  products?.length > 0 &&
                  selectedProductIds.length === products?.length
                }
                onChange={handleSelectAll}
                disabled={products?.length === 0}
              />
              Seleccionar todos
            </label>
            {selectedProductIds.length > 0 && (
              <span className="selection-count">
                {selectedProductIds.length} Productos seleccionados
              </span>
            )}
            
            <div className="bulk-buttons">
              <button
                className="btn-delete"
                onClick={handleBulkDelete}
                disabled={selectedProductIds.length === 0}
              >
                <RemoveIcon />
              </button>
              <button
                className="btn-visible"
                onClick={() => handleBulkVisibility(true)}
                disabled={selectedProductIds.length === 0}
              >
                <EyeIcon />
              </button>
              <button
                className="btn-hidden"
                onClick={() => handleBulkVisibility(false)}
                disabled={selectedProductIds.length === 0}
              >
                <EyeOffIcon />
              </button>
            </div>
          </div>

          <div className="bulk-actions">
            <button className="add-product-btn" onClick={handleAddProduct}>
              <AddProductIcon /> Agregar Producto
            </button>
          </div>
        </div>
      )}

      {products?.length === 0 ? (
        <div className="no-products">
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products?.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              isSelected={selectedProductIds.includes(product.product_id)}
              onToggleSelect={handleSelectProduct}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

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

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ProductList;
