import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';
import AdminOrdersFilters from '../../components/AdminOrdersFilters';
import AdminOrdersList from '../../components/AdminOrdersList';
import './AdminOrders.scss';
import LineGlow from '../../components/LineGlow';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h1>Gestión de Pedidos</h1>
        <p>Administra y filtra los pedidos de los usuarios.</p>
      </div>
      
      <section className="filters-section">
        <AdminOrdersFilters />
      </section>

      <LineGlow width="95%" />

      <section className="list-section">
        <AdminOrdersList />
      </section>
    </div>
  );
};

export default AdminOrders;
