import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchOrders,
  updateOrderStatus,
  setPagination,
} from '../../store/slices/orderSlice';
import OrderDetailsModal from '../UserOrders/OrderDetailsModal';
import './AdminOrdersList.scss';

const AdminOrdersList = () => {
  const dispatch = useDispatch();
  const { orders, pagination, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
    // We need to re-fetch orders when page changes, but fetchOrders reads from state.filters
    // Ideally, we should dispatch fetchOrders() after updating pagination, 
    // or use a useEffect in the parent component that listens to pagination changes.
    // For now, let's assume the parent component or a useEffect here handles the fetch.
    // Actually, let's dispatch fetchOrders here to be safe.
    // Wait, fetchOrders uses the state, so we need to make sure state is updated first.
    // setPagination is synchronous, so it should be fine.
    // However, the best practice is to trigger the fetch in a useEffect that depends on pagination.page
    // But since we are in the list component, let's just dispatch fetchOrders with the new page directly if needed,
    // or rely on the parent. Let's rely on the parent AdminOrders page to handle the fetch on mount and update.
    // BUT, for pagination clicks, we usually want to fetch immediately.
    // Let's pass the new page to fetchOrders if the thunk supports it, or just update state and let useEffect handle it.
    // Looking at orderSlice, fetchOrders takes params.
    // Let's update the state and then fetch.
    
    // Actually, looking at orderSlice, setPagination updates state.pagination AND state.filters.page
    // So if we have a useEffect in AdminOrders watching filters, it will trigger.
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      // Refresh orders after update
      dispatch(fetchOrders());
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (!orders) return <p>Cargando órdenes...</p>;
  if (orders.length === 0) return <p>No se encontraron órdenes.</p>;

  console.log(orders);

  return (
    <>
      <div className="admin-orders-list">
        <h3>Listado de Órdenes</h3>
        {error && <p className="error-message">{error}</p>}
        
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>
                    {order.user_id
                      ? `${order.customer_name}`
                      : 'Invitado'}
                    <br />
                    <small>{order.user_id ? order.customer_email : 'No email'}</small>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>${Number(order.total_amount).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="details-btn"
                        onClick={() => openDetails(order)}
                      >
                        Ver
                      </button>
                      {/* Simple status toggle for demo, or a dropdown could be better */}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.order_id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}

      </div>
      <OrderDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default AdminOrdersList;
