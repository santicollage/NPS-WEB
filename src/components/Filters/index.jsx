import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCategories,
  selectCategoriesLoading,
} from '../../store/slices/categorySelectors';
import { selectProductsFilters } from '../../store/slices/productSelectors';
import { fetchCategories } from '../../store/slices/categorySlice';
import { setFilters, clearFilters } from '../../store/slices/productSlice';
import './Filters.scss';

const Filters = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const currentFilters = useSelector(selectProductsFilters);

  const [localFilters, setLocalFilters] = useState({
    category_id: currentFilters.category_id || '',
    name: currentFilters.name || '',
    min_price: currentFilters.min_price || '',
    max_price: currentFilters.max_price || '',
    sort_by: currentFilters.sort_by || 'created_at',
    sort_order: currentFilters.sort_order || 'desc',
  });

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...localFilters,
      category_id: localFilters.category_id || null,
      min_price: localFilters.min_price
        ? parseFloat(localFilters.min_price)
        : null,
      max_price: localFilters.max_price
        ? parseFloat(localFilters.max_price)
        : null,
      page: 1,
    };
    dispatch(setFilters(filtersToApply));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category_id: '',
      name: '',
      min_price: '',
      max_price: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    dispatch(clearFilters());
  };

  return (
    <div className="filters">
      <h3>Filtros de Productos</h3>

      <div className="inputs-container">
        <div className="filter-group">
          <label>Nombre del producto:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={localFilters.name}
            onChange={handleInputChange}
            placeholder="Buscar por nombre..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category_id">Categoría:</label>
          <select
            id="category_id"
            name="category_id"
            value={localFilters.category_id}
            onChange={handleInputChange}
            disabled={categoriesLoading}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-group">
          <label>Precio:</label>
          <div className="price-inputs">
            <input
              type="number"
              name="min_price"
              value={localFilters.min_price}
              onChange={handleInputChange}
              placeholder="Mín"
              min="0"
              step="0.01"
            />
            <span>-</span>
            <input
              type="number"
              name="max_price"
              value={localFilters.max_price}
              onChange={handleInputChange}
              placeholder="Máx"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="sort_by">Ordenar por:</label>
          <select
            id="sort_by"
            name="sort_by"
            value={localFilters.sort_by}
            onChange={handleInputChange}
          >
            <option value="created_at">Fecha de creación</option>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort_order">Orden:</label>
          <select
            id="sort_order"
            name="sort_order"
            value={localFilters.sort_order}
            onChange={handleInputChange}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={handleApplyFilters} className="apply-btn">
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="clear-btn btn-secondary"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
