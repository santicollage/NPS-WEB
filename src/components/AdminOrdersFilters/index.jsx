import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearStatus } from '../../store/slices/orderSlice';
import './AdminOrdersFilters.scss';

const AdminOrdersFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.orders);

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    sortBy: filters.sortBy || 'created_at',
    sortOrder: filters.sortOrder || 'desc',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    dispatch(setFilters({ ...localFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setLocalFilters(clearedFilters);
    dispatch(setFilters({ ...clearedFilters, page: 1 }));
  };

  return (
    <div className="admin-orders-filters">
      <h3>Filtrar Órdenes</h3>
      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">Buscar (Nombre/Email)</label>
          <input
            type="text"
            id="search"
            name="search"
            value={localFilters.search}
            onChange={handleInputChange}
            placeholder="Ej: Juan Perez"
          />
        </div>

        {/* Status */}
        <div className="filter-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            name="status"
            value={localFilters.status}
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label htmlFor="startDate">Fecha Inicio</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">Fecha Fin</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleInputChange}
          />
        </div>

        {/* Price Range */}
        <div className="filter-group price-group">
          <label>Rango de Precio</label>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleInputChange}
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label htmlFor="sortBy">Ordenar por</label>
          <select
            id="sortBy"
            name="sortBy"
            value={localFilters.sortBy}
            onChange={handleInputChange}
          >
            <option value="created_at">Fecha</option>
            <option value="price">Precio</option>
            <option value="name">Cliente</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sortOrder">Orden</label>
          <select
            id="sortOrder"
            name="sortOrder"
            value={localFilters.sortOrder}
            onChange={handleInputChange}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button className="clear-btn btn-secondary" onClick={handleClearFilters}>
          Limpiar
        </button>
        <button className="apply-btn" onClick={handleApplyFilters}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersFilters;
